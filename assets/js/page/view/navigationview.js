/**
 * Created by rkh on 2013-12-03.
 */
define(['backbone', 'handlebars', 'editor', 'createmapview', 'openmapview', 'text!../templates/navigationTemplate.html'],
    function(Backbone, Handlebars, Editor, CreateMapView, OpenMapView, navigationTemplate) {

        var NavigationView = Backbone.View.extend({

            id: 'navigation',
            template: Handlebars.compile( navigationTemplate ),

            initialize: function() {
            },

            events: {
                'click #nav-new': 'newMap',
                'click #nav-open': 'openMap',
                'click #nav-save': 'saveMap'
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
                Backbone.trigger("saveMap");
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