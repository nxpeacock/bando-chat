if(Meteor.isClient){
    FlowLayout.setRoot('body');
}

FlowRouter.route('/',{
    name : 'home',
    triggersEnter : [requireLogin],

    subscriptions : function(params, query){
        this.register('getUsers', Meteor.subscribe('getUsers'));
    },
    action : function (params, query) {
        FlowLayout.render('mainLayout',{top : 'navbar', main : 'home'});
    }
});

function requireLogin(context, redirect){
    if(!Meteor.userId()) redirect('/authenticate');
}

FlowRouter.route('/authenticate',{
    name : 'authenticate',
    triggersEnter : [function(context, redirect){
        if(Meteor.userId()) redirect('/');
    }],
    action : function(p,q){
        FlowLayout.render('blankLayout',{main : 'authenticate'});
    }
})