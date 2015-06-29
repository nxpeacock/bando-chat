Template.home.onCreated(function () {
    currentLocation = new ReactiveVar({});
    userLocations = new ReactiveVar({});
    AllUserLocations = new ReactiveVar([]);

    mapView = new ReactiveVar({});

    this.autorun(function (c) {
        if (!Meteor.userId()) {
            Meteor.call('createGuestUser', function (e, r) {
                Meteor.loginWithPassword(r.username, r.token, function (err) {
                    c.stop();
                });
            });
        }
    })
});

Messages = new Mongo.Collection(null);

UserLocations.find().observeChanges({
    added : function(id, fields){
        addMarkerUsers();
    },
    removed : function(id){
        addMarkerUsers();
    }
})

Template.home.rendered = function () {
    $(document).ready(function () {
        map = L.map('map', {zoomControl: false});
        L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images';

        var mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'nxcong.21ed4e86',
            accessToken: 'pk.eyJ1Ijoibnhjb25nIiwiYSI6IjI3OGIxNDUzNzQ0OTc0YjQxMDlkMzBhMzhjOTk4ZWM1In0.KVVRoxtV4SaiKTxv2ygK5g'
        }).addTo(map);

        map.setView([21.034, 105.853], 10);
        map.locate({setView: true, maxZoom: map.getZoom()});

        new L.Control.Zoom({position: 'bottomright'}).addTo(map);

        L.easyButton('fa-compass', function (btn, map) {
            map.locate({setView: true, maxZoom: map.getZoom()});
        }).addTo(map);

        L.easyButton('fa-refresh', function (btn, map) {
            location.reload();
        }).addTo(map);

        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);
        mapView.set(map);

        Meteor.setTimeout(function(){
            addMarkerUsers();
        },2000)
    });

}



function addMarkerUsers(){
    if(FlowRouter.subsReady('getUsers') && !_.isEmpty(mapView.get())){
        var users = UserLocations.find().fetch(),
            available = AllUserLocations.get(),
            map = mapView.get();
        _.each(available,function(a){
            map.removeLayer(a.marker);
            map.removeLayer(a.circle);
        });
        available = [];
        _.each(users, function (l) {
            var styleMarker = {
                fillColor: randomColor(),
                color: 'red'
            };
            var icon = new genderIcon({iconUrl: l.markerIcon});
            var marker = L.marker(l.latlng,{icon : icon}).addTo(map),
                circle = L.circle(l.latlng, l.radius,styleMarker).addTo(map);
            console.log(l.userId)
            available.push({
                id: l.userId,
                marker: marker,
                circle : circle
            });
        });
        AllUserLocations.set(available);
    }
}

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    var current = currentLocation.get();
    if (_.has(current, 'marker') && _.has(current, 'circle')) {
        map.removeLayer(current.marker);
        map.removeLayer(current.circle);
    }
    var icon = new genderIcon({iconUrl: 'icons/me.png'});
    var marker = L.marker(e.latlng,{icon : icon}).addTo(map).bindPopup("Bạn đang trong bán kính " + radius + " mét tại điểm này.").openPopup(),
        circle = L.circle(e.latlng, radius).addTo(map);


    currentLocation.set({
        marker: marker,
        circle: circle
    });

    var params = {
        latlng: _.values(e.latlng),
        radius: radius
    }

    Meteor.call('updateUserLocation', params);
}

function onLocationError(e) {
    alert(e.message);
}