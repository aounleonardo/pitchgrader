from .client import Client
from functools import reduce
import numpy as np


class Picker:
    client = Client()

    _foot_3 = ["_center", "_circle"]
    _foot_2 = ["_bot", "_top", "_left", "_right", "_inner_bot", "_inner_top"]
    _foot_1 = ["_inner_top_left", "_inner_top_right", "_inner_bot_left", "_inner_bot_right"]

    _tennis_3 = ["_top", "_bot"]
    _tennis_2 = ["_left", "_inner_left", "_inner_right", "_right"]
    _tennis_1 = ["_inner_bot", "_inner_top", "_center"]

    def choose_neighbours(self, sport, field_id, rows=0):
        field = self.client.field_by_id(sport, field_id)
        score = field["score"]
        table = []
        for deepness in range(0, rows):
            new_score = score - deepness
            for_score = self.client.get_for_score(sport, new_score)
            sorted_neighbours = self._sort_neighbours(field, for_score)
            table.append(sorted_neighbours)
        return table

    def _sort_neighbours(self, field, neighbours):
        return sorted(neighbours, key=lambda neighbour: (
            -self._lines_similarity(field, neighbour), self._colour_distance(field, neighbour)))

    def _lines_similarity(self, field, other):
        facility = field["facility"]
        this_lines = field["lines"]
        other_lines = other["lines"]
        merged_lines = Picker._lines_and(this_lines, other_lines)
        return self._score_lines(facility, merged_lines)

    @staticmethod
    def _colour_distance(field, other):
        this_colour = np.array(field["average_colour"])
        other_colour = np.array(other["average_colour"])
        return np.linalg.norm(other_colour - this_colour)

    @staticmethod
    def _lines_and(a, b):
        return dict(map(lambda item: (item[0], item[1] and b[item[0]]), a.items()))

    def _score_lines(self, sport, lines):
        is_tennis = sport == "tennis"
        grades_3 = self._tennis_3 if is_tennis else self._foot_3
        grades_2 = self._tennis_2 if is_tennis else self._foot_2
        grades_1 = self._tennis_1 if is_tennis else self._foot_1

        score = 0
        score += self._score_n(lines, grades_3, 3)
        score += self._score_n(lines, grades_2, 2)
        score += self._score_n(lines, grades_1, 1)
        return score

    def _score_n(self, lines, grades, n):
        return reduce(lambda a, b: a + b, list(map(lambda g: n if lines[g] else 0, grades)))
