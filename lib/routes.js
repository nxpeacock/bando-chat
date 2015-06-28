if(Meteor.isClient){
    FlowLayout.setRoot('body');
}

FlowRouter.route('/',{
    name : 'home',
    subscriptions : function(params, query){
        this.register('getUsers', Meteor.subscribe('getUsers'));
    },
    action : function (params, query) {
        FlowLayout.render('mainLayout',{top : 'navbar', main : 'home'});
    }
})