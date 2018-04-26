from maps import *
from mongo import *


def convert_data():
    from mongo.converter import Converter
    c = Converter()
    c.convert_football()
    c.convert_tennis()


def get_images():
    from maps.image_getter import Getter
    g = Getter()
    g.main("vd_tennis", zoom=20)


def mask_images():
    from maps.mask_applier import Masker
    m = Masker()
    m.apply_masks("vd_tennis")


def rotate_images():
    from maps.image_rotater import Rotater
    r = Rotater()
    r.rotate_data("vd_tennis")


def grade_images():
    from maps.grader import Grader
    data = read(PROCESSED + "vd_football.json")
    g = Grader()
    new_data = g.grade_data(data)
    write(new_data, HOUGHED + "vd_football.json")
    print("done grading")


def score_images(filename):
    filename = verify_json_in_filename(filename)
    data = read(HOUGHED + filename)
    from maps.grader import Grader
    g = Grader()
    new_data = g.score_data(data)
    new_data = g.colour_data(new_data)
    write(new_data, HOUGHED + filename)


def crop_images():
    from maps.image_cropper import Cropper
    c = Cropper()
    data = read(HOUGHED + "vd_football.json")
    c.crop_all(data)
    print("done cropping")
