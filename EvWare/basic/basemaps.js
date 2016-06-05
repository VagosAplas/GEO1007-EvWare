//MAYA --define the topographic map

var map = L.map('map').setView([52, 4.375], 3);


var basemap_street = new L.TileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'muha123.03h92nf8',
    //id: 'muha123.04hdff3n',
    accessToken: 'pk.eyJ1IjoibXVoYTEyMyIsImEiOiJjaW8yMjR5NWowMHhkdzNtMjd4dm1ncnF4In0.9pAVAkDrES1uVuyLhJo6OQ'
})
basemap_street.addTo(map);

//MAYA --define the aerial photo
var basemap_aerial = new L.TileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    //id: 'muha123.03h92nf8',
    id: 'muha123.04hdff3n',
    accessToken: 'pk.eyJ1IjoibXVoYTEyMyIsImEiOiJjaW8yMjR5NWowMHhkdzNtMjd4dm1ncnF4In0.9pAVAkDrES1uVuyLhJo6OQ'
})

//MAYA --define the labels of the map layers
var baseLayers = {
    "Topographical map": basemap_street,
    //"mapquest": mapquest
    "Aerial photo": basemap_aerial,
};

// MAYA --Control for switching layers on and off
L.control.layers(baseLayers).addTo(map);