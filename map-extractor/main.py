# https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Red_and_Blue:ROM_map
# https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Red_and_Blue:Notes
# https://bulbapedia.bulbagarden.net/wiki/User:Tiddlywinks/Map_header_data_structure_in_Generation_I
# https://github.com/huderlem/RBMap
# http://skeetendo.proboards.com/thread/15/rgby-map-headers

import base64
from io import BytesIO
import json
from PIL import Image

BANK_SIZE = 0x4000
TILE_WH = 8
BLOCK_WH = 4
BYTES_PER_PX = 3
BLOCK_TILE_WH = BLOCK_WH * TILE_WH

COLORS = [0xffffff, 0x909090, 0x404040, 0x000000,
          0xffaaaa, 0xCC9090, 0x502020, 0x300000]

rom = open('./red.gb', 'rb')


def load_tilesets():
    tileset_blocks = []

    for offset in range(24):
        rom.seek(0xC7BE + offset * 12)
        bank_id = int.from_bytes(rom.read(1), byteorder="little")
        block_ptr = int.from_bytes(rom.read(2), byteorder='little') % BANK_SIZE + bank_id * BANK_SIZE
        tile_ptr = int.from_bytes(rom.read(2), byteorder='little') % BANK_SIZE + bank_id * BANK_SIZE
        collision_ptr = int.from_bytes(rom.read(2), byteorder='little')  # % BANK_SIZE + bank_id * BANK_SIZE

        rom.seek(collision_ptr)
        free_tiles = []
        for c in range(256):
            read = rom.read(1)
            tile_num = int.from_bytes(read, byteorder="little")
            if 0xFF == tile_num:
                break
            free_tiles.append(tile_num)

        tiles = load_tiles(tile_ptr)

        blocks = load_blocks(block_ptr, tiles, free_tiles)
        tileset_blocks.append(blocks)
    return tileset_blocks


def load_tiles(tile_ptr):
    loaded_tiles = []
    rom.seek(tile_ptr)
    for offset in range(256):
        tile_data = rom.read(16)
        tile_colour_indexes = []
        for i in range(TILE_WH):
            lo = tile_data[i * 2]
            hi = tile_data[i * 2 + 1]
            for j in range(TILE_WH):
                bit = 7 - j
                color_index = (((hi >> bit) & 1) << 1) | ((lo >> bit) & 1)
                tile_colour_indexes.append(color_index)
        loaded_tiles.append(tile_colour_indexes)
    return loaded_tiles


def load_blocks(block_ptr, tiles, tile_collision):
    rom.seek(block_ptr)
    block_imgs = []
    blocks_collision = []
    for blockNum in range(256):
        block = rom.read(16)
        block_color_indexes = [0] * TILE_WH * TILE_WH * BLOCK_WH * BLOCK_WH
        block_collision = [0] * 4
        for bh in range(BLOCK_WH):
            for bw in range(BLOCK_WH):
                tile_index = block[bh * BLOCK_WH + bw]
                y = 0
                if tile_index in tile_collision:
                    block_collision[(int(bh / 2))*2 + (int(bw / 2))] = 1
                    y = 4
                for th in range(TILE_WH):
                    for tw in range(TILE_WH):
                        h = BLOCK_TILE_WH * (bh * TILE_WH + th)
                        w = tw + TILE_WH * bw
                        block_color_indexes[h + w] = tiles[tile_index][th * TILE_WH + tw] + y
        block_imgs.append(block_color_indexes)
        blocks_collision.append(block_collision)
    return block_imgs, blocks_collision


class MapHeaderConnection:
    connected_map_index: int
    connected_map_block_ptr: int
    current_map_start_ptr_ram: int


class MapHeader:
    tileset_index: int
    map_height: int
    map_width: int
    block_data_ptr: int
    north: MapHeaderConnection
    south: MapHeaderConnection
    west: MapHeaderConnection
    east: MapHeaderConnection
    object_data_ptr: int
    block_bank: int


def load_maps():
    tilesets = load_tilesets()

    unused_maps = [11, 69, 75, 78, 105, 106, 107, 109, 110, 111, 112, 114, 115, 116, 117, 173, 204, 205, 206, 231, 237,
                   238, 241, 242, 243, 244]

    world = dict()
    for offset in [i for i in range(247) if i not in unused_maps]:

        rom.seek(0x01AE + offset * 2)
        map_header_loc = int.from_bytes(rom.read(2), byteorder="little")
        rom.seek(0xC23D + offset)
        map_header_bank_loc = int.from_bytes(rom.read(1), byteorder="little")

        rom.seek(map_header_loc % BANK_SIZE + map_header_bank_loc * BANK_SIZE)

        header = MapHeader()
        header.tileset_index = int.from_bytes(rom.read(1), byteorder="little")
        header.map_height = int.from_bytes(rom.read(1), byteorder="little")
        header.map_width = int.from_bytes(rom.read(1), byteorder="little")
        header.block_data_ptr = int.from_bytes(rom.read(2), byteorder="little")
        rom.read(4)
        header.block_bank = map_header_bank_loc

        connections = int.from_bytes(rom.read(1), byteorder="little")

        def read_connection():
            con = MapHeaderConnection()
            con.connected_map_index = int.from_bytes(rom.read(1), byteorder="little")
            con.connected_map_block_ptr = int.from_bytes(rom.read(2), byteorder="little")
            con.current_map_start_ptr_ram = int.from_bytes(rom.read(2), byteorder="little")
            rom.read(6)
            return con

        if connections & 0x8 > 0:
            header.north = read_connection()
        if connections & 0x4 > 0:
            header.south = read_connection()
        if connections & 0x2 > 0:
            header.west = read_connection()
        if connections & 0x1 > 0:
            header.east = read_connection()

        world[offset] = generate_images(header, tilesets)

        # decode = base64.b64decode(map_data["imageData"])
        # with open('eh{}.png'.format(offset), 'wb') as f:
        #     f.write(decode)
    with open('world.json', 'w') as json_file:
        json.dump(world, json_file)


def generate_images(header, tilesets):
    rom.seek(header.block_data_ptr % BANK_SIZE + header.block_bank * BANK_SIZE)

    tileset = tilesets[header.tileset_index][0]
    tileset_collision = tilesets[header.tileset_index][1]

    map_blocks = []
    map_collision = []
    for block_index in range(header.map_height * header.map_width):
        index = int.from_bytes(rom.read(1), byteorder="little")
        map_blocks.append(tileset[index])
        map_collision.append(tileset_collision[index])

    rbg_image_data = bytearray(header.map_height * header.map_width * BLOCK_TILE_WH * BLOCK_TILE_WH * BYTES_PER_PX)
    collision_data = [0] * header.map_height * header.map_width * 2 * 2

    for mh in range(header.map_height):
        for mw in range(header.map_width):
            block = map_blocks[mh * header.map_width + mw]
            for bh in range(BLOCK_TILE_WH):
                for bw in range(BLOCK_TILE_WH):
                    color_index = block[BLOCK_TILE_WH * bh + bw]
                    color_bytes = COLORS[color_index].to_bytes(length=BYTES_PER_PX, byteorder="big")
                    h = BLOCK_TILE_WH * header.map_width * (mh * BLOCK_TILE_WH + bh)
                    w = bw + BLOCK_TILE_WH * mw
                    for b in range(BYTES_PER_PX):
                        rbg_image_data[(h + w) * 3 + b] = color_bytes[b]

            block_collision = map_collision[mh * header.map_width + mw]
            for bh in range(2):
                for bw in range(2):
                    h = 2 * header.map_width * (mh * 2 + bh)
                    w = bw + 2 * mw
                    collision_data[h + w] = block_collision[2 * bh + bw]

    image = Image.frombytes('RGB', (32 * header.map_width, 32 * header.map_height), bytes(rbg_image_data))
    # image.save('eh{}.png'.format(offset))

    with BytesIO() as output:
        image.save(output, format="PNG")
        contents = output.getvalue()
        map_pair = dict()
        map_pair["imageData"] = base64.b64encode(contents).decode('ascii')
        map_pair["collisionData"] = collision_data
        return map_pair


def export():
    pass


load_maps()
