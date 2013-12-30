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
        url: "http://fc06.deviantart.net/fs71/f/2010/091/4/2/RPG_Maker_VX_RTP_Tileset_by_telles0808.png",
        tilesize: 32,
        mapwidth: 25,
        mapheight: 25,
        mapbg: null,

        /**
         * Initializes the application
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
         * Helper function that reads localstorage and creates data from its content
         * @returns {{url: *, tilesize: *, mapwidth: *, mapheight: *, tiles: null}}
         */
        readLocalStorage: function() {
            var content = this.createContentData();
            var data = localStorage.getItem("TJLS_MAP");
            if (data) {
                try {
                    var parsed = $.parseJSON(data);
                    content = this.createContentData(parsed);
                } catch (e) {}
            }

            return content;
        },

        /**
         * Helper function for creating map-data
         * @param optional - a anonymous object as input
         * @returns {{url: *, tilesize: *, mapwidth: *, mapheight: *, tiles: null}}
         */
        createContentData: function(optional) {
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
         * Creates background for the #Map div
         * @param map - Map (model)
         */
        createMapBg: function(map) {
            var canvas = document.createElement("canvas");

            var w = canvas.width = map.tilesize();
            var h = canvas.height = map.tilesize();

            var ctx = canvas.getContext("2d");
            ctx.fillRect(0, h-1, w, 1);
            ctx.fillRect(w-1, 0, 1, h);

            this.mapbg = canvas.toDataURL();
        },

        /**
         * Called after a update to the map has happened.
         * Calls all the childviews and updates their data
         * @param map - Map (model)
         * @param img - Image
         */
        update: function(map, img) {
            this.createMapBg(map);

            //update subviews
            _.each(this.childviews, function(view) {
                view.update(map);
            });

            this.render();

            this.$('#tileset').css({width: img.width, height: img.height});
            this.$('#currenttile').css({width: map.tilesize(), height: map.tilesize()});
            this.$('.selector').css({width: map.tilesize()-2, height: map.tilesize()-2});
            this.$('#map').css({backgroundImage: 'url('+this.mapbg+')'});
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