// declare map in global scope
var historicalDataMap;

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
};

//function to retrieve map data and place it on the map
function getData(map){
	//baselayer
    var Stamen_TonerLite = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 18,
        ext: 'png'
    }).addTo(map);

	var sidebar = L.control.sidebar('sidebar', {
		closeButton: false,
		position: 'left'
	});
	map.addControl(sidebar);
	
	setTimeout(function () {
		sidebar.show();
	}, 500);

	$( "#Home" ).click(function() {
		sidebar.setContent("<h1>Mapping Black Boston</h1><p>This is a test area for this project.</p>" +
		"<p>Mapping Black Boston is interactive discovery portal for Harvard Library resources in the Black history of Boston</p>" +
		"<p>Click on any point to learn about that place and find links to Harvard Library materials.</p>" +
		"<p>You can filter data and add overlays of historic maps by using the buttons buttons on the right.</p>");
	});	
		
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
	
	var McIntyre_1852 = L.tileLayer(
		'https://bburns.share.library.harvard.edu/tmsprojects/mcintyre_tiles/{z}/{x}/{y}.png', {	
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

	// Add Zoom layer here so it is on the bottom then add control for data
	map.addControl( L.control.zoom({position: 'bottomright'}) )
	var overlayControl = L.control.layers(overlays, null, { position: 'bottomright', collapsed: false }).addTo(map);

	// Function to return a very small radius for the max zoom
	/* map.on('zoomend')
	
	var getRadius = function () {
		if (map.getZoom() == 17){
			return 1
		}
		else { return 80}
	};
*/

//part that gets the data
 $.ajax("data/historical_data.geojson",{
	dataType: "json",
	 success: function(response){
		 var datapoints = response.features;

	// Use this divIcon as marker to make it keyboard accessible and not ugly
	var geojsonIcon = L.divIcon( {className: 'geojson-Icon'});
	var activeIcon = L.divIcon({className: 'geojson-Icon-active'});

	//create sidebar content in a function to call when the user takes an action
	function whenClicked(e) {
		// e = event
		var feature = e.target;

		// Change color of icon
		//feature.setIcon(activeIcon);

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

		content = display_name + " " + action + " here " + date + r_link_1 + r_link_2 + r_link_3 + "<br>" + notes + "<br>" + source;
		sidebar.setContent('<h1>Mapping Black Boston</h1>' + 
		'<h2>Information about this place</h2>' + content);
	};
		
	//Call all the geoJson data as individual layers for the map. 
	//Add filter options and event functions.
	var layerAll = L.geoJson(datapoints, {
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

	var layer1830 = L.geoJson(datapoints, {
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

	var layer1840 = L.geoJson(datapoints, {
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

	var layer1850 = L.geoJson(datapoints, {
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

	var layer1860 = L.geoJson(datapoints, {
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

	var layer1870 = L.geoJson(datapoints, {
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

	var layerResources = L.geoJson(datapoints, {
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
	
	var markers1830 = L.markerClusterGroup({ disableClusteringAtZoom: 17, spiderfyOnMaxZoom: false });
	markers1830.addLayer(layer1830);
	markers1830.on('clusterkeypress', function (a) {
		a.layer.zoomToBounds();
	});

	var markers1840 = L.markerClusterGroup({ disableClusteringAtZoom: 17, spiderfyOnMaxZoom: false });
	markers1840.addLayer(layer1840);
	markers1840.on('clusterkeypress', function (a) {
		a.layer.zoomToBounds();
	});

	var markers1850 = L.markerClusterGroup({ disableClusteringAtZoom: 17, spiderfyOnMaxZoom: false  });
	markers1850.addLayer(layer1850);
	markers1850.on('clusterkeypress', function (a) {
		a.layer.zoomToBounds();
	});

	var markers1860 = L.markerClusterGroup({ disableClusteringAtZoom: 17, spiderfyOnMaxZoom: false  });
	markers1860.addLayer(layer1860);
	markers1860.on('clusterkeypress', function (a) {
		a.layer.zoomToBounds();
	});

	var markers1870 = L.markerClusterGroup({ disableClusteringAtZoom: 17, spiderfyOnMaxZoom: false  });
	markers1870.addLayer(layer1870);
	markers1870.on('clusterkeypress', function (a) {
		a.layer.zoomToBounds();
	});

	var markersResources = L.markerClusterGroup({ disableClusteringAtZoom: 17, spiderfyOnMaxZoom: false  });
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

	var dataControl = L.control.layers(dataLayers, null, { position: 'bottomright', collapsed: false }).addTo(map);
		


// THREE IMPORTANT CLOSING BRACKETS AT THE END OF GETDATA() FUNCTION!
//bracket that closes out the async response. Don't erase!
}

//bracket that closes out the async call function. Don't erase!
});


//bracket that closes out the getData() function. Don't erase!
};


$(document).ready(createMap);