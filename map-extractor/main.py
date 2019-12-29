# https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Red_and_Blue:ROM_map
# https://bulbapedia.bulbagarden.net/wiki/User:Tiddlywinks/Map_header_data_structure_in_Generation_I
# https://github.com/huderlem/RBMap

from PIL import Image

BANK_SIZE = 0x4000
TILE_WH = 8
BLOCK_WH = 4
BYTES_PER_PX = 3
BLOCK_TILE_WH = BLOCK_WH * TILE_WH

COLORS = [0xffffff, 0x909090, 0x404040, 0x000000]

rom = open('./red.gb', 'rb')


def load_tilesets():
    tileset_blocks = []

    for offset in range(23):
        rom.seek(0xC7BE + offset * 12)
        bank_id = int.from_bytes(rom.read(1), byteorder="little")
        block_ptr = int.from_bytes(rom.read(2), byteorder='little') % BANK_SIZE + bank_id * BANK_SIZE
        tile_ptr = int.from_bytes(rom.read(2), byteorder='little') % BANK_SIZE + bank_id * BANK_SIZE
        tiles = load_tiles(tile_ptr)
        blocks = load_blocks(block_ptr, tiles)
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


def load_blocks(block_ptr, tiles):
    rom.seek(block_ptr)
    block_imgs = []
    for blockNum in range(256):
        block = rom.read(16)
        rgb_data = bytearray(TILE_WH * TILE_WH * BYTES_PER_PX * BLOCK_WH * BLOCK_WH)
        for bh in range(BLOCK_WH):
            for bw in range(BLOCK_WH):
                tile_index = block[bh * BLOCK_WH + bw]
                for th in range(TILE_WH):
                    for tw in range(TILE_WH):
                        h = TILE_WH * BLOCK_WH * (bh * TILE_WH + th)
                        w = tw + TILE_WH * bw
                        color_bytes = COLORS[tiles[tile_index][th * TILE_WH + tw]].to_bytes(length=BYTES_PER_PX,
                                                                                            byteorder="big")
                        for b in range(BYTES_PER_PX):
                            rgb_data[(h + w) * BYTES_PER_PX + b] = color_bytes[b]
        block_imgs.append(rgb_data)
    return block_imgs


def load_maps():

    tilesets = load_tilesets()

    for offset in range(241):
        rom.seek(0x01AE + offset * 2)
        map_header_loc = int.from_bytes(rom.read(2), byteorder="little") % BANK_SIZE
        rom.seek(0xC23D + offset)
        map_header_bank_loc = int.from_bytes(rom.read(1), byteorder="little")
        rom.seek(map_header_loc + map_header_bank_loc * BANK_SIZE)
        tileset_index = int.from_bytes(rom.read(1), byteorder="little")
        map_height = int.from_bytes(rom.read(1), byteorder="little")
        map_width = int.from_bytes(rom.read(1), byteorder="little")
        map_block_indexes_ptr = int.from_bytes(rom.read(2), byteorder="little") % BANK_SIZE

        rom.seek(map_block_indexes_ptr + map_header_bank_loc * BANK_SIZE)
        tileset = tilesets[tileset_index]
        map_blocks = []
        for block_index in range(map_height * map_width):
            map_blocks.append(tileset[block_index])
        rbg_image_data = bytearray(map_height * map_width * BLOCK_TILE_WH * BLOCK_TILE_WH * BYTES_PER_PX)
        for mh in range(map_height):
            for mw in range(map_width):
                block = map_blocks[mh * map_width + mw]
                for bh in range(BLOCK_TILE_WH):
                    for bw in range(BLOCK_TILE_WH * BYTES_PER_PX):
                        h = mh * map_width * BLOCK_TILE_WH * BYTES_PER_PX + mw * BLOCK_TILE_WH * BYTES_PER_PX + bw
                        w = BLOCK_TILE_WH * BYTES_PER_PX * mw + bw
                        temp = block[bh * BLOCK_TILE_WH * BYTES_PER_PX + bw]
                        rbg_image_data[h + w] = temp
        image = Image.frombytes('RGB', (32 * map_width, 32 * map_height), bytes(rbg_image_data))
        image.save('eh{}.png'.format(offset))


load_maps()
