from . import *

from .cvfun import align_vertically

import matplotlib.pyplot as plt


class Rotater:
    def rotate_data(self, filename):
        filename = verify_json_in_filename(filename)
        data = read(PROCESSED + filename)
        for field in data:
            field_id = field["id"]
            image = cv2.imread(PROCESSED_IMAGES + field_id + EXT)
            mask = cv2.imread(PROCESSED_IMAGES + field_id + MASK + EXT)
            rotated_image, rotated_mask = align_vertically(image, mask)
            plt.imsave(arr=rotated_image, fname=ROTATED_IMAGES + field_id + EXT)
            plt.imsave(arr=rotated_mask, fname=ROTATED_IMAGES + field_id + MASK + EXT)
            print(CURSOR_UP_ONE + ERASE_LINE + "Processed " + field_id)
        print("done")
