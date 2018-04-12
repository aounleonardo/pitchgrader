import json
import sys, glob, os.path
import argparse

JSON = '.json'
OSM = '../osm/'
DATA = OSM + 'data/'
PROCESSED = DATA + 'processed/'
IMAGES = 'images/'
PROCESSED_IMAGES = IMAGES + 'processed/'
RAW = IMAGES + 'raw/'
EXT = '.png'
MASK = "_mask"

def create_parser():
    parser = argparse.ArgumentParser(description='Choose which polygons to process.')
    parser.add_argument('filename', metavar='canton_sport')
    parser.add_argument('-s', '--start', type=int, metavar='start_index', default=0)
    parser.add_argument('-e', '--end', type=int, metavar='end_index', default=-1,
                        help='Polygon at this index is excluded')
    parser.add_argument('-f', '--force', action='store_true', default=False)
    return parser


def verify_json_in_args(args):
    if not args.filename.endswith('.json'):
        args.filename += JSON
    json_files = [os.path.basename(f) for f in glob.glob(PROCESSED + "*" + JSON)]
    if not args.filename in json_files:
        raise Exception("this json file doesn't exists")

def read(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        print("FILE:", filename)
        data = json.load(file)
        return data

def foo():
    print("Hello World!")