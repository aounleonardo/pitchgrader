from __init__ import *
from numpy import *

import scipy.stats as stats
import pylab as pl

EARTH_AREA = 5.10072E14



def main():
    parser = create_parser()
    args = parser.parse_args()
    verify_json_in_args(args)
    data = read(PROCESSED + args.filename)

    areas = []
    for i in range(0, len(data), 1):
        areas.append(area(data[i]["vertices"]))

    h = sorted(areas)
    fit = stats.norm.pdf(h, mean(h), std(h))
    pl.plot(h, fit, '-o')
    pl.hist(h, normed=True)
    pl.show()


def area(coordinates):
    sum = 0
    prevcolat = 0
    prevaz = 0
    colat0 = 0
    az0 = 0

    for i, [lon, lat] in enumerate(coordinates):
        colat = 2 * arctan2(sqrt(pow(sin(lat * pi / 360), 2) + cos(lat * pi / 180) * pow(sin(lon * pi / 360), 2)),
                            sqrt(1 - pow(sin(lat * pi / 360), 2) - cos(lat * pi / 180) * pow(sin(lon * pi / 360), 2)))
        az = 0
        if lat >= 90:
            az = 0
        elif lat <= -90:
            az = pi
        else:
            az = arctan2(cos(lat * pi / 180) * sin(lon * pi / 180), sin(lat * pi / 180) % (2 * pi))

        if i == 0:
            colat0 = colat
            az0 = az
        else:
            sum += (1 - cos(prevcolat + (colat - prevcolat) / 2)) * pi * (
                    (abs(az - prevaz) / pi) - 2 * ceil(((abs(az - prevaz) / pi) - 1) / 2)) * sign(az - prevaz)

        prevcolat = colat
        prevaz = az

    sum += (1 - cos(prevcolat + (colat0 - prevcolat) / 2)) * (az0 - prevaz)
    ret = EARTH_AREA * min(abs(sum) / (4 * pi), 1 - abs(sum) / (4 * pi))
    return ret


if __name__ == '__main__':
    main()
