if(Meteor.isServer){
    Meteor.startup(function(){
        Meteor.onConnection(function(c){
            Meteor.call('updateUserConnection',c);
        })
    })
}