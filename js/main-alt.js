// declare map in global scope
var historicalDataMap;

//function to add the data to the map with controls to toggle layers
function dataLayer(data, map) {
	
	// define overlays and overlay group within the function
	var Sanborn_1867 = L.tileLayer('https://s3.us-east-2.wasabisys.com/urbanatlases/39999059012052/tiles/{z}/{x}/{y}.png', {
		attribution: 'Leventhal Map & Education Center'
	});

	var Beers_1874 = L.tileLayer(
		'https://s3.us-east-2.wasabisys.com/urbanatlases/39999059015410/tiles/{z}/{x}/{-y}.png', {
			tms: true, 
			attribution: 'Leventhal Map & Education Center'
		}
	);

    var Hopkins_1874 = L.tileLayer(
		'https://s3.us-east-2.wasabisys.com/urbanatlases/39999059010650/tiles/{z}/{x}/{y}.png', {
			attribution: 'Leventhal Map & Education Center'
		}
    );
    
	var overlays = {
    "Hopkins, 1874" : Hopkins_1874,
	"F. W. Beers & Co., 1874" : Beers_1874,
    "Sanborn, 1867" : Sanborn_1867
	};
	
	var geojsonMarkerOptions = {
        radius : 8,
        fillColor : "#0000ff",
        color : "000",
        weight : 1, 
        opacity : 1,
        fillOpacity : .8
	};
	
	//add filter options in control
	var layerAll = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
                click: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.circleMarker(latlng, geojsonMarkerOptions);
		}
	});

    var layer1830 = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
                click: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.circleMarker(latlng, geojsonMarkerOptions);
		},
		filter: function(feature) {
			return feature.properties.END_LOC <= 1830
		}
	});

	var layer1840 = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
                click: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.circleMarker(latlng, geojsonMarkerOptions);
		},
		filter: function(feature) {
			return feature.properties.END_LOC <= 1840 && feature.properties.END_LOC > 1830
		}
	});

	var layer1850 = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
                click: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.circleMarker(latlng, geojsonMarkerOptions);
		},
		filter: function(feature) {
			return feature.properties.END_LOC <= 1850 && feature.properties.END_LOC > 1840
		}
	});

	var layer1860 = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
                click: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.circleMarker(latlng, geojsonMarkerOptions);
		},
		filter: function(feature) {
			return feature.properties.END_LOC <= 1860 && feature.properties.END_LOC > 1850
		}
	});

	var layer1870 = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
                click: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.circleMarker(latlng, geojsonMarkerOptions);
		},
		filter: function(feature) {
			return feature.properties.END_LOC <= 1870 && feature.properties.END_LOC > 1860
		}
	});

	var layerResources = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
                click: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.circleMarker(latlng, geojsonMarkerOptions);
		},
		filter: function(feature) {
			return feature.properties.TITLE_1 != ""
		}
	});
	
	var markersAll = L.markerClusterGroup();
	markersAll.addLayer(layerAll);
	map.addLayer(markersAll);

	var markers1830 = L.markerClusterGroup();
	markers1830.addLayer(layer1830);

	var markers1840 = L.markerClusterGroup();
	markers1840.addLayer(layer1840);

	var markers1850 = L.markerClusterGroup();
	markers1850.addLayer(layer1850);

	var markers1860 = L.markerClusterGroup();
	markers1860.addLayer(layer1860);

	var markers1870 = L.markerClusterGroup();
	markers1870.addLayer(layer1870);

	var markersResources = L.markerClusterGroup();
	markersResources.addLayer(layerResources);

	var dataLayers = {
		"All data": markersAll,
		"Pre-1830": markers1830,
		"1831-1840": markers1840,
		"1841-1850": markers1850,
		"1851-1860": markers1860,
		"1861-1870": markers1870,
		"Has Library Resource": markersResources
	};

    L.control.layers(dataLayers, overlays, { collapsed: false }).addTo(map);
}

var datapoints = $.ajax({
    url: "data/historical_data.geojson",
    dataType: "json",
    success: console.log("tracts successfully loaded."),
    error: function(xhr) {
        alert(xhr.statusText)
    }
});

$.when(datapoints).done(function() {
    historicalDataMap = L.map('map',{
		center: [42.350,-71.065],
		zoom: 14,
		minZoom: 4,
		maxZoom: 18,
		zoomControl:false
    });

    historicalDataMap.addControl( L.control.zoom({position: 'bottomright'}) );

    var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 21,
        ext: 'png'
    }).addTo(historicalDataMap);

    dataLayer(datapoints, map)
});
