from .client import Client
import json


class Converter:
    """
    Converts the json files I have to a mongo db.
    """
    client = Client()
    _houghed = "osm/data/houghed/"
    _matched = "osm/data/matched/"

    def _read(self, json_file):
        if not json_file.endswith('.json'):
            json_file += '.json'
        with open(self._matched + json_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
            return data

    def convert_football(self):
        self.client.clear("football")
        data = self._read("vd_football")
        ids = self.client.insert_all("football", data)
        return ids

    def convert_tennis(self):
        self.client.clear("tennis")
        data = self._read("vd_tennis")
        ids = self.client.insert_all("tennis", data)
        return ids
