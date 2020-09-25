// declare map in global scope
var historicalDataMap;

function whenClicked(e) {
    // e = event
    var feature = e.target;
    $( "#sidebar-content" ).html("<h2>Updated sidebar with content</h2><br><strong>Name: " 
    + feature.feature.properties.NAME_2 + " " + feature.feature.properties.NAME_1 
    + "</strong><br><strong>Address: " + feature.feature.properties.ORIG_ADDRESS + "</strong>");
    };
   
function dataLayer(data, map) {
    var dataLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            layer.on({
                click: whenClicked
            })

        }
    });
    dataLayer.addTo(map)
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
		dataLayer(datapoints, map)



// THREE IMPORTANT CLOSING BRACKETS AT THE END OF GETDATA() FUNCTION!
//bracket that closes out the async response. Don't erase!
}

//bracket that closes out the async call function. Don't erase!
});


//bracket that closes out the getData() function. Don't erase!
};


$(document).ready(createMap);