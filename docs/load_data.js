let url = "https://kvj0h3cxn3.execute-api.eu-west-2.amazonaws.com/DEV/getdatabaseitems";

console.log("HELLO")

fetch(url)
.then(x => {
	console.log(x.json());
	console.log("This working?");
	});


var map_coords = [
	[43.168166096616936, -1.2378233417282554],
	[43.00972246687362, -1.319199474091677],
	[42.930146715179596, -1.503251248171866],
	[42.81324219347755, -1.6474472183507254],
	[42.675226891487966, -1.8138619397711204],
	[42.672405824886866, -2.0319681633879374],
	[42.567300382940445, -2.190496028160167],
	[42.46282426397609, -2.4446721162167444]
]

var lastIcon = new L.Icon({
	iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
})

var map = L.map('map');

var map_path = L.polyline(map_coords).addTo(map);

var markers = [];
for (let i = 0; i < map_coords.length-1; i++) {
	var c = map_coords[i];
	console.log(c);
	var m = L.marker(c).addTo(map);
	m.bindPopup(`${c[0].toFixed(4)}, ${c[1].toFixed(4)}<br>Time: ToBeAdded`)
	markers.push(m)
}

var last_coords = map_coords[map_coords.length-1];
var last_marker = L.marker(last_coords, {icon: lastIcon}).addTo(map);
last_marker.bindPopup(`<u>Current Location:</u><br>${last_coords[0].toFixed(4)}, ${last_coords[1].toFixed(4)}<br>Time: ToBeAdded`)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 15,
		minZoom: 2,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Zoom to last marker and open popUp
map.setView(last_coords, 8);
last_marker.openPopup();
