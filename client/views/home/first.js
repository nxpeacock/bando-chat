Template.authenticate.rendered = function(){
    document.title = 'Loading | BẢN ĐỒ Chat';
    this.autorun(function(c){
        if (!Meteor.userId()) {
            Meteor.setTimeout(function(){
                Meteor.call('createGuestUser', function (e, r) {
                    Meteor.loginWithPassword(r.username, r.token, function (err) {
                        c.stop();
                        FlowRouter.go('home');
                    });
                });
            },5000);
        }
    })
}