from . import *
import imutils
from skimage.morphology import skeletonize


class Matchmaker:
    """
        Instances of this class try to find a match between a template and the image of the field.
        """
    TEMPLATES = "maps/templates/"
    SKELETON = "sk_"
    FOOTBALL = "football"
    TENNIS = "tennis"
    EXT = ".png"

    FULL = "_full"
    FRAME = "_frame"
    CENTER = "_center"
    BOT = "_bot"
    TOP = "_top"
    PARTS = [FULL, FRAME, CENTER, BOT, TOP]
    COLORS = {
        FULL: (0, 1, 0),
        FRAME: (1, 0, 0),
        CENTER: (0, 0, 1),
        TOP: (0, 1, 1),
        BOT: (1, 0, 1)
    }
    THICKNESS = {
        FOOTBALL: 4,
        TENNIS: 2
    }

    def detect_templates(self, image, sport):
        image = cv2.imread(self.TEMPLATES + sport + self.EXT)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        grades = {}

        for part in self.PARTS:
            template = cv2.imread(self.TEMPLATES + sport + part + self.EXT, flags=cv2.IMREAD_GRAYSCALE)
            (tH, tW) = template.shape[:2]
            found = None

            for scale in np.linspace(0.4, 0.8, 30)[::-1]:
                resized = imutils.resize(gray, width=int(gray.shape[1] * scale))
                r = gray.shape[1] / float(resized.shape[1])

                if resized.shape[0] < tH or resized.shape[1] < tW:
                    break

                edged = cv2.Canny(resized, 50, 200)
                result = cv2.matchTemplate(edged, template, cv2.TM_CCOEFF)
                (_, maxVal, _, maxLoc) = cv2.minMaxLoc(result)

                if found is None or maxVal > found[0]:
                    found = (maxVal, maxLoc, r)

            (maxVal, maxLoc, r) = found
            (startX, startY) = (int(maxLoc[0] * r)), (int(maxLoc[1] * r))
            (endX, endY) = (int((maxLoc[0] + tW) * r)), (int((maxLoc[1] + tH) * r))

            if part == self.FRAME:
                startX += self.THICKNESS[sport]
                startY += self.THICKNESS[sport]
                endX -= self.THICKNESS[sport]
                endY -= self.THICKNESS[sport]

            scaled_match = maxVal / 10E7
            color = np.array(self.COLORS[part]) * int(255 * min(1.0, scaled_match))
            color = (int(color[0]), int(color[1]), int(color[2]))
            cv2.rectangle(image, (startX, startY), (endX, endY), color, self.THICKNESS[sport])
            grades[part] = scaled_match
        cv2.imwrite(self.TEMPLATES + "match.png", image)

    def skeletonize_all(self):
        import glob
        import os
        templates = [os.path.basename(f) for f in glob.glob(self.TEMPLATES + "*.png") if
                     f not in glob.glob(self.TEMPLATES + self.SKELETON + "*.png")]
        for filename in templates:
            template = cv2.imread(self.TEMPLATES + filename, flags=cv2.IMREAD_GRAYSCALE)
            template[np.where(template > 0)] = 1
            template = skeletonize(template)
            plt.imsave(self.TEMPLATES + self.SKELETON + filename, template, cmap='gray')
