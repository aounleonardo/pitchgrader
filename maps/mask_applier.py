from . import *

from .cvfun import align_vertically


class Masker:
    def apply_masks(self, filename):
        filename = verify_json_in_filename(filename)
        data = read(PROCESSED + filename)
        for field in data:
            field_id = field["id"]
            self.create_mask(field_id)
            print(CURSOR_UP_ONE + ERASE_LINE + "Processed " + field_id)
        print("done")

    @staticmethod
    def create_mask(id):
        img = cv2.imread(RAW + id + EXT)
        mask = cv2.imread(RAW + id + MASK + EXT)

        min_mask = np.array([0, 135, 254])
        max_mask = np.array([1, 136, 255])

        new_mask = cv2.inRange(mask, min_mask, max_mask)
        new_img = cv2.bitwise_and(img, img, mask=new_mask)

        cv2.imwrite(PROCESSED_IMAGES + id + EXT, new_img)
        cv2.imwrite(PROCESSED_IMAGES + id + MASK + EXT, new_mask)

    @staticmethod
    def rotate_field(id):
        image = cv2.imread(PROCESSED_IMAGES + id + EXT)
        mask = cv2.imread(PROCESSED_IMAGES + id + MASK + EXT)

        rotated_image, rotated_mask = align_vertically(image, mask)

        plt.imsave(ROTATED_IMAGES + id + EXT, rotated_image)
        plt.imsave(ROTATED_IMAGES + id + MASK + EXT, rotated_mask)
