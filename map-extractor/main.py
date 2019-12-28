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

tiles = []

rom.seek(tilePtr)
for offset in range(256):
    firstTile = rom.read(16)
    # rgbData = bytearray((8 * 8) * 3)
    tileColors = []
    for i in range(8):
        lo = firstTile[i * 2]
        hi = firstTile[i * 2 + 1]
        for j in range(8):
            bit = 7 - j
            colorIndex = (((hi >> bit) & 1) << 1) | ((lo >> bit) & 1)
            tileColors.append(colorIndex)
            # colorBytes = colors[colorIndex].to_bytes(length=3, byteorder="big")
            # for k in range(3):
            #     rgbData[(i * 8 + j) * 3 + k] = colorBytes[k]
    # image = Image.frombytes('RGB', (8, 8), bytes(rgbData))
    # image.save('eh {}.png'.format(offset))
    tiles.append(tileColors)

rom.seek(blockPtr)

for blockNum in range(256):
    block = rom.read(16)
    rgbData = bytearray(8 * 8 * 3 * 4 * 4)
    for bh in range(4):
        for bw in range(4):
            tileIndex = block[bh * 4 + bw]
            for th in range(8):
                for tw in range(8):
                    h = 8 * 4 * (bh * 8 + th)
                    w = tw + 8 * bw
                    colorBytes = colors[tiles[tileIndex][th * 8 + tw]].to_bytes(length=3, byteorder="big")
                    for b in range(3):
                        rgbData[(h + w) * 3 + b] = colorBytes[b]
    image = Image.frombytes('RGB', (32, 32), bytes(rgbData))
    image.save('eh{}.png'.format(blockNum))


