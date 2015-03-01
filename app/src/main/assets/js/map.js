var map = L.map('map');
var marks_layer_group = new L.FeatureGroup();

L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
		opacity: 0.6
}).addTo(map);
map.setView([45.7578,4.8350],13);
marks_layer_group.addTo(map);

var a = document.createElement("a");
var t = document.createTextNode("¤");
a.setAttribute("class","control-maj")
a.onclick = update;
a.appendChild(t);
var p = document.getElementsByClassName("leaflet-control")[0];
p.appendChild(a);

var obj = new Object();
update();
map.fitBounds(marks_layer_group.getBounds());

function fromData() {
	data = $.parseJSON(Android.getData());
	marks_layer_group.clearLayers();
	for(i in data) {
    var s = data[i];
    var id = s['number'];
    if(obj[id] == undefined) {
      obj[id] = {
        id             : s['number'],
        name           : s['name'],
        position       : { 
          lat : s['position']['lat'], 
          lng : s['position']['lng'] },
        open           : s['status'] == 'OPEN',
        bike_stands    : s['bike_stands'],
        available_bikes: s['available_bikes'],
        last_update    : s['last_update']
      };
    }
    else {
      obj[id].open = s['status'] == 'OPEN';
      obj[id].last_update = s['last_update'];
      obj[id].available_bikes = s['available_bikes'];
    }
    add_station(obj[id]);
  }
}

function update() {
	Android.getLyon('fromData');
}

function add_station(s) {
	if (s.position.lat == 0 && s.position.lng ==0)
	{
		return;
	}
	if (s.open) {
		if (s.available_bikes <= 3) {
			color = '#F55';
		} 
		else if ((s.bike_stands - s.available_bikes) <= 3) {
			color = '#55F';
		} else {
			color = '#0C0';
		}
	} 
	else {
		color = '#000';
	}
	mark = new L.Circle([s.position.lat, s.position.lng], 10, {color: color, opacity: 0.7, fillOpacity: 1, weight: 10});
	popup_text = '<div class="station-info">';
	popup_text += '<div class="station-name">';
	popup_text += s.name+'</div>';
	if (!s.open) {
		popup_text += '<p class="station-status">La station est fermée !</p>';
	}
	else
	{
		popup_text += '<div class="station-available-bikes"><span class="count">'+s.available_bikes+'</span><br>vélos</div>';
		popup_text += '<div class="station-available-stands"><span class="count">'+(s.bike_stands-s.available_bikes)+'</span><br>places</div>';
	}
	popup_text += '</div>';
	popup_text += '<div class="station-update-time">';
	utcSeconds = s.last_update;
	d = new Date(0); // The 0 there is the key, which sets the date to the epoch
	d.setUTCSeconds(utcSeconds/1000);
	popup_text += 'Dernière mise à jour : '+lpad(d.getHours(),2)+':'+lpad(d.getMinutes(),2);
	popup_text += '</div>';
	mark.bindPopup(popup_text);
	mark.addTo(marks_layer_group);
}

function lpad(value, padding) {
	var zeroes = "0";
	for (var i = 0; i < padding; i++) { zeroes += "0"; }
	return (zeroes + value).slice(padding * -1);
}