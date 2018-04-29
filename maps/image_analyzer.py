from __init__ import *

import numpy as np
import cv2

from cvfun import *
from grader import Grader

# Green Tennis
id = "way_67282118"  # tennis
id = "way_45083572"  # tennis

# Tennis
id = "way_74185938"  # tennis
id = "way_44784075"  # tennis
id = "relation_1272380"  # tennis
id = "way_79702320"  # tennis
id = "way_44684084"  # tennis

# Football
id = "relation_2667199"  # football
id = "way_32448585"  # football
id = "way_32663118"  # football
id = "way_33330951"  # football
id = "way_24634956"  # football


def main(args):
    data = read(HOUGHED + args.filename)
    grader = Grader()
    new_data = grader.colour_data(data)
    write(new_data, HOUGHED + args.filename)
    print("DONE")


if __name__ == '__main__':
    parser = create_parser()
    args = parser.parse_args()
    verify_json_in_args(args)
    main(args)
