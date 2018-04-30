from pymongo import MongoClient


class Client:
    _client = MongoClient()
    _db = _client.pitchgrader
    _vd_football = _db.vd_football
    _vd_tennis = _db.vd_tennis

    _sports = {"tennis": _vd_tennis,
               "football": _vd_football,
               "soccer": _vd_football}

    def insert(self, sport, field):
        ret_id = self._sports[sport].insert_one(field).inserted_id
        return ret_id

    def insert_all(self, sport, data):
        ret_ids = self._sports[sport].insert_many(data).inserted_ids
        return ret_ids

    def clear(self, sport):
        ret = self._sports[sport].remove({})
        return ret

    def field_by_id(self, sport, field_id):
        ret = self._sports[sport].find({"id": field_id}).limit(1)
        return ret.next() if ret.count() == 1 else None

    def get_for_score(self, sport, score, other_score=0, limit=0):
        small = min(score, other_score)
        large = max(score, other_score)
        ret = self._sports[sport].find({"score": {"$gte": small, "$lte": large}}).limit(limit)
        return list(ret)
