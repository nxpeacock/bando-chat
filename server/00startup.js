if(Meteor.isServer){
    Meteor.UserClient = {}
    Meteor.startup(function(){
        SyncedCron.start();
    });

    SyncedCron.add({
        name: 'Remove offline users',
        schedule: function(parser) {
            // parser is a later.parse object
            return parser.text('every 2 hours');
        },
        job: function() {
            return removeOfflineUsers();
        }
    });

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