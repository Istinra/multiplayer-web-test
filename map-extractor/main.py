# https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Red_and_Blue:ROM_map
# https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Red_and_Blue:Notes
# https://bulbapedia.bulbagarden.net/wiki/User:Tiddlywinks/Map_header_data_structure_in_Generation_I
# https://github.com/huderlem/RBMap
# http://skeetendo.proboards.com/thread/15/rgby-map-headers

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
        collision_ptr = int.from_bytes(rom.read(2), byteorder='little') # % BANK_SIZE + bank_id * BANK_SIZE

        rom.seek(collision_ptr)
        free_tiles = []
        for c in range(256):
            read = rom.read(1)
            tile_num = int.from_bytes(read, byteorder="little")
            if 0xFF == tile_num:
                break
            free_tiles.append(tile_num)

        tiles = load_tiles(tile_ptr, free_tiles)
        
        blocks = load_blocks(block_ptr, tiles)
        tileset_blocks.append(blocks)
    return tileset_blocks


def load_tiles(tile_ptr, free_tiles):
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
                if offset in free_tiles:
                    color_index += 4
                tile_colour_indexes.append(color_index)
        loaded_tiles.append(tile_colour_indexes)
    return loaded_tiles


def load_blocks(block_ptr, tiles):
    rom.seek(block_ptr)
    block_imgs = []
    for blockNum in range(256):
        block = rom.read(16)
        block_color_indexes = [0] * TILE_WH * TILE_WH * BLOCK_WH * BLOCK_WH
        for bh in range(BLOCK_WH):
            for bw in range(BLOCK_WH):
                tile_index = block[bh * BLOCK_WH + bw]
                for th in range(TILE_WH):
                    for tw in range(TILE_WH):
                        h = BLOCK_TILE_WH * (bh * TILE_WH + th)
                        w = tw + TILE_WH * bw
                        block_color_indexes[h + w] = tiles[tile_index][th * TILE_WH + tw]
        block_imgs.append(block_color_indexes)
    return block_imgs


class Object(object):
    pass


def load_maps():
    tilesets = load_tilesets()

    unused_maps = [11, 69, 75, 78, 105, 106, 107, 109, 110, 111, 112, 114, 115, 116, 117, 173, 204, 205, 206, 231, 237,
                   238, 241, 242, 243, 244]

    connection_data = dict()

    for offset in [i for i in range(247) if i not in unused_maps]:

        rom.seek(0x01AE + offset * 2)
        map_header_loc = int.from_bytes(rom.read(2), byteorder="little")
        rom.seek(0xC23D + offset)
        map_header_bank_loc = int.from_bytes(rom.read(1), byteorder="little")

        rom.seek(map_header_loc % BANK_SIZE + map_header_bank_loc * BANK_SIZE)

        tileset_index = int.from_bytes(rom.read(1), byteorder="little")
        map_height = int.from_bytes(rom.read(1), byteorder="little")
        map_width = int.from_bytes(rom.read(1), byteorder="little")
        map_block_indexes_ptr = int.from_bytes(rom.read(2), byteorder="little")
        rom.read(4)

        connections = int.from_bytes(rom.read(1), byteorder="little")

        if connections & 0x8 > 0:
            north = Object()
            north.aa_map_ptr = map_block_indexes_ptr
            north.aa_map_bank = map_header_bank_loc
            north.aa_height = map_height
            north.aa_width = map_width
            north.con_index = int.from_bytes(rom.read(1), byteorder="little")
            north.connected_map_start_ptr = int.from_bytes(rom.read(2), byteorder="little")
            north.current_map_start_ptr = int.from_bytes(rom.read(2), byteorder="little")
            north.bigness = int.from_bytes(rom.read(1), byteorder="little")
            north.con_map_width = int.from_bytes(rom.read(1), byteorder="little")
            north.y_off = int.from_bytes(rom.read(1), byteorder="little")
            north.x_off = int.from_bytes(rom.read(1), byteorder="little")
            north.window = int.from_bytes(rom.read(2), byteorder="little")
            connection_data[offset] = north

        rom.seek(map_block_indexes_ptr % BANK_SIZE + map_header_bank_loc * BANK_SIZE)

        tileset = tilesets[tileset_index]
        map_blocks = []
        for block_index in range(map_height * map_width):
            map_blocks.append(tileset[int.from_bytes(rom.read(1), byteorder="little")])

        # rbg_image_data = bytearray(map_height * map_width * BLOCK_TILE_WH * BLOCK_TILE_WH * BYTES_PER_PX)
        # for mh in range(map_height):
        #     for mw in range(map_width):
        #         block = map_blocks[mh * map_width + mw]
        #         for bh in range(BLOCK_TILE_WH):
        #             for bw in range(BLOCK_TILE_WH):
        #                 color_index = block[BLOCK_TILE_WH * bh + bw]
        #                 color_bytes = COLORS[color_index].to_bytes(length=BYTES_PER_PX, byteorder="big")
        #                 h = BLOCK_TILE_WH * map_width * (mh * BLOCK_TILE_WH + bh)
        #                 w = bw + BLOCK_TILE_WH * mw
        #                 for b in range(BYTES_PER_PX):
        #                     rbg_image_data[(h + w) * 3 + b] = color_bytes[b]
        #
        # image = Image.frombytes('RGB', (32 * map_width, 32 * map_height), bytes(rbg_image_data))
        # image.save('eh{}.png'.format(offset))

    # pewder city
    pewter_city = connection_data[1]
    route_2 = connection_data[pewter_city.con_index]

    x_steps = (pewter_city.connected_map_start_ptr - route_2.aa_map_ptr) % route_2.aa_width

    print("done!")



load_maps()
