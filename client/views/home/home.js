Template.home.onCreated(function () {
    currentLocation = new ReactiveVar({});
    currentId = new ReactiveVar({});
    AllUserLocations = new ReactiveVar([]);
    mapView = new ReactiveVar({});

    this.autorun(function(c){
        if(!Meteor.userId()){
            Meteor.call('createGuestUser',function(e,r){
                Meteor.loginWithPassword(r.username, r.token,function(err){
                    c.stop();
                });
            });
        }
    })

/*    this.autorun(function () {
        Meteor.call('getConnectionId', function (e, r) {
            currentId.set(r);
        });

        if(FlowRouter.subsReady() && !_.isEmpty(mapView.get())){
            if(currentId.get()){
                var available = [],
                    map = mapView.get();
                var locations = UserLocations.find({connectionId : {$ne : currentId.get()}}).fetch();
                _.each(locations,function(l){
                    var marker = L.marker(l.latlng).addTo(map),
                        circle = L.circle(l.latlng, 0).addTo(map);
                    available.push({
                        marker : marker,
                        circle : circle
                    });
                });
                mapView.set(map);
                AllUserLocations.set(available);
            }
        }
    })*/
})

Template.home.rendered = function () {
    $(document).ready(function () {

        L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images';

        var mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'nxcong.21ed4e86',
            accessToken: 'pk.eyJ1Ijoibnhjb25nIiwiYSI6IjI3OGIxNDUzNzQ0OTc0YjQxMDlkMzBhMzhjOTk4ZWM1In0.KVVRoxtV4SaiKTxv2ygK5g'
        });

        map = L.map('map', {zoomControl: false})
            .addLayer(mapbox)
            .setView([21.034, 105.853], 10);

        new L.Control.Zoom({position: 'bottomright'}).addTo(map);

        L.easyButton('fa-compass', function (btn, map) {
            map.locate({setView: true, maxZoom: map.getZoom()});
        }).addTo(map);

        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);

        L.easyButton('fa-refresh', function (btn, map) {
            location.reload();
        }).addTo(map);

        map.locate({setView: true, maxZoom: map.getZoom()});

        mapView.set(map)
    });
    this.autorun(function(c){
       if(FlowRouter.subsReady() && map){
           var users = UserLocations.find().fetch(),
               available = [];
           _.each(users,function(l){
               var styleMarker = {
                   radius: 8,
                   fillColor: randomColor(),
                   color: 'red',
                   weight: 5,
                   opacity: 1,
                   stroke : true,
                   fillOpacity: 0.8,
                   className : 'marker_' + l.userId
               };
               var marker = L.circleMarker(l.latlng,styleMarker).addTo(map);
               available.push({
                   id : l.userId,
                   marker : marker
               });
           });
           AllUserLocations.set(available);
       }
    })
}

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    var current = currentLocation.get();
    if (_.has(current, 'marker') && _.has(current, 'circle')) {
        map.removeLayer(current.marker);
        map.removeLayer(current.circle);
    }
    var marker = L.marker(e.latlng).addTo(map).bindPopup("Bạn đang trong bán kính " + radius + " mét tại điểm này.").openPopup(),
        circle = L.circle(e.latlng, radius).addTo(map);


    currentLocation.set({
        marker: marker,
        circle: circle
    });

    var params = {
        latlng : _.values(e.latlng),
        radius : radius
    }

    Meteor.call('updateUserLocation',params);
}

function onLocationError(e) {
    alert(e.message);
}