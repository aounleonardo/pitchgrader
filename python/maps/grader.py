from . import *
from .cvfun import analyze_football, analyze_tennis, average_colour_center
from .matcher import Matchmaker
from functools import reduce

import cv2


# reference tennis: way_32663107

class Grader:
    matchmaker = Matchmaker()
    FULL = "_full"
    FRAME = "_frame"
    CENTER = "_center"
    BOT = "_bot"
    TOP = "_top"
    COLOR = "_hue"
    UNIFORMITY = "_std"
    PARTS = [FULL, FRAME, CENTER, BOT, TOP]
    SCORES = {
        FULL: 0.6,
        FRAME: 0.1,
        CENTER: 0.1,
        BOT: 0.1,
        TOP: 0.1
    }

    def grade_data(self, data):
        return self._apply_to_data(data, self._grade_field)

    def score_data(self, data):
        return self._apply_to_data(data, self._score_field)

    def colour_data(self, data):
        return self._apply_to_data(data, self._average_colour)

    def _grade_field(self, field):
        ret = field.copy()
        id = field["id"]
        facility = field["facility"]
        image = cv2.imread(ROTATED_IMAGES + id + EXT)

        sport = "tennis" if facility == "tennis" else "football"

        grades, matched_image = self.matchmaker.detect_templates(image, sport)
        cv2.imwrite(MATCHED_IMAGES + id + EXT, matched_image)
        ret["grades"] = grades
        ret = self._score_field(ret)
        return ret

    def _score_field(self, field):
        ret = field.copy()
        grades = ret["grades"]
        score = 0
        for part in self.PARTS:
            score += grades[part] * self.SCORES[part]
        ret["score"] = score
        return ret

    def _apply_to_data(self, data, fun):
        new_data = []
        for field in data:
            new_field = fun(field)
            new_data.append(new_field)
            print(CURSOR_UP_ONE + ERASE_LINE + "Processed " + field["id"])
        return new_data

    @staticmethod
    def _average_colour(field):
        ret = field.copy()
        image = cv2.imread(ROTATED_IMAGES + field["id"] + EXT)
        average = average_colour_center(image)
        ret["average_colour"] = average
        return ret
