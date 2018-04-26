from . import *

import requests

from .request_builder import create_requests



class Getter:
    def main(self, filename, zoom=19, start=0, end=-1, force=False):
        if not filename.endswith('.json'):
            filename += JSON
        data = read(PROCESSED + filename)
        num_polygons = len(data) - start if end == -1 else min(end - start, len(data) - start)
        print("Start.")
        for polygon in range(start, start + num_polygons, 1):
            image, mask = self.process_polygon(data[polygon], force, zoom)
            print(CURSOR_UP_ONE + ERASE_LINE + "Processed " + str(1 + polygon - start) + " polygons out of " + str(
                num_polygons))
        print("Done.")
        return

    def process_polygon(self, polygon, force, zoom=19):
        filename = maskname = RAW + polygon.get("id")
        maskname += MASK + EXT
        filename += EXT

        image_request, mask_request = create_requests(polygon, zoom)
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
