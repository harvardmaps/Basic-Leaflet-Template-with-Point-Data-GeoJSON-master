// declare map in global scope
var historicalDataMap;

//instantiate map 
function createMap(){
	 historicalDataMap = L.map('map',{
		center: [42.350,-71.065],
		zoom: 14,
		minZoom:4,
		maxZoom: 21,
		zoomControl:false
	});

	
	//call getdata function
	getData(historicalDataMap);
	historicalDataMap.addControl( L.control.zoom({position: 'bottomright'}) )
};

//function to retrieve map data and place it on the map
function getData(map){
	//baselayer
	var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 21,
		ext: 'png'
}).addTo(map);

	//  Failed attempt to define overlays and overlay group within the function
	var Sanborn_1867 = L.tileLayer('https://s3.us-east-2.wasabisys.com/urbanatlases/39999059012052/tiles/{z}/{x}/{-y}.png', {
		tms: true, 
		attribution: 'Leventhal Map & Education Center'
	});

	var Beers_1874 = L.tileLayer(
		'https://s3.us-east-2.wasabisys.com/urbanatlases/39999059015410/tiles/{z}/{x}/{-y}.png', {
			tms: true, 
			attribution: 'Leventhal Map & Education Center'
		}
	);

	var overlays = L.layerGroup(Beers_1874, Sanborn_1867);

	L.control.layers(basemap, overlays).addTo(map);


//part that gets the school data
 $.ajax("data/historical_data.geojson",{
	dataType: "json",
	 success: function(response){
		 var datapoints = response.features;

		//function for popup
		function buildPopupContent(datapoints,feature){
			name = "test";
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
						date = "from " + feature.feature.properties.START_LOC + " to " + feature.feature.properties.END_LOC + " ."
					}
				}
			}

			// Build the display notes and source
			if (feature.feature.properties.NOTES == null){
				notes = ""
			} else{
				notes = "<br>Notes: " + feature.feature.properties.NOTES
			}
			if (feature.feature.properties.SOURCE == null){
				source = ""
			} else {
				source = "<br>Source: " + feature.feature.properties.SOURCE
			}

			// Build the display record links
			if (feature.feature.properties.TITLE_1 == ""){
				r_link_1 = ""
			} else {
				r_link_1 = "<br>Records in HOLLIS include: <br>" + "<a href='" + feature.feature.properties.URL_1 + "'>" 
				+ feature.feature.properties.TITLE_1 + "</a>"
			}
			if (feature.feature.properties.TITLE_2 == ""){
				r_link_2 = ""
			} else {
				r_link_2 = "<br><a href='" + feature.feature.properties.URL_2 + "'>" 
				+ feature.feature.properties.TITLE_2 + "</a>"
			}
			if (feature.feature.properties.TITLE_3 == ""){
				r_link_3 = ""
			} else {
				r_link_3 = "<br><a href='" + feature.feature.properties.URL_3 + "'>" 
				+ feature.feature.properties.TITLE_3 + "</a>"
			}

			action = feature.feature.properties.ACTION
			type = feature.feature.properties.Type;

			content = display_name + " " + action + " here " + date + r_link_1 + r_link_2 + r_link_3 + notes + source;
			//content = "<strong>Name: </strong>" + name + "<br>" + "<strong>Address: </strong>" + address + "<br>" + "<strong>School type: </strong>" + type;
			feature.bindPopup(content);
		}

		//add geojson layer to map w/ unique symbology
		var schoolLayer = L.geoJSON(datapoints, {
			onEachFeature: buildPopupContent
		}).addTo(map);



// THREE IMPORTANT CLOSING BRACKETS AT THE END OF GETDATA() FUNCTION!
//bracket that closes out the async response. Don't erase!
}

//bracket that closes out the async call function. Don't erase!
});


//bracket that closes out the getData() function. Don't erase!
};


$(document).ready(createMap);

/*
var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 21,
		ext: 'png'
});

var Sanborn_1867 = L.tileLayer('https://s3.us-east-2.wasabisys.com/urbanatlases/39999059012052/tiles/{z}/{x}/{-y}.png', {
	tms: true, 
	attribution: 'Leventhal Map & Education Center'
});

var Beers_1874 = L.tileLayer(
	'https://s3.us-east-2.wasabisys.com/urbanatlases/39999059015410/tiles/{z}/{x}/{-y}.png', {
		tms: true, 
		attribution: 'Leventhal Map & Education Center'
	}
);

var overlays = L.layerGroup(Beers_1874, Sanborn_1867);

L.control.layers(basemap, overlays).addTo(historicalDataMap);
*/