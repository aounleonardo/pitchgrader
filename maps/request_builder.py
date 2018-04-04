import json

filename = "test_football.json"

def read(filename):
    with open(filename) as file:
        data = json.load(file)
        return data

def create_requests(polygon):
    api = "https://maps.googleapis.com/maps/api/staticmap"
    zoom = 19
    size = 640
    scale = 2
    maptype = "satellite"
    coords = build_path(polygon.get("vertices"))
    key = "AIzaSyCbSK4DpQMnjtBcite62RK80LsPOnRELVg"

    path_color = "0xff8800ff"
    path_weight = 1
    path_fillcolor = "0xff8800ff"

    request = "{api}?zoom={zoom}&size={size}x{size}&scale={scale}&maptype={maptype}&visible={visible}".format(api=api,zoom=zoom,size=size,scale=scale,maptype=maptype,visible=coords)

    image_request = request + "&key={key}".format(key=key)
    mask_request = request + "&path=color:{color}|weight:{weight}|fillcolor:{fillcolor}|{path}&key={key}".format(color=path_color,weight=path_weight,fillcolor=path_fillcolor,path=coords,key=key)

    return image_request, mask_request

def build_path(vertices):
    ret = ""
    for vertex in vertices:
        ret += str(vertex[1]) + ',' + str(vertex[0]) + '|'
    return ret[:-1]

def main():
    data = read(filename)
    request = create_requests(data[2])
    print(request)

if __name__ == '__main__':
    main()
