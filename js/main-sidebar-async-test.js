// declare map in global scope
var historicalDataMap;


//create sidebar content
function whenClicked(e) {
    // e = event
    var feature = e.target;
    // Build the display name
	if (feature.feature.properties.NAME_2 == null){
		display_name = feature.feature.properties.NAME_1
	} else {
		if (feature.feature.properties.NAME_1 == null){
			display_name = feature.feature.properties.NAME_2
		} else {
			display_name = feature.feature.properties.NAME_2 + " " + feature.feature.properties.NAME_1
			}
        }
    
    // Build the display date
	if (feature.feature.properties.START_LOC == null && feature.feature.properties.END_LOC == null){
		date = "no date available."
	} else {
		if (feature.feature.properties.START_LOC == null){
			date = "in " + feature.feature.properties.END_LOC + "." 
		} else {
			if (feature.feature.properties.END_LOC == null){
				date = "since " + feature.feature.properties.START_LOC + "." 
			} else {
				date = "from " + feature.feature.properties.START_LOC + " to " + feature.feature.properties.END_LOC + "."
			}
		}
    }
    
    // Build the display notes and source
    if (feature.feature.properties.NOTES == null){
        notes = ""
    } else{
        notes = "<br><strong>Notes:</strong> " + feature.feature.properties.NOTES
    }
    if (feature.feature.properties.SOURCE == null){
        source = ""
    } else {
        source = "<br><strong>Source:</strong> " + feature.feature.properties.SOURCE
    }

    // Build the display record links
	if (feature.feature.properties.TITLE_1 == ""){
		r_link_1 = ""
	} else {
		r_link_1 = "<p>Records in HOLLIS include: <p>" + "<li><a href='" + feature.feature.properties.URL_1 + "'>" 
		+ feature.feature.properties.TITLE_1 + "</a></li>"
	}
	if (feature.feature.properties.TITLE_2 == ""){
		r_link_2 = ""
	} else {
		r_link_2 = "<li><a href='" + feature.feature.properties.URL_2 + "'>" 
		+ feature.feature.properties.TITLE_2 + "</a></li>"
	}
	if (feature.feature.properties.TITLE_3 == ""){
		r_link_3 = ""
	} else {
		r_link_3 = "<li><a href='" + feature.feature.properties.URL_3 + "'>" 
		+ feature.feature.properties.TITLE_3 + "</a></li>"
	}
    
    action = feature.feature.properties.ACTION
    type = feature.feature.properties.Type;

    content = display_name + " " + action + " here " + date + r_link_1 + r_link_2 + r_link_3 + notes + source;
    $( "#sidebar-content" ).html("<h2>Information on this location</h2>" + content);
    };

//function to add the data to the map with the display content
function dataLayer(data, map) {
	
	// attempt to define overlays and overlay group within the function
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
	
	var McIntyre_1852 = L.tileLayer(
		'https://bburns.share.library.harvard.edu/tmsprojects/mcintyre_tiles/{z}/{x}/{y}.png', {	
		//'https://bburns.share.library.harvard.edu/tmsprojects/McIntyreXYZ/{z}/{x}/{y}.png', {
			tms: true,
			attribution: 'Harvard Map Collection'
		}
    );
	
	var noLayer = L.tileLayer('');

	var overlays = {
		"McIntyre, 1852" : McIntyre_1852,
    	"Hopkins, 1874" : Hopkins_1874,
		"F. W. Beers & Co., 1874" : Beers_1874,
		"Sanborn, 1867" : Sanborn_1867,
		"None" : noLayer
	};
	
	var geojsonIcon = L.divIcon( {className: 'geojson-Icon'});
	
	//Call all the geoJson data as individual layers for the map. 
	//Add filter options and event functions. Use marker not circlemarker to get keyboard access.
	var layerAll = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
				click: whenClicked,
				keypress: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.marker(latlng, {icon: geojsonIcon});
		}
	});

    var layer1830 = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
				click: whenClicked,
				keypress: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.marker(latlng, {icon: geojsonIcon});
		},
		filter: function(feature) {
			return feature.properties.END_LOC <= 1830
		}
	});

	var layer1840 = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
				click: whenClicked,
				keypress: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.marker(latlng, {icon: geojsonIcon});
		},
		filter: function(feature) {
			return feature.properties.END_LOC <= 1840 && feature.properties.END_LOC > 1830
		}
	});

	var layer1850 = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
				click: whenClicked,
				keypress: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.marker(latlng, {icon: geojsonIcon});
		},
		filter: function(feature) {
			return feature.properties.END_LOC <= 1850 && feature.properties.END_LOC > 1840
		}
	});

	var layer1860 = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
				click: whenClicked,
				keypress: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.marker(latlng, {icon: geojsonIcon});
		},
		filter: function(feature) {
			return feature.properties.END_LOC <= 1860 && feature.properties.END_LOC > 1850
		}
	});

	var layer1870 = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
				click: whenClicked,
				keypress: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.marker(latlng, {icon: geojsonIcon});
		},
		filter: function(feature) {
			return feature.properties.END_LOC <= 1870 && feature.properties.END_LOC > 1860
		}
	});

	var layerResources = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
				click: whenClicked,
				keypress: whenClicked
            })
		},
		pointToLayer : function (feature, latlng) {
			return L.marker(latlng, {icon: geojsonIcon});
		},
		filter: function(feature) {
			return feature.properties.TITLE_1 != ""
		}
	});
	
	//Create markercluster groups for all the layers. Add a keypress listener for each cluster
	var markersAll = L.markerClusterGroup();
	markersAll.addLayer(layerAll);
	markersAll.on('clusterkeypress', function (a) {
		a.layer.zoomToBounds();
	});

	map.addLayer(markersAll);
	
	var markers1830 = L.markerClusterGroup();
	markers1830.addLayer(layer1830);
	markers1830.on('clusterkeypress', function (a) {
		a.layer.zoomToBounds();
	});

	var markers1840 = L.markerClusterGroup();
	markers1840.addLayer(layer1840);
	markers1840.on('clusterkeypress', function (a) {
		a.layer.zoomToBounds();
	});

	var markers1850 = L.markerClusterGroup();
	markers1850.addLayer(layer1850);
	markers1850.on('clusterkeypress', function (a) {
		a.layer.zoomToBounds();
	});

	var markers1860 = L.markerClusterGroup();
	markers1860.addLayer(layer1860);
	markers1860.on('clusterkeypress', function (a) {
		a.layer.zoomToBounds();
	});

	var markers1870 = L.markerClusterGroup();
	markers1870.addLayer(layer1870);
	markers1870.on('clusterkeypress', function (a) {
		a.layer.zoomToBounds();
	});

	var markersResources = L.markerClusterGroup();
	markersResources.addLayer(layerResources);
	markersResources.on('clusterkeypress', function (a) {
		a.layer.zoomToBounds();
	});
	
	//Add layers to controls and add controls to the map
	var dataLayers = {
		"All data": markersAll,
		"Pre-1830": markers1830,
		"1831-1840": markers1840,
		"1841-1850": markers1850,
		"1851-1860": markers1860,
		"1861-1870": markers1870,
		"Has Library Resource": markersResources
	};

	var dataControl = L.control.layers(dataLayers, null, { position: 'topright', collapsed: false }).addTo(map);
	var overlayControl = L.control.layers(overlays, null, { position: 'topright', collapsed: false }).addTo(map);
}

function removeFeatures() {
	$( "#sidebar-content" ).html("<h2>Introduction to the site</h2> <p>Some ideas here</p>");
};

$( "#reset-button" ).click(function() {
	removeFeatures();
});

//instantiate map 
function createMap(){
	 historicalDataMap = L.map('map',{
		center: [42.350,-71.065],
		zoom: 14,
		minZoom: 4,
		maxZoom: 18,
		zoomControl:false
	});

	//call getdata function
	getData(historicalDataMap);
	historicalDataMap.addControl( L.control.zoom({position: 'bottomright'}) )
};

//function to retrieve map data and place it on the map
function getData(map){
	//baselayer
    var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 21,
        ext: 'png'
    }).addTo(map);



//part that gets the data
 $.ajax("data/historical_data.geojson",{
	dataType: "json",
	 success: function(response){
		 var datapoints = response.features;

		//function for sidebar content
		dataLayer(datapoints, map)



// THREE IMPORTANT CLOSING BRACKETS AT THE END OF GETDATA() FUNCTION!
//bracket that closes out the async response. Don't erase!
}

//bracket that closes out the async call function. Don't erase!
});


//bracket that closes out the getData() function. Don't erase!
};


$(document).ready(createMap);