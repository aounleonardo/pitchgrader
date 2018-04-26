from mongo import Picker
from maps import *

import numpy as np
import cv2

p = Picker()

"""
football: width = 970 --- height = 1110 ===> ratio = 1.14 or 0.87
tennis: width = 280 --- height = 530 ===> ratio = 1.89 or 0.53

A2 paper has 1.41 ratio and size in pixels: 4961 x 7016
A2 paper has 1.41 ratio and size in pixels: 3508 x 4961

so I should resize the height to 787 which means 73% 
then width would be 679, so I could fit 10 images wide
"""

width_a3 = 4961
height_a3 = 3508



def tennis(shrink=1.0):
    id = "way_32663107"
    id = "way_46672164"
    id = "way_46872281"
    id = "way_46949541"
    id = "way_67282118"
    id = "way_75373776"

    pad_hor = 80
    pad_ver = 120
    width_field = 280
    height_field = 530
    pick(id, "tennis", width_field, height_field, shrink, pad_ver, pad_hor)


def football(shrink=0.7):
    id = "way_32203592"
    id = "relation_2667199"
    id = "way_28334750"
    id = "way_32203592"
    id = "way_24845813"
    id = "relation_1272317"

    pad_hor = 30
    pad_ver = 30
    width_field = 930
    height_field = 1078
    pick(id, "football", width_field, height_field, shrink, pad_ver, pad_hor)


def pick(id, sport, width_field, height_field, shrink, pad_ver, pad_hor):
    width = int(shrink * width_field)
    height = int(shrink * height_field)

    rows = (height_a3 - pad_ver) // (height + pad_ver)
    cols = (width_a3 - pad_hor) // (width + pad_hor)

    if rows == 0:
        print("not enough height")
        return
    if cols == 0:
        print("not enough width")
        return

    canvas = np.ones((height_a3, width_a3, 3), dtype=np.uint8)
    houghs = np.ones((height_a3, width_a3, 3), dtype=np.uint8)

    p = Picker()
    neighbours = p.choose_neighbours(sport, id, rows=rows + 3)

    neighbour_row = 0
    row = pad_ver
    for r in range(rows):
        col = pad_hor
        while len(neighbours[neighbour_row]) < (cols // 2):
            neighbour_row += 1
        l = neighbours[neighbour_row]
        for c in range(cols):
            if c < len(l):
                nb = l[c]
                image = cv2.imread(CROPPED_IMAGES + nb["id"] + EXT)
                hough = cv2.imread(CROPPED_IMAGES + nb["id"] + HOUGH + EXT)
                image = cv2.resize(image, (width, height))
                hough = cv2.resize(hough, (width, height))
                canvas[row: row + height, col: col + width] = image
                houghs[row: row + height, col: col + width] = hough
            col += int(shrink * width_field) + pad_hor
        neighbour_row += 1
        row += int(shrink * height_field) + pad_ver

    can = cv2.resize(canvas, None, fx=.4, fy=.4)
    plt.imsave(arr=can, fname=(sport + '_midterm.png'))
    hoe = cv2.resize(houghs, None, fx=.4, fy=.4)
    plt.imsave(arr=hoe, fname=(sport + '_houghs.png'))


if __name__ == '__main__':
    # football()
    tennis(1.2)
