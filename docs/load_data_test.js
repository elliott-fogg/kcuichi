var journey_url = "https://kvj0h3cxn3.execute-api.eu-west-2.amazonaws.com/DEV/getdatabaseitems";

// Create map and layers
var map = L.map('map');
var trailLayer = L.layerGroup().addTo(map);
var camiloLayer = L.layerGroup().addTo(map);
var layerControl = L.control.layers(null).addTo(map);

var speedIndexMap = {
	"0": 5,
	"1": 2,
	"2": 1,
	"3": 0.5
}


// Add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 15,
		minZoom: 2,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// Set up Icons
var defaultIcon = new L.Icon.Default();

var lastIcon = new L.Icon({
	iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
})


function load_trail_path() {
	var trail_coords = [
		[43.168166096616936, -1.2378233417282554], //Saint Jean Pied de Port
		[43.00972246687362, -1.319199474091677], // Roncesvalles
		[42.930146715179596, -1.503251248171866], //Zubiri
		[42.81324219347755, -1.6474472183507254], //Pamplona
		[42.675226891487966, -1.8138619397711204], // Puente de la Reina
		[42.672405824886866, -2.0319681633879374], // Estella
		[42.567300382940445, -2.190496028160167], // Los Arcos
		[42.46282426397609, -2.4446721162167444], // Logrono
		[42.41691621777956, -2.730392679130572], // Najera
		[42.43677490811505, -2.953329916625648], // Santo Domingo de la Calzada
		[42.419881017058245, -3.190567004147055], // Belorado
		[42.37629863489849, -3.4367490289386455], // San Juan de Ortega
		[42.35071588806892, -3.6904023997684137], // Burgos
		[42.33854016932386, -3.9265292566247356], // Hornillos del Camino
		[42.288449014827805, -4.142178334805844], // Castrojeriz
		[42.26766611754602, -4.405158807093796], // Fromista
		[42.3383394123728, -4.602735424917993], // Carrio de los Condes
		[42.36299786589159, -4.890480146366347], // Terradillos de los Templarios
		[42.38750227979556, -5.144169259481137], // Bercianos del Real Camino
		[42.49822902680581, -5.4164451280554475], // Mansilla de las Mulas
		[42.59848633356611, -5.5718125257692375], // Leon
		[42.49428900438102, -5.809844273069181], // San Martin del Camino
		[42.45510266381912, -6.05318776064064], // Astorga
		[42.491726053538336, -6.343117265750796], // Foncebadon
		[42.55010920352764, -6.598522619910445], // Ponferrada
		[42.61031203113893, -6.812571034336174], // Villafranca del Bierzo
		[42.70797993323473, -7.043692840507312], // O Cebreiro
		[42.757326767291104, -7.239027518036834], // Triacastela
		[42.7807700256107, -7.414452353407779], // Sarria
		[42.80792813860352, -7.615469761917626], // Portomarin
		[42.87430526005943, -7.868607676049027], // Palas de Rei
		[42.929781773081395, -8.160970643547207], // Arzua
		[42.99861610829106, -8.507123819685317], // Pedrouzo
		[42.88069098300891, -8.544652008791818] // Santiago de Compostela 
	]

	var trail_path = L.polyline(
	    trail_coords,
	    {"color": "black",
	     "opacity": 0.3}
	).addTo(trailLayer);

	for (let i = 0; i < trail_coords.length; i++) {
		L.circle(trail_coords[i], {radius: 20, color: "black"}).addTo(trailLayer);
	}

	map.fitBounds(trail_path.getBounds());

	layerControl.addOverlay(trailLayer, "Route");
}


async function fetch_journey_data() {
	var date = new Date();

	lastDownload = parseFloat(localStorage["kcuichi_lastDownload_journey"]);

	// Only download the journey coordinates once every hour, just in case.
	if (isNaN(lastDownload) || (lastDownload + 3600000 < date.getTime())) {
		console.log("Downloading data...");
		
		await fetch(journey_url)
		.then(response => response.json())
		.then(responseJSON => {
			localStorage["kcuichi_journeyData"] = JSON.stringify(responseJSON["Items"]);
			localStorage["kcuichi_lastDownload_journey"] = JSON.stringify(date.getTime());
			console.log("Current data downloaded.")
		});

	} else {
		console.log("Less than an hour since last downloaded coords.")
		console.log("Using previously downloaded data.");
	}

	var parsedData = parse_data(JSON.parse(localStorage["kcuichi_journeyData"]));
	mark_journey_on_map(parsedData);
	document.getElementById("mapAnimateBtn").disabled = false;
}


function parse_data(data) {
	parsedData = []

	for (let i = 0; i < data.length; i++) {
		var entry = data[i]
		var longitude = parseFloat(entry["longitude"]["S"]);
		var latitude = parseFloat(entry["latitude"]["S"]);
		var timestamp = parseFloat(entry["timestamp"]["S"]);
		var date = new Date(timestamp);
		var datestring = date.toLocaleDateString("en-GB");
		var timestring = date.toLocaleTimeString("en-GB");
		var locality = entry["locality"]["S"];

		parsedData.push({
			"coords": [latitude, longitude],
			"popup_message": `${locality}<br>${datestring} ${timestring}<br>${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
			"timestamp": timestamp
		})
	}

	return parsedData;
}


function mark_journey_on_map(data) {
	data.sort((pointA, pointB) => {return pointA.timestamp - pointB.timestamp})

	var coords_list = [];

	for (let i = 0; i < data.length; i++) {

		var entry = data[i];
		var m = L.marker(entry["coords"],
		             {icon: ((i < data.length-1) ? defaultIcon : lastIcon)}
		    ).addTo(camiloLayer);
		m.bindPopup(entry["popup_message"]);
		coords_list.push(entry["coords"]);
	}

	var journey_path = L.polyline(coords_list).addTo(camiloLayer);

	map.setView(entry.coords, 8);
	m.openPopup();

	layerControl.addOverlay(camiloLayer, "Camilo");
}


function animate_journey_on_map(data) {
	camiloLayer.clearLayers();

	data.sort((pointA, pointB) => {return pointA.timestamp - pointB.timestamp})

	var previousCoords = null;
	var timeoutDelay = 1000*getSpeed();
	var startTime = data[0]["timestamp"];

	timeoutFunc = (entry, previousCoords, iconType) => {
		let m = L.marker(entry["coords"],
		                 {icon: iconType}
		        ).addTo(camiloLayer);
		m.bindPopup(entry["popup_message"]);

		if (previousCoords != null) {
			p = L.polyline([previousCoords, entry["coords"]]).addTo(camiloLayer);
		}

		m.openPopup();
		map.setView(entry.coords, 8);
	}

	var realTime = document.getElementById("realTime").checked;
	console.log(realTime);

	for (var i = 0; i < data.length; i++) {
		var entry = data[i];
		let iconType = ((i<data.length-1) ? defaultIcon : lastIcon);

		var timeout;
		if (realTime) {
			timeout = (entry["timestamp"] - startTime) / 86400000 * timeoutDelay;
		} else {
			timeout = i*timeoutDelay;
		}

		console.log(timeout)

		setTimeout(timeoutFunc, timeout, entry, previousCoords, iconType);

		previousCoords = entry["coords"];
	}

	console.log(timeout);

	setTimeout(mapAnimateEnd, timeout+1000);
}


async function mapAnimateStart() {
	// Disable map and buttons
	document.getElementById("map-container").classList.add("is-locked");
	document.getElementById("mapAnimateBtn").disabled = true;
	document.getElementById("mapAnimateBtn").textContent = "Animating...";

	var parsedData = parse_data(JSON.parse(localStorage["kcuichi_journeyData"]));
	animate_journey_on_map(parsedData);
}


function mapAnimateEnd() {
	document.getElementById("map-container").classList.remove("is-locked");
	document.getElementById("mapAnimateBtn").disabled = false;
	document.getElementById("mapAnimateBtn").textContent = "Animate";
}


function updateAnimateSpeedText() {
	let speed = getSpeed();
	document.getElementById("animateSpeedDisplay").textContent = speed;
}

function getSpeed() {
	let speedIndex = document.getElementById("animateSpeed").value;
	let speed = speedIndexMap[speedIndex];
	return speed;
}


document.getElementById("mapAnimateBtn").onclick = mapAnimateStart;
document.getElementById("animateSpeed").oninput = updateAnimateSpeedText;
updateAnimateSpeedText();


load_trail_path();
fetch_journey_data();
