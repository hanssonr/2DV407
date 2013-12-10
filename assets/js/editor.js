/**
 * Created by rkh on 2013-11-19.
 */
//init the application

define(['jquery', 'backbone', 'toolbarview', 'mapview', 'navigationview', 'mapmodel', 'jscrollpane'],
    function($, Backbone, ToolbarView, MapView, NavigationView, Map, jScrollPane) {

    var Editor = Backbone.View.extend({

        id: "container",

        //defaults
        url: "http://brain.wireos.com/wp-content/uploads/gta2tiles.jpg",
        tilesize: 64,
        mapwidth: 10,
        mapheight: 10,
        map: null,
        mapbg: null,
        currentTool: 1,

        initialize: function(opts) {
            this.listenTo(Backbone, "newMapEvent", this.createNewSetup);
            this.createNewSetup();
        },

        //Backbone event-callback for creating a new map
        createNewSetup: function(opts) {
            if (typeof(opts) != 'undefined') {
                this.url = opts.url;
                this.tilesize = opts.tilesize;
                this.mapwidth = opts.mapwidth;
                this.mapheight = opts.mapheight;
            }

            this.calculateMapBg();

            var img = new Image();
            img.src = this.url;
            var that = this;

            $(img).load(function() {
                that.map = new Map({
                    mapwidth: that.mapwidth,
                    mapheight: that.mapheight,
                    tilesize: that.tilesize,
                    url: that.url
                });

                that.toolview = new ToolbarView(that.map);
                that.mapview = new MapView(that.map);
                that.navigationview = new NavigationView();
                that.render();

                that.$('#tileset').css({width: img.width, height: img.height});
                that.$('#currenttile').css({width: that.tilesize, height: that.tilesize});
                that.$('.selector').css({width: that.tilesize-2, height: that.tilesize-2});
                that.$('#tileset-wrapper').jScrollPane({mouseWheelSpeed:20});
                that.$('#map').css({backgroundImage: 'url(assets/img/mapbg/'+that.mapbg+')'});
                that.$("#map-wrapper").jScrollPane({mouseWheelSpeed:20});
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

        render: function() {
            this.$el.empty();

            this.$el.append(this.navigationview.render().el);
            this.$el.append(this.toolview.render().el);
            this.$el.append(this.mapview.render().el);
        }
    });

    return Editor;
});