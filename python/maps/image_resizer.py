from . import *

import cv2

class Resizer():
    tennis_width = 200
    football_width = 300

    width = {
        "football": football_width,
        "soccer": football_width,
        "tennis": tennis_width
    }

    def resize_all(self, data):
        for field in data:
            image = self._resize_field(field)
            cv2.imwrite(RESIZED_IMAGES + field["id"] + EXT, image)
            print(CURSOR_UP_ONE + ERASE_LINE + "Processed " + field["id"])

    def _resize_field(self, field):
        facility = field["facility"]
        id = field["id"]
        image = cv2.imread(CROPPED_IMAGES + id + MATCH + EXT)
        (height, width) = image.shape[:2]
        new_height = height * (self.width[facility] / width)
        res = cv2.resize(image, (self.width[facility], int(new_height)))
        return res
