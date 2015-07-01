Template.home.onCreated(function () {
    currentLocation = new ReactiveVar({});
    userLocations = new ReactiveVar({});
    AllUserLocations = new ReactiveVar([]);
    popupTimeoutId = new ReactiveVar();
    sharePopupTimeoutId = new ReactiveVar();
    mapView = new ReactiveVar({});
});

var genderIcon = function(iconUrl){
    return L.icon({
        iconUrl : iconUrl,
        popupAnchor:  [-2, -8],
        iconSize:     [32, 32], // size of the icon
        iconAnchor:   [16, 16] // point of the icon which will correspond to marker's location
    });
}

UserLocations.find().observeChanges({
    added : function(id, fields){
        addMarkerUsers();
        var msg = 'Vừa có ai đó tham gia vào BANDO Chat.';
        sendNotification(msg);
    },
    removed : function(id){
        addMarkerUsers();
        var msg = 'Vừa có ai đó thoát khỏi BANDO Chat.';
        sendNotification(msg);
    }
})

Template.home.rendered = function () {
    document.title = 'BẢN ĐỒ Chat';
    $(document).ready(function () {
        map = L.map('map', {zoomControl: false});
        L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images';

        // create the tile layer with correct attribution
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib}).addTo(map);

        map.setView([21.034, 105.853], 10);
        map.locate({setView: true, maxZoom: map.getZoom(),enableHighAccuracy : true});

        new L.Control.Zoom({position: 'bottomright'}).addTo(map);

        L.easyButton('fa-compass', function (btn, map) {
            map.locate({setView: true, maxZoom: map.getZoom(),enableHighAccuracy : true});
        }).addTo(map);

        L.easyButton('fa-refresh', function (btn, map) {
            location.reload();
        }).addTo(map);

        L.easyButton('fa-github', function (btn, map) {
            window.open('https://github.com/nxpeacock/bando-chat','_blank');
        }).addTo(map);

        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);
        mapView.set(map);

        Meteor.setTimeout(function(){
            addMarkerUsers();
        },2000)
    });

}

Template.home.events({
    'keyup #txtMessage' : function(e,t){
        e.preventDefault();
        if(e.keyCode == 13){
            var entityMap = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': '&quot;',
                "'": '&#39;',
                "/": '&#x2F;',
                "卐": 'I am a dick ',
                "卍": 'I am a dick '
            };
            var msg = $('#txtMessage').val(),
                msg = html_sanitize(msg),
                msg = String(msg).replace(/[&<>"'\/卐卍]/g, function (s) {
                    return entityMap[s];
                });
            if(!_.isEmpty(msg)){
                var marker = currentLocation.get().marker,
                    popup = marker.bindPopup(msg);
                popup.openPopup();
                $('#txtMessage').val('');
                chatStream.emit('chat', {id : Meteor.userId(), msg : msg});
                /*var notificationMsg = _.template('<%=username%> nói : <%=msg%>'),
                    username = Meteor.user().username;
                Notification(notificationMsg({username : username, msg : msg}));*/
                if(popupTimeoutId.get()) Meteor.clearTimeout(popupTimeoutId.get());
                popupTimeoutId.set(Meteor.setTimeout(function(){popup.closePopup()},10000));
            }
        }
    }
})



function addMarkerUsers(){
    try{
        if(FlowRouter.subsReady('getUsers') && !_.isEmpty(mapView.get())){
            var users = UserLocations.find({userId : {$ne : Meteor.userId()}}).fetch(),
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
                var icon = genderIcon(l.markerIcon);
                var marker = L.marker(l.latlng,{icon : icon}).addTo(map),
                    circle = L.circle(l.latlng, l.radius,styleMarker).addTo(map);

                available.push({
                    id: l.userId,
                    marker: marker,
                    circle : circle
                });
            });
            AllUserLocations.set(available);
        }
    }catch (ex){
        console.log('Exception : ', ex);
    }
}

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    var current = currentLocation.get();
    if (_.has(current, 'marker') && _.has(current, 'circle')) {
        map.removeLayer(current.marker);
        map.removeLayer(current.circle);
    }
    var icon = genderIcon('icons/me1.png');
    var marker = L.marker(e.latlng,{icon : icon}).addTo(map),
        circle = L.circle(e.latlng, radius).addTo(map);

    var popup = marker.bindPopup("Bạn đang trong bán kính " + radius + " mét tại điểm này.");

    popup.openPopup();

    Meteor.setTimeout(function(){popup.closePopup()},10000);

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

chatStream = new Meteor.Stream('chat');

chatStream.on('chat', function(params) {
    if(params.id == Meteor.userId()) return;
    var locations = AllUserLocations.get();
    if(_.size(locations) <= 0) return;
    var l = _.findWhere(locations,{id : params.id});
    if(l === undefined) return;
    var popup = l.marker.bindPopup(params.msg);
    popup.openPopup();
    if(sharePopupTimeoutId.get()) Meteor.clearTimeout(sharePopupTimeoutId.get());
    sharePopupTimeoutId.set(Meteor.setTimeout(function(){popup.closePopup()},10000));
});

function sendNotification(msg){
    try{
        if(Session.get('isNotification')){
            console.log('send : ',msg);
            new Notification('BANDO Chat thông báo', {
                icon: 'icons/notification.png',
                body: msg
            });
        }
    }catch(ex){
        console.log('Exception : ', ex)
    }
}

chatStream.on('Notification',function(msg){
    console.log('on : ',msg);

})
