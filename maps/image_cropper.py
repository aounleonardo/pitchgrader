from . import *

import cv2


class Cropper:
    football_tl = (100, 140)
    football_br = (1210, 1110)

    tennis_tl = (370, 510)
    tennis_br = (900, 790)

    """
    which means the dimensions are:
    football: width = 970 --- height = 1110 ===> ratio = 1.14 or 0.87
    tennis: width = 280 --- height = 530 ===> ratio = 1.89 or 0.53
    
    
    """

    def crop_all(self, data):
        for field in data:
            image, hough = self.crop(field)
            cv2.imwrite(CROPPED_IMAGES + field["id"] + EXT, image)
            cv2.imwrite(CROPPED_IMAGES + field["id"] + HOUGH + EXT, hough)
            print(CURSOR_UP_ONE + ERASE_LINE + "Processed " + field["id"])

    def crop(self, field):
        facility = field["facility"]
        id = field["id"]
        return self.crop_tennis(id) if facility == "tennis" else self.crop_football(id)

    def crop_football(self, id):
        image = cv2.imread(ROTATED_IMAGES + id + EXT)
        hough = cv2.imread(HOUGHED_IMAGES + id + EXT)
        ret_image = image[self.football_tl[0]:self.football_br[0], self.football_tl[1]:self.football_br[1]]
        ret_hough = hough[self.football_tl[0]:self.football_br[0], self.football_tl[1]:self.football_br[1]]
        return ret_image, ret_hough

    def crop_tennis(self, id):
        image = cv2.imread(ROTATED_IMAGES + id + EXT)
        hough = cv2.imread(HOUGHED_IMAGES + id + EXT)
        ret_image = image[self.tennis_tl[0]:self.tennis_br[0], self.tennis_tl[1]:self.tennis_br[1]]
        ret_hough = hough[self.tennis_tl[0]:self.tennis_br[0], self.tennis_tl[1]:self.tennis_br[1]]
        return ret_image, ret_hough
