/**
 * Created by rkh on 2013-12-03.
 */
define(['backbone', 'handlebars', 'editor', 'createmapview', 'text!../templates/navigationTemplate.html'],
    function(Backbone, Handlebars, Editor, CreateMapView, navigationTemplate) {

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
                var create = new CreateMapView(this.editor);
                this.$el.parent().append(create.render().el);
            },

            openMap: function() {
                console.log("open");
            },

            saveMap: function() {
                console.log("save");
            },

            render: function() {
                this.$el.html(this.template(this));
                return this;
            }
        });

        return NavigationView;
});