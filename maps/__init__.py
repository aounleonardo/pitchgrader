import json
import sys, glob, os.path
import argparse

import numpy as np
from matplotlib import pyplot as plt
import cv2

JSON = '.json'
OSM = 'osm/'
DATA = OSM + 'data/'
PROCESSED = DATA + 'processed/'
HOUGHED = DATA + 'houghed/'
IMAGES = 'maps/images/'
MASKS = 'maps/masks/'
PROCESSED_IMAGES = IMAGES + 'processed/'
ROTATED_IMAGES = IMAGES + 'rotated/'
HOUGHED_IMAGES = IMAGES + 'houghed/'
CROPPED_IMAGES = IMAGES + 'cropped/'
HOUGH = "_hough"

RAW = IMAGES + 'raw/'
EXT = '.png'
MASK = "_mask"
SMALL = "_sm"
FOOTBALL_MASK_PREFIX = MASKS + "hough_football_mask"
TENNIS_MASK_PREFIX = MASKS + "hough_tennis_mask"

FMASKS = ["_bot", "_center", "_top", "_right", "_left", "_inner_bot_left", "_inner_bot_right", "_inner_bot",
          "_inner_top_left", "_inner_top_right", "_inner_top"]
CMASKS = ["_circle"]
TMASKS = ["_bot", "_center", "_top", "_right", "_left", "_inner_bot", "_inner_top", "_inner_right", "_inner_left"]

CURSOR_UP_ONE = '\x1b[1A'
ERASE_LINE = '\x1b[2K'


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


def verify_json_in_filename(filename):
    if not filename.endswith('.json'):
        filename += JSON
    json_files = [os.path.basename(f) for f in glob.glob(HOUGHED + "*" + JSON)]
    if not filename in json_files:
        raise Exception("this json file doesn't exists")
    return filename


def read(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        print("FILE:", filename)
        data = json.load(file)
        return data


def write(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=None)
