UserLocations = new Meteor.Collection('userLocations');

var Schemas = {};

Schemas.UserLocation = new SimpleSchema({
    connectionId : {
        type : String
    },
    ipAddress : {
        type : String,
        optional : true
    },
    httpHeaders : {
        type : String,
        optional : true
    },
    latlng : {
        type : [Number],
        decimal: true,
        optional : true
    },
    isShare : {
        type : Boolean,
        autoValue : function(){
            return true;
        }
    },
    updatedAt : {
        type : Date,
        autoValue : function () {
            return new Date;
        }
    }
});

UserLocations.attachSchema(Schemas.UserLocation);

UserLocations.helpers({
    isOwner : function(){

    }
})

