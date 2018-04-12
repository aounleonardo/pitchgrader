from __init__ import *

import numpy as np
import cv2



# Green Tennis
id = "way_45083572"  # tennis
id = "way_67282118"  # tennis

# Tennis
id = "way_79702320"  # tennis
id = "way_44684084"  # tennis
id = "way_44784075"  # tennis
id = "way_74185938"  # tennis
id = "relation_1272380"  # tennis

# Football
id = "relation_2667199"  # football
id = "way_32663118"  # football
id = "way_33330951"  # football
id = "way_24634956"  # football
id = "way_32448585"  # football


def main():
    img = cv2.imread(PROCESSED_IMAGES + id + EXT)
    mask = cv2.imread(PROCESSED_IMAGES + id + MASK + EXT)
    mask = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
    processed = analyze_tennis(img, mask)


    cv2.imwrite(IMAGES + '_processed' + EXT, processed)
    cv2.imwrite(IMAGES + '_original' + EXT, img)
    print("DONE")

def analyze_football(image, mask):
    lower_b = (40, 0, 110)
    upper_b = (80, 220, 250)
    return detect_lines(image, lower_b, upper_b)

def analyze_tennis(image, mask):
    lower_b = (0, 0, 180)
    upper_b = (150, 110, 250)
    ret = gray_process(image, lower_b, upper_b)
    ret = cv2.bitwise_and(ret, mask)
    return ret


def gray_process(image, lower_b, upper_b):
    hsv = image.copy()
    hsv = cv2.cvtColor(hsv, cv2.COLOR_BGR2GRAY)
    # hsv = cv2.inRange(hsv, 165, 255)

    kernel_size = 3
    blur_img = cv2.GaussianBlur(hsv, (kernel_size, kernel_size), 0)
    # Edge detection using Canny
    low_threshold = 30
    high_threshold = 70
    hsv = cv2.Canny(blur_img, low_threshold, high_threshold)

    rho = 1  # distance resolution in pixels of the Hough grid
    theta = np.pi / 180  # angular resolution in radians of the Hough grid
    threshold = 15  # minimum number of votes (intersections in Hough grid cell)
    min_line_length = 50  # minimum number of pixels making up a line
    max_line_gap = 20  # maximum gap in pixels between connectable line segments
    line_image = np.copy(hsv) * 0  # creating a blank to draw lines on

    # Run Hough on edge detected image
    # Output "lines" is an array containing endpoints of detected line segments
    lines = cv2.HoughLinesP(hsv, rho, theta, threshold, np.array([]),
                            min_line_length, max_line_gap)

    for line in lines:
        for x1, y1, x2, y2 in line:
            cv2.line(line_image, (x1, y1), (x2, y2), (255, 0, 0), 5)

    hsv = cv2.addWeighted(hsv, 0.8, line_image, 1, 0)

    return hsv

def detect_lines(image, lower_b, upper_b):
    kernel_size = 3
    hsv = image.copy()
    # hsv = cv2.GaussianBlur(hsv, (kernel_size, kernel_size), 0)

    hsv = cv2.cvtColor(hsv, cv2.COLOR_BGR2HSV)
    hsv = cv2.inRange(hsv, lower_b, upper_b)

    # blur_gray = cv2.inRange(blur_gray, lowerb, upperb)

    # blur_img = cv2.GaussianBlur(hsv, (kernel_size, kernel_size), 0)
    # # Edge detection using Canny
    # low_threshold = 50
    # high_threshold = 100
    # hsv = cv2.Canny(blur_img, low_threshold, high_threshold)

    return hsv

if __name__ == '__main__':
    main()