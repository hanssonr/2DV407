/**
 * Created by rkh on 2013-12-03.
 */
define(['backbone', 'handlebars', 'editor', 'createmapview', 'savemapview', 'text!../templates/navigationTemplate.html'],
    function(Backbone, Handlebars, Editor, CreateMapView, SaveMapView, navigationTemplate) {

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

            //TODO read input file from user
            openMap: function() {
                var test = $.getJSON("mall.json", function(data) {
                    Backbone.trigger("openMapEvent", {
                        url: data.url,
                        tilesize: data.tilesize,
                        mapwidth: data.mapwidth,
                        mapheight: data.mapheight,
                        tiles: data.tiles
                    });
                });

            },

            saveMap: function() {
                Backbone.trigger("saveMap");
                /*var save = new SaveMapView();
                this.$el.parent().append(save.render().el);*/
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