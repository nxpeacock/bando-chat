if(Meteor.isClient){
    Meteor.startup(function(){
        Session.set('isNotification',false);
    })
}