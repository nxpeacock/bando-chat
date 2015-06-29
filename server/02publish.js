if(Meteor.isServer){
    Meteor.publish('getUsers',function(){
        var currentId = this.connection.id;
        return UserLocations.find({connectionId : {$ne : currentId}});
    });

    Meteor.publish('getOnlyMe',function(){
        var currentId = this.connection.id;
        return UserLocations.find({connectionId : currentId});
    })
}