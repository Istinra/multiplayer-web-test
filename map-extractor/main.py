# https://datacrystal.romhacking.net/wiki/Pok%C3%A9mon_Red_and_Blue:ROM_map
# https://bulbapedia.bulbagarden.net/wiki/User:Tiddlywinks/Map_header_data_structure_in_Generation_I
# https://github.com/huderlem/RBMap

from PIL import Image

colors = [0xffffff, 0x909090, 0x404040, 0x000000]

rom = open('./red.gb', 'rb')
rom.seek(0xC7BE)
bankId = int.from_bytes(rom.read(1), byteorder="little")
blockPtr = int.from_bytes(rom.read(2), byteorder='little') % 0x4000 + bankId * 0x4000
tilePtr = int.from_bytes(rom.read(2), byteorder='little') % 0x4000 + bankId * 0x4000


def load_tiles():
    loaded_tiles = []
    rom.seek(tilePtr)
    for offset in range(256):
        tile_data = rom.read(16)
        tile_colour_indexes = []
        for i in range(8):
            lo = tile_data[i * 2]
            hi = tile_data[i * 2 + 1]
            for j in range(8):
                bit = 7 - j
                color_index = (((hi >> bit) & 1) << 1) | ((lo >> bit) & 1)
                tile_colour_indexes.append(color_index)
        loaded_tiles.append(tile_colour_indexes)
    return loaded_tiles


tiles = load_tiles()


def load_blocks():
    rom.seek(blockPtr)
    for blockNum in range(256):
        block = rom.read(16)
        rgb_data = bytearray(8 * 8 * 3 * 4 * 4)
        for bh in range(4):
            for bw in range(4):
                tile_index = block[bh * 4 + bw]
                for th in range(8):
                    for tw in range(8):
                        h = 8 * 4 * (bh * 8 + th)
                        w = tw + 8 * bw
                        color_bytes = colors[tiles[tile_index][th * 8 + tw]].to_bytes(length=3, byteorder="big")
                        for b in range(3):
                            rgb_data[(h + w) * 3 + b] = color_bytes[b]
        image = Image.frombytes('RGB', (32, 32), bytes(rgb_data))
        image.save('eh{}.png'.format(blockNum))


load_blocks()


