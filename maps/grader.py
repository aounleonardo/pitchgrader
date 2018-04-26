from . import *
from .cvfun import analyze_football, analyze_tennis, average_colour_center
from functools import reduce

import cv2


# reference tennis: way_32663107

class Grader:
    foot_3 = ["_center", "_circle"]
    foot_2 = ["_bot", "_top", "_left", "_right", "_inner_bot", "_inner_top"]
    foot_1 = ["_inner_top_left", "_inner_top_right", "_inner_bot_left", "_inner_bot_right"]

    tennis_3 = ["_top", "_bot"]
    tennis_2 = ["_left", "_inner_left", "_inner_right", "_right"]
    tennis_1 = ["_inner_bot", "_inner_top", "_center"]

    def grade_data(self, data):
        new_data = []
        for field in data:
            new_field, hough_image = self.grade_field(field)
            new_data.append(new_field)
            cv2.imwrite(HOUGHED_IMAGES + field["id"] + EXT, hough_image)
            print(CURSOR_UP_ONE + ERASE_LINE + "Processed " + field["id"])
        return new_data

    def grade_field(self, field):
        ret = field.copy()
        id = field["id"]
        facility = field["facility"]
        image = cv2.imread(ROTATED_IMAGES + id + EXT)
        outline = cv2.imread(ROTATED_IMAGES + id + MASK + EXT, flags=cv2.IMREAD_GRAYSCALE)
        kernel_size = 13 if facility == "tennis" else 37
        blurred_outline = cv2.GaussianBlur(outline, (kernel_size, kernel_size), 0)

        if facility == "tennis":
            lines, hough_image = analyze_tennis(image, blurred_outline)
        else:
            lines, hough_image = analyze_football(image, blurred_outline)

        ret["count"] = self.count(lines)
        ret["lines"] = lines
        return ret, hough_image

    def score_data(self, data):
        new_data = []
        for field in data:
            new_field = self.score_field(field)
            new_data.append(new_field)
        return new_data

    def score_field(self, field):
        ret = field.copy()
        isTennis = field["facility"] == "tennis"
        grades_3 = self.tennis_3 if isTennis else self.foot_3
        grades_2 = self.tennis_2 if isTennis else self.foot_2
        grades_1 = self.tennis_1 if isTennis else self.foot_1

        score = 0
        score += self.score_n(field["lines"], grades_3, 3)
        score += self.score_n(field["lines"], grades_2, 2)
        score += self.score_n(field["lines"], grades_1, 1)

        ret["score"] = score
        return ret

    def score_n(self, lines, grades, n):
        return reduce(lambda a, b: a + b, list(map(lambda g: n if lines[g] else 0, grades)))

    def count(self, lines):
        l = list(lines.values())
        return l.count(True)

    def colour_data(self, data):
        new_data = []
        for field in data:
            new_field = self.average_colour(field)
            new_data.append(new_field)
        return new_data

    def average_colour(self, field):
        ret = field.copy()
        image = cv2.imread(ROTATED_IMAGES + field["id"] + EXT)
        average = average_colour_center(image)
        ret["average_colour"] = average
        return ret

    def create_smaller_masks(self):
        import cv2
        masks = [os.path.basename(f) for f in glob.glob(MASKS + "*")]
        for maskname in masks:
            if not maskname.endswith('_sm.png'):
                mask = cv2.imread(MASKS + maskname, flags=cv2.IMREAD_GRAYSCALE)
                kernel_size = 13 if "tennis" in maskname else 37
                ret = cv2.GaussianBlur(mask, (kernel_size, kernel_size), 0)
                cv2.imwrite(MASKS + maskname[:-4] + "_sm" + EXT, ret)
        return masks
