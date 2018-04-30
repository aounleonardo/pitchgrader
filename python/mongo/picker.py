from .client import Client
from functools import reduce
import numpy as np


class Picker:
    client = Client()

    FULL = "_full"
    FRAME = "_frame"
    CENTER = "_center"
    BOT = "_bot"
    TOP = "_top"
    PARTS = [FULL, FRAME, CENTER, BOT, TOP]
    SCORES = {
        FULL: 0.6,
        FRAME: 0.1,
        CENTER: 0.1,
        BOT: 0.1,
        TOP: 0.1
    }

    ASCENDING = 1
    DESCENDING = -1

    def pick(self, field_id, rows=1, row_range=0.1, order=DESCENDING, limit=0, fun="similarity", fun_order=DESCENDING):
        field = self.client.field_by_id("football", field_id)
        if field is None:
            field = self.client.field_by_id("tennis", field_id)
        sport = field["facility"]
        score = field["score"]
        table = []
        for row in range(rows):
            start = score + (order * row * row_range)
            end = start + (order * row_range)
            for_range = self.client.get_for_score(sport, start, other_score=end, limit=limit)
            sorted_range = self._sort_neighbours(field, for_range, fun, order)
            table.append(sorted_range)
        return table

    def _sort_neighbours(self, field, neighbours, fun, order):
        sorting_function = {
            "colour": self._colour_distance,
            "similarity": self._parts_similarity
        }[fun]
        return sorted(neighbours, key=lambda neighbour: (order * sorting_function(field, neighbour)))

    def _parts_similarity(self, field, other):
        this_grades = field["grades"]
        other_grades = other["grades"]
        merged_grades = Picker._grades_and(this_grades, other_grades)
        return self._score_grades(merged_grades)

    @staticmethod
    def _colour_distance(field, other):
        this_colour = np.array(field["average_colour"])
        other_colour = np.array(other["average_colour"])
        return np.linalg.norm(other_colour - this_colour)

    @staticmethod
    def _grades_and(a, b):
        return dict(map(lambda item: (item[0], min(item[1], b[item[0]])), a.items()))

    def _score_grades(self, grades):
        score = 0
        for part in self.PARTS:
            score += grades[part] * self.SCORES[part]
        return score
