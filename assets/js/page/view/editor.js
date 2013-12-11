/**
 * Created by rkh on 2013-11-19.
 */
//init the application

define(['jquery', 'backbone', 'baseview', 'toolbarview', 'mapview', 'navigationview', 'mapmodel', 'jscrollpane'],
    function($, Backbone, BaseView, ToolbarView, MapView, NavigationView, Map, jScrollPane) {

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
            this.listenTo(Backbone, "newMapEvent", this.createNewSetup);
            this.listenTo(Backbone, "openMapEvent", this.update);

            this.createMap();
            this.calculateMapBg();
            this.navigationview = new NavigationView();
            this.toolbarview = new ToolbarView(this.map);
            this.mapview = new MapView(this.map);

            this.childviews.push(this.navigationview);
            this.childviews.push(this.toolbarview);
            this.childviews.push(this.mapview);

            this.createNewSetup();
        },

        //Backbone event-callback for creating a new map
        createNewSetup: function(opts) {
/*            if (typeof(opts) != 'undefined') {
                this.url = opts.url;
                this.tilesize = opts.tilesize;
                this.mapwidth = opts.mapwidth;
                this.mapheight = opts.mapheight;

                if (typeof(opts.tiles) != 'undefined') {
                    this.map = this.createMap();
                    this.map.addTileArray(opts.tiles);
                }
            }*/

            var that = this;
            this.imageLoader(this.url, function(img) {
                that.render();

                that.$('#tileset').css({width: img.width, height: img.height});
                that.$('#currenttile').css({width: that.tilesize, height: that.tilesize});
                that.$('.selector').css({width: that.tilesize-2, height: that.tilesize-2});
                that.$('#tileset-wrapper').jScrollPane({mouseWheelSpeed:20});
                that.$('#map').css({backgroundImage: 'url(assets/img/mapbg/'+that.mapbg+')'});
                that.$("#map-wrapper").jScrollPane({mouseWheelSpeed:20});
            });
        },

        imageLoader: function(url, callback) {
            var img = new Image();
            img.src = url;
            var that = this;

            $(img).load(function() {
                callback(img);
            });
        },

        //calculate the right background for map
        calculateMapBg: function() {
            var backgrounds = ['16x16.png', '32x32.png', '48x48.png', '64x64.png'];

            var that = this;
            backgrounds.forEach(function(bg) {
               if (parseInt(bg) === that.tilesize) {
                   that.mapbg = bg;
               }
            });
        },

        createMap: function() {
            this.map = new Map({
                mapwidth: this.mapwidth,
                mapheight: this.mapheight,
                tilesize: this.tilesize,
                url: this.url
            });
        },

        render: function() {
            this.$el.empty();

            console.log(this.$el);
            var that = this;
            this.childviews.forEach(function(view) {
                that.$el.append(view.render().el);
            });
        },

        update: function(opts) {
            this.url = opts.url;
            this.tilesize = opts.tilesize;
            this.mapwidth = opts.mapwidth;
            this.mapheight = opts.mapheight;
            opts.map = this.map;

            var that = this;
            this.imageLoader(this.url, function() {
                that.map.update(opts);

                that.$('#currenttile').css({width: that.tilesize, height: that.tilesize});
                that.$('.selector').css({width: that.tilesize-2, height: that.tilesize-2});
                that.$('#map').css({backgroundImage: 'url(assets/img/mapbg/'+that.mapbg+')'});

                //update subviews
                that.childviews.forEach(function(view) {
                    view.update(opts);
                });

                that.render();
            });

        }
    });

    return Editor;
});