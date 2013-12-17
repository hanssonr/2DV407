/**
 * Created by rkh on 2013-12-03.
 */
define(['backbone', 'handlebars', 'createmapview', 'openmapview', 'text!../templates/navigationTemplate.html'],
    function(Backbone, Handlebars, CreateMapView, OpenMapView, navigationTemplate) {

        var NavigationView = Backbone.View.extend({

            id: 'navigation',
            template: Handlebars.compile( navigationTemplate ),

            initialize: function() {
            },

            events: {
                'mousedown': function() {return false;},
                'click #nav-new': 'newMap',
                'click #nav-open': 'openMap',
                'click #nav-save': 'saveMap',
                'click #nav-export': 'exportMap'
            },

            newMap: function() {
                var create = new CreateMapView();
                this.$el.parent().append(create.render().el);
            },

            openMap: function() {
                var open = new OpenMapView();
                this.$el.parent().append(open.render().el);
            },

            saveMap: function() {
                Backbone.trigger("SAVE_MAP");
            },

            exportMap: function() {
                Backbone.trigger("EXPORT_MAP");
            },

            render: function() {
                this.$el.empty();
                this.$el.html(this.template(this));
                this.delegateEvents();
                return this;
            }
        });

        return NavigationView;
});