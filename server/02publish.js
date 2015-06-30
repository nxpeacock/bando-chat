if(Meteor.isServer){
    Meteor.publish('getUsers',function(){
        return UserLocations.find();
    });

    Meteor.publish('getOnlyMe',function(){
        var currentId = this.connection.id;
        return UserLocations.find({connectionId : currentId});
    })
}