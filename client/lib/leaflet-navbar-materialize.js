L.Control.Navbar = L.Control.extend({
    initialize: function (foo, options) {
        L.Util.setOptions(this, options);
    },
    onAdd : function (map) {
        var container = L.DomUtil.create('div', 'navbar-fixed');
        // ... initialize other DOM elements, add listeners, etc.
        var navbar = Blaze.toHTML(Template.navbar);
        container.innerHTML = navbar;
        return container;
    }
})