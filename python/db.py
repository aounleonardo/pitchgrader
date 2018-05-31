from mongo import *

def convert_data():
    from mongo.converter import Converter
    c = Converter()
    c.convert_football()
    c.convert_tennis()
