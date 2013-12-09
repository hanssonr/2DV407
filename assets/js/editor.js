/**
 * Created by rkh on 2013-11-19.
 */
//init the application

define(['jquery', 'backbone', 'toolbarview', 'mapview', 'navigationview', 'mapmodel'],
    function($, Backbone, ToolbarView, MapView, NavigationView, Map) {

    var Editor = {

        //defaults
        url: "http://brain.wireos.com/wp-content/uploads/gta2tiles.jpg",
        tilesize: 64,
        mapwidth: 25,
        mapheight: 25,
        map: null,
        currentTile: null,
        mapbg: null,

        initialize: function(opts) {

            this.container = $('#container');
            this.main = $('#main');

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
                that.map = new Map({mapwidth: that.mapwidth, mapheight: that.mapheight, tilesize: that.tilesize});

                that.toolview = new ToolbarView(that);
                that.mapview = new MapView(that);
                that.navigationview = new NavigationView(that);
                that.render();

                $('#tileset').css({width: img.width, height: img.height});
                $('#tools').css({width: that.tilesize, height: that.tilesize});
                $('.selector').css({width: that.tilesize-2, height: that.tilesize-2});
                //$('#tileset-wrapper').jScrollPane({mouseWheelSpeed:20});
                $('#map').css({backgroundImage: 'url(assets/img/mapbg/'+that.mapbg+')'});
                //$("#map-wrapper").jScrollPane({mouseWheelSpeed:20});
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
            this.container.empty();
            this.container.append(this.navigationview.render().el);
            this.container.append(this.toolview.render().el);
            this.container.append(this.mapview.render().el);
        }
    }

    return Editor;
});