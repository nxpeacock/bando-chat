if(Meteor.isServer){
    Meteor.UserClient = {}
    Meteor.startup(function(){
        Meteor.onConnection(function(c){
            Meteor.UserClient = c;
        })
    });

    Streamy.on('update_Location',function(data, from){
        var id = Streamy.id(from);
        Meteor.call('updateUserLocation',id, data);
    });

    UserStatus.events.on("connectionLogout", function(fields) {
        Meteor.call('removeUserLocation',fields.userId);
    })
}