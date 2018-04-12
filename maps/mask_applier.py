from __init__ import *

import numpy as np
import cv2


def main():
    parser = create_parser()
    args = parser.parse_args()
    verify_json_in_args(args)
    data = read(PROCESSED + args.filename)
    for field in data:
        create_mask(field["id"])
    print("done")

def create_mask(id):
    img = cv2.imread(RAW + id + EXT)
    mask = cv2.imread(RAW + id + MASK + EXT)

    min_mask = np.array([0, 135, 254])
    max_mask = np.array([1, 136, 255])

    new_mask = cv2.inRange(mask, min_mask, max_mask)
    new_img = cv2.bitwise_and(img, img, mask=new_mask)


    cv2.imwrite(PROCESSED_IMAGES + id + EXT, new_img)
    cv2.imwrite(PROCESSED_IMAGES + id + MASK + EXT, new_mask)

if __name__ == '__main__':
    main()