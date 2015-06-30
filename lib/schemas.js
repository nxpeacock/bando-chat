UserLocations = new Meteor.Collection('userLocations');

var Schemas = {};

Schemas.UserLocation = new SimpleSchema({
    userId : {
        type : String
    },
    latlng : {
        type : [Number],
        decimal: true,
        optional : true
    },
    radius : {
        type : Number,
        decimal: true,
        optional : true
    },
    isShare : {
        type : Boolean,
        autoValue : function(){
            return true;
        }
    },
    markerIcon : {
        type : String,
        optional : true
    },
    updatedAt : {
        type : Date,
        autoValue : function () {
            return new Date;
        }
    }
});

UserLocations.attachSchema(Schemas.UserLocation);

Users = Meteor.users;

Users.helpers({
    isFirstTime : function(){
        return this.profile.isFirstTime;
    },
    isShareAccurateLocation : function(){
        return this.profile.isShareAccurateLocation;
    },
    isShareAccurateLocationCheckBox : function(){
        return ((this.profile.isShareAccurateLocation || true)) ? 'checked' : '';
    },
    getLatLng : function(){
        var userLocation = UserLocations.findOne({userId : this._id});
        console.log(this._id);
        if(userLocation){
            return userLocation.latlng;
        }else{
            return [0,0]
        }
    }
});



