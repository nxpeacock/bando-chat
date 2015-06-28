if(Meteor.isClient){
    FlowLayout.setRoot('body');
}

FlowRouter.route('/',{
    name : 'home',
    action : function (params, query) {
        FlowLayout.render('mainLayout',{top : 'navbar', main : 'home'});
    }
})