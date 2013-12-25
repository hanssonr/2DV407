/**
 * Created by rkh on 2013-12-03.
 */
define(['backbone', 'handlebars', 'createmapview', 'openmapview', 'text!../templates/navigationTemplate.html'],
    function(Backbone, Handlebars, CreateMapView, OpenMapView, navigationTemplate) {

        var NavigationView = Backbone.View.extend({

            id: 'navigation',
            className: 'unselectable',
            template: Handlebars.compile( navigationTemplate ),

            events: {
                'mousedown': function() {return false;},
                'click #nav-new': 'newMap',
                'click #nav-open': 'openMap',
                'click #nav-save': 'saveMap',
                'click #nav-export': 'exportMap'
            },

            /**
             * Creates a view for creating a new map
             */
            newMap: function() {
                var create = new CreateMapView();
                this.$el.parent().append(create.render().el);
            },

            /**
             * Creates a view for opening a saved map
             */
            openMap: function() {
                var open = new OpenMapView();
                this.$el.parent().append(open.render().el);
            },

            /**
             * Sends out the SAVE_MAP event
             */
            saveMap: function() {
                Backbone.trigger("SAVE_MAP");
            },

            /**
             * Sends out the EXPORT_MAP event
             */
            exportMap: function() {
                Backbone.trigger("EXPORT_MAP");
            },

            /**
             * Renders the view
             * @returns {NavigationView}
             */
            render: function() {
                this.$el.empty();
                this.$el.html(this.template(this));
                this.delegateEvents();
                return this;
            }
        });

        return NavigationView;
});