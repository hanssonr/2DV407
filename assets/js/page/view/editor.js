/**
 * Created by rkh on 2013-11-19.
 */
//init the application

define(['jquery', 'backbone', 'toolbarview', 'mapview', 'navigationview', 'mapmodel', 'jscrollpane'],
    function($, Backbone, ToolbarView, MapView, NavigationView, Map, jScrollPane) {

    var Editor = Backbone.View.extend({

        childviews: [],
        id: "container",

        //defaults
        url: "http://brain.wireos.com/wp-content/uploads/gta2tiles.jpg",
        tilesize: 64,
        mapwidth: 8,
        mapheight: 8,
        map: null,
        mapbg: null,

        initialize: function(opts) {
            this.listenTo(Backbone, "MAP_EVENT", this.update);
            this.listenTo(Backbone, "VALIDATE_PICTURE", this.imageLoader);

            this.map = new Map();
            this.navigationview = new NavigationView();
            this.toolbarview = new ToolbarView();
            this.mapview = new MapView();

            this.childviews.push(this.toolbarview);
            this.childviews.push(this.mapview);

            this.update(this.readLocalStorage());
        },

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

        //calculate the right background for map
        calculateMapBg: function() {
            var backgrounds = ['16x16.png', '32x32.png', '48x48.png', '64x64.png'];

            _.each(backgrounds, function(bg) {
               if (parseInt(bg) === this.tilesize) {
                   this.mapbg = bg;
               }
            }, this);
        },

        createContentCredentials: function(optional) {
            return {
                url: typeof(optional) === 'undefined' ? this.url : optional.url,
                tilesize:  typeof(optional) === 'undefined' ? this.tilesize : optional.tilesize,
                mapwidth: typeof(optional) === 'undefined' ? this.mapwidth : optional.mapwidth,
                mapheight: typeof(optional) === 'undefined' ? this.mapheight : optional.mapheight,
                tiles: typeof(optional) === 'undefined' ? null : optional.tiles
            }
        },

        update: function(opts) {
            this.url = opts.url;
            this.tilesize = opts.tilesize;
            this.mapwidth = opts.mapwidth;
            this.mapheight = opts.mapheight;
            opts.map = this.map;

            this.imageLoader(this.url, _.bind(this.updateCredentials, this, opts));
        },

        updateCredentials: function(opts, img) {
            this.map.update(opts);
            this.calculateMapBg();

            //update subviews
            _.each(this.childviews, function(view) {
                view.update(opts);
            });

            this.render();

            this.$('#tileset').css({width: img.width, height: img.height});
            this.$('#currenttile').css({width: this.tilesize, height: this.tilesize});
            this.$('.selector').css({width: this.tilesize-2, height: this.tilesize-2});
            this.$('#map').css({backgroundImage: 'url(assets/img/mapbg/'+this.mapbg+')'});
            this.$('#tileset-wrapper').jScrollPane({mouseWheelSpeed:20});
            this.$("#map-wrapper").jScrollPane({mouseWheelSpeed:20});
        },

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