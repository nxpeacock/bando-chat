if(Meteor.isServer){
    UserLocations.permit(['insert', 'update', 'remove']).apply();
}