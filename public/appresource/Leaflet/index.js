var map = L.map('map');

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var itineraryMap = JSON.parse(localStorage.getItem('json'));
var day = getUrlParameter('day').split('.')[1];

 
var awesome = [];
var getItiForDay = itineraryMap[day-1];
for(var i = 0 ; i < getItiForDay.length; i++){
	console.log("YAY");
	var lat = getItiForDay[i].lat;
	var lng = getItiForDay[i].lng;
	awesome.push(L.latLng(lat, lng));	
}
// awesome.push(L.latLng(1.361516, 103.835812));
// awesome.push(L.latLng(1.351516, 103.835812));
// awesome.push(L.latLng(1.371516, 103.835812));

var control = L.Routing.control(L.extend(window.lrmConfig, {
    waypoints: awesome,
    geocoder: L.Control.Geocoder.nominatim(),
    routeWhileDragging: true,
    reverseWaypoints: true,
    showAlternatives: true,
    altLineOptions: {
        styles: [
            { color: 'black', opacity: 0.15, weight: 9 },
            { color: 'white', opacity: 0.8, weight: 6 },
            { color: 'blue', opacity: 0.5, weight: 2 }
        ]
    }
})).addTo(map);

L.Routing.errorControl(control).addTo(map);
