// declare map in global scope
var historicalDataMap = L.map('map',{
		center: [42.350,-71.065],
		zoom: 14,
		minZoom: 4,
		maxZoom: 18,
        zoomControl:false 
});

var geodata =  {
	"type": "FeatureCollection",
	"features": [{
	  "type": "Feature",
	  "properties": {
		"NAME_1": "Hayden",
		"NAME_2": "Harriet",
		"DESC_OCC": null,
		"RACE": "Black",
		"TYPE": "Person",
		"ACTION": "lived",
		"START_LOC": 1850.0,
		"END_LOC": 1889.0,
		"LAT": 42.360223,
		"LONG": -71.069049,
		"ORIG_ADDRESS": "66 Southac St",
	  },
	  "geometry": {
		"type": "Point",
		"coordinates": [-71.069049, 42.360223]
	  }
	},
	{
	  "type": "Feature",
	  "properties": {
		"NAME_1": "Henry",
		"NAME_2": "John",
		"DESC_OCC": "mariner",
		"RACE": "Black",
		"TYPE": "Person",
		"ACTION": "lived",
		"START_LOC": 1837.0,
		"END_LOC": 1865.0,
		"LAT": 42.36049,
		"LONG": -71.06505,
		"ORIG_ADDRESS": "Not Given",
	  },
	  "geometry": {
		"type": "Point",
		"coordinates": [-71.06505, 42.36049]
	  }
	 }
	]
};

function removeFeatures() {
	$( "#sidebar-content" ).html("<h2>Introduction to the site</h2> <p>Some ideas here</p>");
};

$( "#reset-button" ).click(function() {
	removeFeatures();
});

var historicalData = $.ajax({
    url: "data/historical_data.geojson",
    dataType: "json",
	success: console.log("Data load successful"),
	error: function(xhr) {
		alert(xhr.statusText)
	}
	});
	
function whenClicked(e) {
    // e = event
    var feature = e.target;
    $( "#sidebar-content" ).html("<h2>Updated sidebar with content</h2><br><strong>Name: " 
    + feature.feature.properties.NAME_2 + " " + feature.feature.properties.NAME_1 
    + "</strong><br><strong>Address: " + feature.feature.properties.ORIG_ADDRESS + "</strong>");
    };
      
function onEach(feature, layer) {
    layer.on({
        click: whenClicked
        });
    };

var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	minZoom: 0,
	maxZoom: 21,
	ext: 'png'
}).addTo(historicalDataMap);

L.geoJson(historicalData.responseJSON, //{
//	onEachFeature: onEach
//}
).addTo(historicalDataMap);


/*
	//call getdata function
	.addControl( L.control.zoom({position: 'bottomright'}) )

//function to retrieve map data and place it on the map
function getData(map){
	//baselayer
	var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 21,
		ext: 'png'
}).addTo(map);

	// attempt to define overlays and overlay group within the function
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

	var overlays = {
	"Beers, 1874" : Beers_1874,
	"Sanborn, 1867" : Sanborn_1867
	};

	L.control.layers(null, overlays).addTo(map);

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
*/