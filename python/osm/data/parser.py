import json
import sys
import glob, os.path
from pprint import pprint

RAW = "raw/"
PROCESSED = "processed/"
EXT = ".geojson"
JSON = ".json"


# My keywords
ID = "id"
FACILITY = "facility"
VERTICES = "vertices"

# OSM keywords
NODE = "node"
WAY = "way"
RELATION = "relation"
OSM_PROPERTIES = "properties"
OSM_ID = "@id"
OSM_SPORT = "sport"
OSM_GEOMETRY = "geometry"
OSM_COORDINATES = "coordinates"


def main(filenames):
    for filename in filenames:
        raw_data = read(RAW + filename)
        processed_data = process(raw_data)
        write(processed_data, PROCESSED + os.path.splitext(filename)[0] + JSON)

def read(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        print("FILE:", filename)
        data = json.load(file)
        return data

def process(data):
    features = data.get("features", [])
    polygons = []
    print("Found {0} features".format(len(features)))
    for feature in features:
        polygon = {}
        id = feature.get(OSM_PROPERTIES).get(OSM_ID)
        facility = feature.get(OSM_PROPERTIES).get(OSM_SPORT)
        vertices = feature.get(OSM_GEOMETRY).get(OSM_COORDINATES)
        if verify_polygon(id, facility, vertices):
            polygon.update({ID: convert_id(id), FACILITY: facility, VERTICES: vertices[0]})
            polygons.append(polygon)
    print("\t{0} are valid polygons".format(len(polygons)))
    return polygons

def convert_id(id):
    return id.replace('/', '_')

def verify_polygon(id, facility, vertices):
    if id is None or not (id.startswith(WAY) or id.startswith(RELATION)):
        return False
    if facility is None:
        return False
    if vertices is None or len(vertices) != 1:
        return False
    return True

def write(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=None)

if __name__ == '__main__':
    argcount = len(sys.argv)
    if argcount < 2:
        raise ValueError("not enough arguments")
    raw_files = [os.path.basename(f) for f in glob.glob(RAW + "*" + EXT)]
    filenames = []
    for i in range(1, argcount):
        filename = sys.argv[i]
        if not filename.endswith(EXT):
            filename += EXT
        if filename in raw_files:
            filenames.append(filename)
    main(filenames)
