import json
import sys, glob, os.path
import argparse
import requests

from request_builder import create_requests

OSM = '../osm/'
DATA = OSM + 'data/'
PROCESSED = DATA + 'processed/'
IMAGES = 'images/'
RAW = IMAGES + 'raw/'
EXT = '.png'
MASK = "_mask"
JSON = '.json'

CURSOR_UP_ONE = '\x1b[1A'
ERASE_LINE = '\x1b[2K'

def main(args):
    data = read(PROCESSED + args.filename)
    num_polygons = len(data) - args.start if args.end == -1 else min(args.end - args.start, len(data) - args.start)
    print("Start.")
    for polygon in range(args.start, args.start + num_polygons, 1):
        image, mask = process_polygon(data[polygon], args.force)
        print(CURSOR_UP_ONE + ERASE_LINE + "Processed " + str(1+ polygon - args.start) + " polygons out of " + str(num_polygons))
    print("Done.")
    return

def process_polygon(polygon, force):
    filename = maskname = RAW + polygon.get("id")
    maskname += MASK + EXT
    filename += EXT

    image_request, mask_request = create_requests(polygon)
    image = mask = None

    if force or not os.path.exists(filename) or not os.path.exists(maskname):
        # First get the image
        image_response = requests.get(image_request)
        if image_response.status_code == 200:
            with open(RAW + polygon.get("id") + EXT, 'wb') as file:
                image = image_response.content
                file.write(image)
        del image_response

        # Second get the mask
        mask_response = requests.get(mask_request)
        if mask_response.status_code == 200:
            with open(RAW + polygon.get("id") + "_mask" + EXT, 'wb') as file:
                mask = mask_response.content
                file.write(mask)

    return image, mask

def read(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        print("FILE:", filename)
        data = json.load(file)
        return data

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Choose which images to download.')
    parser.add_argument('filename', metavar='canton_sport')
    parser.add_argument('-s', '--start', type=int, metavar='start_index', default=0)
    parser.add_argument('-e', '--end', type=int, metavar='end_index', default=-1, help='Polygon at this index is excluded')
    parser.add_argument('-f', '--force', action='store_true', default=False)
    args = parser.parse_args()
    if not args.filename.endswith('.json'):
        args.filename += JSON
    json_files = [os.path.basename(f) for f in glob.glob(PROCESSED + "*" + JSON)]
    if not args.filename in json_files:
        raise Exception("this json file doesn't exists")
    main(args)
