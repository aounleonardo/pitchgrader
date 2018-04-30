from . import *

from skimage.measure import label, regionprops
from skimage.transform import rotate


def vertical_orientation(mask):
    mask = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
    label_img = label(mask)
    regions = regionprops(label_img)

    if len(regions) < 1:
        return 0

    ori = regions[0].orientation
    degs = -np.rad2deg(ori + np.pi / 2)
    return degs


def align_vertically(image, mask):
    degs = vertical_orientation(mask)

    rotated_image = rotate(image, degs)
    rotated_mask = rotate(mask, degs)

    return rotated_image, rotated_mask


def analyze_football(image, blurred_outline):
    ret = {}
    hough_image = np.zeros(image.shape)

    for fmask in FMASKS:
        filename = FOOTBALL_MASK_PREFIX + fmask + EXT
        filename_sm = FOOTBALL_MASK_PREFIX + fmask + SMALL + EXT
        mask = cv2.imread(filename, flags=cv2.IMREAD_GRAYSCALE)
        mask_sm = cv2.imread(filename_sm, flags=cv2.IMREAD_GRAYSCALE)

        minimum_line_length = 100 if 'inner' in fmask else 400 if 'center' in fmask else 600
        lines = detect_lines(image, mask, mask_sm, blurred_outline, min_line_length=minimum_line_length)
        has_line = lines is not None and len(lines) > 0
        ret[fmask] = has_line
        if has_line:
            draw_lines(lines, hough_image)

    for cmask in CMASKS:
        filename = FOOTBALL_MASK_PREFIX + cmask + EXT
        filename_sm = FOOTBALL_MASK_PREFIX + cmask + SMALL + EXT
        mask = cv2.imread(filename, flags=cv2.IMREAD_GRAYSCALE)
        mask_sm = cv2.imread(filename_sm, flags=cv2.IMREAD_GRAYSCALE)

        circles = detect_circles(image, mask, mask_sm, blurred_outline)
        has_circle = circles is not None and len(circles) > 0
        ret[cmask] = has_circle
        if has_circle:
            draw_circles(circles, hough_image)

    return ret, hough_image


def analyze_tennis(image, blurred_outline):
    ret = {}
    hough_image = np.zeros(image.shape)

    for tmask in TMASKS:
        filename = TENNIS_MASK_PREFIX + tmask + EXT
        filename_sm = TENNIS_MASK_PREFIX + tmask + SMALL + EXT
        mask = cv2.imread(filename, flags=cv2.IMREAD_GRAYSCALE)
        mask_sm = cv2.imread(filename_sm, flags=cv2.IMREAD_GRAYSCALE)

        minimum_line_length = 300 if ('left' in tmask or 'right' in tmask) else 100
        lines = detect_lines(image, mask, mask_sm, blurred_outline, min_line_length=minimum_line_length)
        has_line = lines is not None and len(lines) > 0
        ret[tmask] = has_line
        if has_line:
            draw_lines(lines, hough_image)
    return ret, hough_image


def draw_circles(circles, canvas):
    if circles is not None:
        for circle in circles[0]:
            cv2.circle(canvas, (circle[0], circle[1]), circle[2], (0, 0, 255), 3)
    return canvas


def draw_lines(lines, canvas):
    for line in lines:
        for x1, y1, x2, y2 in line:
            cv2.line(canvas, (x1, y1), (x2, y2), (255, 0, 0), 3)
    return


def detect_edges(image, mask, msk, blur):
    img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # mask = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
    # msk = cv2.cvtColor(mask_sm, cv2.COLOR_BGR2GRAY)
    kernel_size = 3
    img = cv2.GaussianBlur(img, (kernel_size, kernel_size), 0)
    # Edge Detection using Canny
    low_threshold = 30
    high_threshold = 70
    img = cv2.bitwise_and(img, img, mask=mask)
    img = cv2.Canny(img, low_threshold, high_threshold)
    img = cv2.bitwise_and(img, img, mask=msk)
    return cv2.bitwise_and(img, img, mask=blur)


def detect_circles(img, mask, mask_sm, blur):
    edges = detect_edges(img, mask, mask_sm, blur)
    # Hough Circles
    dp = 1  # if dp=1 , the accumulator has the same resolution as the input image. If dp=2 , the accumulator has half as big width and height.
    min_dist = 50
    param1 = 100
    param2 = 37
    min_radius = 50
    max_radius = 100

    circles = cv2.HoughCircles(edges, cv2.HOUGH_GRADIENT, dp, minDist=min_dist, param1=param1, param2=param2,
                               minRadius=min_radius, maxRadius=max_radius)

    return circles


def detect_lines(img, mask, mask_sm, blur, min_line_length=200):
    # minimum number of pixels making up a line

    edges = detect_edges(img, mask, mask_sm, blur)
    # Hough Lines
    rho = 1  # distance resolution in pixels of the Hough grid
    theta = np.pi / 180  # angular resolution in radians of the Hough grid
    threshold = 15  # minimum number of votes (intersections in Hough grid cell)
    max_line_gap = 30  # maximum gap in pixels between connectable line segments

    # Run Hough on edge detected image
    # Output "lines" is an array containing endpoints of detected line segments
    lines = cv2.HoughLinesP(edges, rho, theta, threshold, np.array([]),
                            min_line_length, max_line_gap)

    return lines


def average_colour_center(image):
    colour_mask = cv2.imread(MASKS + "colour_pick" + EXT, flags=cv2.IMREAD_GRAYSCALE)
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    average = cv2.mean(rgb, mask=colour_mask)
    return average[0:3]


def rate_line(img, line):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    x1, y1, x2, y2 = line[0]
    mask = np.zeros(img.shape[0:2], np.uint8)
    cv2.line(mask, (x1, y1), (x2, y2), (255, 255, 255), 1)

    color_average = cv2.mean(hsv, mask=mask)
    return color_average[1] < 140 and color_average[2] > 100


def rate_circle(img, circle):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    mask = np.zeros(img.shape[0:2], np.uint8)
    cv2.circle(mask, (circle[0], circle[1]), circle[2], (255, 255, 255))

    color_average = cv2.mean(hsv, mask=mask)
    return color_average[1] < 140 and color_average[2] > 90
