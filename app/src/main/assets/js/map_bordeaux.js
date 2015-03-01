var map = L.map('map');
var marks_layer_group = new L.FeatureGroup();

L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
		opacity: 0.6
}).addTo(map);
map.setView([44.841903, -0.588554],13);
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
//map.fitBounds(marks_layer_group.getBounds());

// From velimonde/provider
function getAttrib(s, n) {
	return s.getElementsByTagName(n)[0].childNodes[0].nodeValue
}
function fromData() {
	data = Android.getData();
	marks_layer_group.clearLayers();
  xml = $.parseXML(data);
  stations = xml.getElementsByTagName('CI_VCUB_P')

  for(var i = 0; i < stations.length; i++) {
    var s = stations[i];
    var id = parseInt(getAttrib(s,'GID'));
    var coord = getAttrib(s,'pos').split(' ')
    if(obj[id] == undefined) {
      obj[id] = {
        id             : id,
        name           : getAttrib(s,'NOM'),
        position       : {
        	lat: parseFloat(coord[0]),
        	lng: parseFloat(coord[1]) 
        },
        open           : getAttrib(s,'ETAT') == 'CONNECTEE',
        bike_stands    : parseInt(getAttrib(s,'NBPLACES'))+parseInt(getAttrib(s,'NBVELOS')),
        available_bikes: parseInt(getAttrib(s,'NBVELOS')),
        last_update    : getAttrib(s,'HEURE')
      };
    }
    else {
      obj[id].open = getAttrib(s,'ETAT') == 'CONNECTEE';
      obj[id].last_update = getAttrib(s,'HEURE');
      obj[id].available_bikes = parseInt(getAttrib(s,'NBVELOS'));
    }
    add_station(obj[id]);
  }
}
function update() {
	Android.getBordeaux('fromData')
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
	mark = new L.Circle([s.position.lat, s.position.lng], 10, {color: color, opacity: 0.7, fillOpacity: 0.8, weight: 10});
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
	popup_text += 'Dernière mise à jour : '+s.last_update;
	popup_text += '</div>';
	mark.bindPopup(popup_text);
	mark.addTo(marks_layer_group);
}

function lpad(value, padding) {
	var zeroes = "0";
	for (var i = 0; i < padding; i++) { zeroes += "0"; }
	return (zeroes + value).slice(padding * -1);
}