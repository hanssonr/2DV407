/**
 * Created by rkh on 2013-11-19.
 */
//init the application

define(['jquery', 'backbone', 'toolbarview', 'mapview', 'mapmodel', 'navigationview', 'jscrollpane'],
    function($, Backbone, ToolbarView, MapView, Map, NavigationView, jScrollPane) {

    var Editor = Backbone.View.extend({

        childviews: [],
        id: "container",

        //defaults
        url: "http://brain.wireos.com/wp-content/uploads/gta2tiles.jpg",
        tilesize: 64,
        mapwidth: 8,
        mapheight: 8,
        mapbg: null,

        /**
         * Initializes the application
         * @param opts
         */
        initialize: function() {
            this.listenTo(Backbone, "MAP_EVENT", this.update);
            this.listenTo(Backbone, "VALIDATE_PICTURE", this.imageLoader);

            this.navigationview = new NavigationView();
            this.toolbarview = new ToolbarView();
            this.mapview = new MapView();

            this.childviews.push(this.toolbarview, this.mapview);

            var data = this.readLocalStorage();
            var map = new Map(data);

            if (data.tiles) {
                map.addToTileArray(data.tiles);
            }

            this.imageLoader(map.url(), _.bind(this.update, this, map));
        },

        /**
         * Helper function that reads localstorage and creates credentials from thata data
         * @returns {{url: *, tilesize: *, mapwidth: *, mapheight: *, tiles: null}}
         */
        readLocalStorage: function() {
            var credentials = this.createContentCredentials();
            var data = localStorage.getItem("TJLS_MAP");
            if (data) {
                try {
                    var parsed = $.parseJSON(data);
                    var credentials = this.createContentCredentials(parsed);
                } catch (e) {}
            }

            return credentials;
        },

        /**
         * Helper function for creating map-data
         * @param optional - a anonymous object as input
         * @returns {{url: *, tilesize: *, mapwidth: *, mapheight: *, tiles: null}}
         */
        createContentCredentials: function(optional) {
            return {
                url: typeof(optional) === 'undefined' ? this.url : optional.url,
                tilesize:  typeof(optional) === 'undefined' ? this.tilesize : optional.tilesize,
                mapwidth: typeof(optional) === 'undefined' ? this.mapwidth : optional.mapwidth,
                mapheight: typeof(optional) === 'undefined' ? this.mapheight : optional.mapheight,
                tiles: typeof(optional) === 'undefined' ? null : optional.tiles
            }
        },

        /**
         * Helper function for loading a url to a image
         * @param url - string of a url
         * @param callback - function to call after image is loaded
         */
        imageLoader: function(url, callback) {
            var img = new Image();
            img.src = url;

            $(img).load(function() {
                callback(img);
            })
            .error(function() {
                callback(false);
            });
        },

        /**
         * Calculates the right background for the #Map div
         * @param map - Map (model)
         */
        calculateMapBg: function(map) {
            var backgrounds = ['16x16.png', '32x32.png', '48x48.png', '64x64.png'];

            _.each(backgrounds, function(bg) {
               if (parseInt(bg) === map.tilesize()) {
                   this.mapbg = bg;
               }
            }, this);
        },

        /**
         * Called after a update to the map has happened.
         * Calls all the childviews and updates their credientials
         * @param map - Map (model)
         * @param img - Image
         */
        update: function(map, img) {
            this.calculateMapBg(map);

            //update subviews
            _.each(this.childviews, function(view) {
                view.update(map);
            });

            this.render();

            this.$('#tileset').css({width: img.width, height: img.height});
            this.$('#currenttile').css({width: map.tilesize(), height: map.tilesize()});
            this.$('.selector').css({width: map.tilesize()-2, height: map.tilesize()-2});
            this.$('#map').css({backgroundImage: 'url(assets/img/mapbg/'+this.mapbg+')'});
            this.$('#tileset-wrapper').jScrollPane({mouseWheelSpeed:20});
            this.$("#map-wrapper").jScrollPane({mouseWheelSpeed:20});
        },

        /**
         * Renders the view
         */
        render: function() {
            this.$el.empty();
            this.$el.append(this.navigationview.render().el);

            _.each(this.childviews, function(view) {
                this.$el.append(view.render().el);
            }, this);
        }
    });

    return Editor;
});