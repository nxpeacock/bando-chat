if(Meteor.isServer){
    Meteor.UserClient = {}
    Meteor.startup(function(){
        Meteor.onConnection(function(c){
            Meteor.UserClient = c;
        })
    });

    Streamy.BroadCasts.allow = function(data, from) {
        return true;
    };

    UserStatus.events.on("connectionLogout", function(fields) {
        Meteor.call('removeUserLocation',fields.userId);
    })
}