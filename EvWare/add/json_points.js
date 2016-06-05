var jsonInput = {
    "type": "FeatureCollection",
    "totalFeatures": 50,
    "features": [{
        "type": "Feature",
        "id": "adres_delft.4276034",
        "geometry": {
            "type": "Point",
            "coordinates": [4.3625339021354375, 52.011761930845054, 0]
        },
        "geometry_name": "geopunt",
        "properties": {
            "openbareruimtenaam": "Beestenmarkt",
            "huisnummer": 20,
            "huisletter": null,
            "postcode": "2611GB",
            "woonplaatsnaam": "Delft"
        }
    }, {
        "type": "Feature",
        "id": "adres_delft.4277263",
        "geometry": {
            "type": "Point",
            "coordinates": [4.363219113665181, 52.011290600031174, 0]
        },
        "geometry_name": "geopunt",
        "properties": {
            "openbareruimtenaam": "Beestenmarkt",
            "huisnummer": 53,
            "huisletter": null,
            "postcode": "2611GA",
            //"woonplaatsnaam": "Delft"
        }
    }],
    "crs": {
        "type": "EPSG",
        "properties": {
            "code": "4326"
        }
    }
}


// these are point features; therefore either specify a (circle)marker, or be content with the default Leaflet marker
var styleParams = {};

var POI_example = CreGeojsonLayer(styleParams, jsonInput);
