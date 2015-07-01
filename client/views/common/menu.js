Session.set('isNotification',false);

Template.navbar.rendered = function(){
    $(document).ready(function(){
        // showing multiple
        $("#side-nav-button").sideNav();
    })
}

Template.navbar.helpers({
    isShareLocation : function(){
        return (Meteor.user().isShareAccurateLocation()) ? 'checked' : '';
    },
    isNotification : function(){
        return Session.get('isNotification') ? 'checked' : '';
    }
});

Template.navbar.events({
    'change #accurate_location_share' : function(e,t){
        e.preventDefault();
        var isShare = $('#accurate_location_share').val();
        Materialize.toast(isShare, 4000);
    },
    'change #notification_lever' : function(e,t){
        Session.set('isNotification',!Session.get('isNotification'));
        if (Notification.permission !== "granted"){
            Notification.requestPermission();
        }
        Materialize.toast(Session.get('isNotification') ? 'Bật thông báo' : 'Tắt thông báo', 4000);
    }
})