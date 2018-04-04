// Create and render a feature collection from polygons.

var obj = {"id": "relation/1272313", "facility": "soccer", "vertices": [[6.60483, 46.514984], [6.6048272, 46.5149582], [6.6056923, 46.5149133], [6.6057859, 46.5158508], [6.6049798, 46.5158755], [6.6049256, 46.5158772], [6.6049214, 46.5158378], [6.60483, 46.514984]]}

var p = ee.Geometry.Polygon({
    coords: [[6.60483, 46.514984], [6.6048272, 46.5149582], [6.6056923, 46.5149133], [6.6057859, 46.5158508], [6.6049798, 46.5158755], [6.6049256, 46.5158772], [6.6049214, 46.5158378], [6.60483, 46.514984]],
    geodesic: false,
    maxError : 1
})

var cut = ee.Geometry.Polygon({
    coords: [[6.60483, 46.514984], [6.6048272, 46.5149582], [6.6056923, 46.5149133], [6.6057859, 46.5158508], [6.60483, 46.514984]],
    geodesic: false,
    maxError : 1
})

// Construct a FeatureCollection from a list of features.
var fc = ee.FeatureCollection([
  // Create each feature with a geometry and properties.
  ee.Feature(
      p, {name: 'Field', fill: 1})
]);

// Fill, then outline the polygons into a blank image.
var image = ee.Image('LANDSAT/LC08/T1_TOA/LC08_044034_20140318').clip(p);

Export.image.toAsset({
    image: image,
    description: "firstExport",
    assetId: obj["id"],
    region: p
});

Map.addLayer(image, {
    palette: '000000,FF0000,00FF00,0000FF',
    max: 3,
    opacity: 0.5
});

Map.setCenter(6.60483, 46.514984, 18);
