if(Meteor.isServer){
    Meteor.UserClient = {}
    Meteor.startup(function(){
        Meteor.onConnection(function(c){
            Meteor.UserClient = c;
        })
    });
/*
    Streamy.BroadCasts.allow = function(data, from) {
        return true;
    };*/

    chatStream = new Meteor.Stream('chat');

    chatStream.permissions.write(function() {
        return true;
    });

    chatStream.permissions.read(function() {
        return true;
    });

    UserStatus.events.on("connectionLogout", function(fields) {
        Meteor.call('removeUserLocation',fields.userId);
    });
}