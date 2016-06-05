
    // set view to first "rough" geolocation
    map.locate({setView: true,maxZoom:14});

        var circleProgress = L.circle([52, 4.375], 100 ,{color:'blue'}).addTo(map);

        function onAccuratePositionError (e) {
            alert("reload page")
        }

        function onAccuratePositionProgress (e) {

            map.setView(e.latlng);       
            map.removeLayer(circleProgress);
            circleProgress = L.circle(e.latlng, e.accuracy,{
                color:'blue'}).addTo(map);
            //locateFinished = true;
        }

        function onAccuratePositionFound (e) {
            map.setView(e.latlng, 13);
            //spinner.stop()
            map.removeLayer(circleProgress);
            circleProgress = L.circle(e.latlng, e.accuracy,{
                color:'blue'}).addTo(map);
            //alert(String(e.accuracy))
        }

        map.on('accuratepositionprogress', onAccuratePositionProgress);
        map.on('accuratepositionfound', onAccuratePositionFound);
        map.on('accuratepositionerror', onAccuratePositionError);


        map.findAccuratePosition({
            
            maxWait: 5000, // does not work if value is too small
            desiredAccuracy: 1
        });

    var disableMapInteractions = function () {
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        if (map.tap) {
            map.tap.disable();
        }
    };
    var enableMapInteractions = function () {
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        if (map.tap) {
            map.tap.enable();
        }
    };


    // add spinner for load screen
    var spinnerContainer = document.getElementsByTagName('body')[0];
    var spinner = new Spinner(spinnerOptions).spin(spinnerContainer);
    


    // add two sidebars
    var sidebar = L.control.sidebar('sidebar', {
        position: 'right'
    });
    map.addControl(sidebar);
       var chartbar = L.control.sidebar('chartbar', {
            position: 'right'
        });
        map.addControl(chartbar);

    var searchSidebar = L.control.sidebar('searchSidebar', {
        position: 'right'
    });

    map.addControl(searchSidebar);


    //add the scale
    L.control.scale({maxWidth:100}).addTo(map);

    
    //------------------
    var markers = new L.MarkerClusterGroup({
        showCoverageOnHover: false
    }).addTo(map);


    // MAYA -- do we want to change these icons???
    var editModeMarkerIcon = new L.Icon({
        iconUrl: 'icons/marker-icon-red.png',
        iconRetinaUrl: 'icons/marker-icon-red-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12, 40],
        popupAnchor: [1, -34],
        shadowUrl: 'icons/marker-shadow.png',
        shadowRetinaUrl: 'icons/marker-shadow.png',
        shadowSize: [50, 50],
        shadowAnchor: [15, 40]
    });

    //--------------------------------------------

    var createEditableMarker = function (latlng, options) {
        var marker = new L.MarkerClusterGroup.EditableMarker(latlng || map.getCenter(), L.extend({
            clusterGroup: markers,
            editModeIcon: editModeMarkerIcon,
            // symbols above marker
            toolbarEditIconClass: 'fa fa-lg fa-pencil-square-o',
            toolbarDeleteIconClass: 'fa fa-lg fa-trash-o',
            toolbarCloseIconClass: 'fa fa-times',
            showLabelOnEdit: true,
            getLabelContent: function () {
                var latlng = marker.getLatLng();
                var content = 'Drag marker and click edit button again.<br>' +
            '<b>Latitude:</b> ' + latlng.lat.toFixed(6) + '<br>' +
            '<b>Longitude:</b> ' + latlng.lng.toFixed(6);
                return content;
            },
            hideToolbarAfterEdit: false
        }, options ||  {}));
        //bounceOnAdd: true,
        marker.on('click', function () {
        marker.bounce({duration: 500, height: 100});
        });

        return marker;
    };
    
    var loadFinished = false;
    var isFirstLoad = true;

    // THIS NEEDS EDITTING BY EACH USER!!!!
    var wfst = new L.WFST({
    url: 'http://localhost:8080/geoserver/Raphael/ows',
    showExisting: false,
    typeNS: 'Raphael',
    typeName: 'events_all',
    //primaryKeyField: 'gid',

    crs: L.CRS.EPSG4326,
    geometryField: 'geom',
    pointToLayer: function (featureData, latlng) {
      return createEditableMarker(latlng);
    }
  });



    // Sidebar

    var showSidebar = function (marker) {
        sidebar._marker = marker;
        if (sidebar._marker.feature) {
            document.getElementById('idTextbox').value = sidebar._marker.feature.gid || '';
            if (sidebar._marker.feature.properties) {
                document.getElementById('event_name').value = sidebar._marker.feature.properties.event_name || '';
                //document.getElementById('user_location').value = sidebar._marker.feature.properties.user_location || '';
                document.getElementById('date_start').value = sidebar._marker.feature.properties.date_start || '';
                document.getElementById('stime').value = sidebar._marker.feature.properties.stime || '';
                document.getElementById('date_end').value = sidebar._marker.feature.properties.date_end || '';
                document.getElementById('etime').value = sidebar._marker.feature.properties.etime || '';
                e = document.getElementById('event_type');
                e.options[e.selectedIndex].value = sidebar._marker.feature.properties.event_type || '';
            }
            sidebar._onApplyBtnClick = function () {
                if (!sidebar._marker) {
                    return;
                }
                sidebar._marker.feature.properties = sidebar._marker.feature.properties || {};
                var propertiesChanged = false;
                var applyPropertyValue = function (property, value) {
                    if ((property || value) && property != value) {
                        property = value;
                        propertiesChanged = true;
                    }
                };
                sidebar._marker.feature.properties.event_name = document.getElementById('event_name').value || null;
                //sidebar._marker.feature.properties.user_location = document.getElementById('user_location').value || null;
                sidebar._marker.feature.properties.date_start = document.getElementById('date_start').value || null;
                sidebar._marker.feature.properties.stime = document.getElementById('stime').value || null;
                sidebar._marker.feature.properties.date_end = document.getElementById('date_end').value || null;
                sidebar._marker.feature.properties.etime = document.getElementById('etime').value || null;
                f = document.getElementById('event_type');
                sidebar._marker.feature.properties.event_type = f.options[f.selectedIndex].value || null;

                if (propertiesChanged) {
                    sidebar._marker.fire('marker:edited');
                }

                spinner.spin(spinnerContainer);
                wfst.save();

            };
            var applyBtn = document.getElementById('applyButton');
            L.DomEvent.on(applyBtn, 'click', sidebar._onApplyBtnClick);
        }
        sidebar.show();
    };

    var hideSidebar = function () {
        if (sidebar._marker && sidebar._marker._popupToolbar && sidebar._marker._popupToolbar._removeToolbar) {
            sidebar._marker._popupToolbar._removeToolbar();
        }
        var applyBtn = document.getElementById('applyButton');
        if (sidebar._onApplyBtnClick) {
            L.DomEvent.off(applyBtn, 'click', sidebar._onApplyBtnClick);
        }
        sidebar._marker = undefined;
        sidebar._onApplyBtnClick = undefined;
        sidebar.hide();
    };
    L.DomEvent.on(sidebar.getCloseButton(), 'click', function () {
        hideSidebar();
    });

    var addWfstMarker = function (marker) {
        marker.on('marker:edited', function () {
            wfst.editLayer(marker);
            //alert(marker.feature.gid)

        });
        marker.on('marker:deleted', function () {
            wfst.removeLayer(marker);
        });
        marker.on('popuptoolbar:shown', function () {
            showSidebar(marker);
        });
        marker.on('popuptoolbar:closed', function () {
            hideSidebar();
        });
        if (!markers.hasLayer(marker)) {
            markers.addLayer(marker);
        }
        if (!wfst.hasLayer(marker)) {
            wfst.addLayer(marker);
        }
    };

    // wfst.on('load', function (e) {
    //     spinner.stop();
    //     enableMapInteractions();
    //     markers.clearLayers();
    //     e.target.eachLayer(function (layer) {
    //         addWfstMarker(layer);
    //     });
    //     if (isFirstLoad) {
    //         map.fitBounds(markers);
    //         isFirstLoad = false;
    //     }
    //     loadFinished = true;
    // });
    
    spinner.stop();
    loadFinished = true;

    wfst.on('save:success', function (data) {
        spinner.stop();
        geojsonLayer.refresh(gurl);
    });
    wfst.on('save:error', function (data) {
        spinner.stop();
        alert('WFS-T save error occured. Take a look to console.');
        console.error('WFS-T save error');
        console.error(data);
    });



var onSearchBtnClick = function () {

var search = {};

                search.event_name = document.getElementById('searchevent_name').value;
                search.event_type = document.getElementById('searchevent').value;
                search.start_date = document.getElementById('searchstart_date').value;
                search.start_time = document.getElementById('searchstart_time').value;
                search.end_date = document.getElementById('searchend_date').value;
                search.end_time = document.getElementById('searchend_time').value;

                showWFS(search);

};

var searchBtn = document.getElementById('searchButton');
L.DomEvent.on(searchBtn, 'click', onSearchBtnClick);        


    // Toolbar
    new L.Toolbar.Control({
        position: 'topleft',
        actions: [
        //add the location button
        L.ToolbarAction.extend({
                options: {
                    toolbarIcon: {
                        className: 'fa fa-location-arrow'
                    }
                },
                addHooks: function () {


                    map.removeLayer(circleProgress);

                    map.findAccuratePosition({
                        maxWait: 5000, // does not work if value is too small
                        desiredAccuracy: 1
                    });



                    locateFinished = false;
                }
            }),
        //----------------------------------------
        //add the add marker button
        L.ToolbarAction.extend({
            options: {
                toolbarIcon: {
                    className: 'fa fa-map-marker'
                }
            },
            addHooks: function () {
                if (!loadFinished) {
                    return;
                }
                var newMarker = createEditableMarker(map.getCenter(), {
                    dontShowToolbarOnFirstClick: true
                    
                });
                newMarker.setIcon(newMarker.options.editModeIcon);
                getLabelContent = function () {
                    var latlng = newMarker.getLatLng();
                    var content = 'Click to finish adding.<br>' +
                '<b>Latitude:</b> ' + latlng.lat.toFixed(6) + '<br>' +
                '<b>Longitude:</b> ' + latlng.lng.toFixed(6);
                    return content;
                }

                

                var startAdding = function (e) {
                    newMarker.setLatLng(e.latlng);
                    map.addLayer(newMarker);
                    newMarker.bindLabel(getLabelContent(), {
                        noHide: true,
                        direction: 'auto',
                        pane: map.getPanes.popupPane
                    });
                    newMarker.showLabel();
                };
                var processAdding = function (e) {
                    if (map.hasLayer(newMarker)) {
                        newMarker.setLatLng(e.latlng);
                    }
                    ;
                    if (newMarker.label) {
                        newMarker.updateLabelContent(getLabelContent());
                    }
                };
                var finishAdding = function (e) {
                    map.off('mousemove', startAdding);
                    map.off('mousemove', processAdding);
                    map.off('click', finishAdding);
                    newMarker.off('click', finishAdding);
                    if (map.hasLayer(newMarker)) {
                        map.removeLayer(newMarker);
                    }
                    if (newMarker.label) {
                        newMarker.hideLabel();
                        newMarker.unbindLabel();
                    }
                    newMarker.setIcon(newMarker.options.normalModeIcon);
                    addWfstMarker(newMarker);

                };
                map.once('mousemove', startAdding);
                map.on('mousemove', processAdding);
                map.once('click', finishAdding);
                newMarker.once('click', finishAdding)
            }
        }),

        //add search button
                L.ToolbarAction.extend({
            options: {
                toolbarIcon: {
                    className: 'fa fa-search'
                }
            },
            addHooks: function () {
                if (!loadFinished) {
                    return;
                }
                //loadFinished = false;
                //disableMapInteractions();
                searchSidebar.show();
                //clickSearchBtn();


            }
        }),
         L.ToolbarAction.extend({
                       options: {
                           toolbarIcon: {
                               className: 'fa fa-building-o'
                           }
                       },
                       addHooks: function () {
                           if (!loadFinished) {
                               return;
                           }
                           chartbar.show();
                       }
                   })
      ]
    }).addTo(map);


// WFS request:
var showWFS = function(fet) {


    var url = 'http://localhost:8080/geoserver/Raphael/ows?';

    url += 'service=WFS&version=2.0.0&request=GetFeature&outputFormat=application/json&srsName=EPSG:4326&'

    url += 'typeName=Raphael:events_all&';

    // search - filter properties
    if(fet.event_name.length>0||
        fet.event_type.length>0||
        fet.end_time.length>0||
        fet.start_time.length>0||
        fet.start_date.length>0||
        fet.end_date.length>0){

        url += 'cql_filter=';
    }

    if(fet.event_type){
        url += 'event_type like \'' + fet.event_type + '\'&';
    };

    if(fet.event_name){
        url += 'event_name like \'' + fet.event_name + '\'&';
    };

    // if(fet.start_date){
    //     url += 'start_date > \'' + parseInt(fet.start_date) + '\'&';
    // };


    geojsonLayer.refresh(url);

    delete search;

};


//var addGeojsonLayer = function() {


var gurl = "http://localhost:8080/geoserver/Raphael/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Raphael:events_all&maxFeatures=1000&outputFormat=application%2Fjson"

var geojsonLayer = new L.GeoJSON.AJAX(gurl, 

{
        style: styleParams,
        onEachFeature: popUp

});

map.addLayer(geojsonLayer);


//};

//addGeojsonLayer();




 var popup = L.popup();

        markers.on('dblclick', function (event) {
            popup
               .setLatLng(event.latlng)
               .setContent('There is a ' + event.layer.feature.properties.event_name + ' (' +
               event.layer.feature.properties.event_type + ' event) <br /> at '
               +' <br/>from ' +
               event.layer.feature.properties.date_start + ' ' + event.layer.feature.properties.stime +
               '<br/> to ' + event.layer.feature.properties.date_end + ' ' + event.layer.feature.properties.etime)
               .openOn(map);
});





