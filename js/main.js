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
}).addTo(historicalDataMap);



//part that gets the school data
 $.ajax("data/historical_data.geojson",{
	dataType: "json",
	 success: function(response){
		 var datapoints = response.features;

		//function for popup
		function buildPopupContent(datapoints,feature){
			name = "test";
			// I have this stuff commented out because your data is ... XML? 
			// But if the features were formatted as GeoJSON, you could use this syntax to grab properties 
			if (feature.feature.properties.NAME_2 == null){
				display_name = feature.feature.properties.NAME_1
			} else {
				if (feature.feature.properties.NAME_1 == null){
					display_name = feature.feature.properties.NAME_2
				} else {
					display_name = feature.feature.properties.NAME_2 + " " + feature.feature.properties.NAME_1
				}
			}
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
			action = feature.feature.properties.ACTION
			race = feature.feature.properties.Race;
			type = feature.feature.properties.Type;
			date = feature.feature.properties.Start_Year_for_Location;
			content = display_name + " " + action + " " + date;
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
