Template.navbar.rendered = function(){
    $(document).ready(function(){
        // showing multiple
        $("#side-nav-button").sideNav();
    })
}

Template.navbar.helpers({
    isShareLocation : function(){
        return (Meteor.user().isShareAccurateLocation()) ? 'checked' : '';
    }
});

Template.navbar.events({
    'change #accurate_location_share' : function(e,t){
        e.preventDefault();
        var isShare = $('#accurate_location_share').val();
        Materialize.toast(isShare, 4000);
    }
})