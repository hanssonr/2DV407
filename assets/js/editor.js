/**
 * Created by rkh on 2013-11-19.
 */
//init the application
define(['jquery', 'backbone', 'toolbarview', 'mapview', 'mapmodel', 'jscrollpane'],
    function($, Backbone, ToolbarView, MapView, Map, jScrollPane) {

    var Editor = {

        //hardcoded values, TODO: should read input from user
        url: "http://brain.wireos.com/wp-content/uploads/gta2tiles.jpg",
        tilesize: 64,
        mapWidth: 15,
        mapHeight: 15,
        map: null,
        currentTile: null,

        initialize: function() {
            this.container = $('#container');
            this.main = $('#main');

            var img = new Image();
            img.src = this.url;
            var that = this;

            $(img).load(function() {
                that.map = new Map({mapsizeX: that.mapWidth, mapsizeY: that.mapHeight, tilesize: that.tilesize});

                that.toolview = new ToolbarView({url: that.url, tilesize: that.tilesize, editor: that});
                that.mapview = new MapView(that);
                that.render();

                $('#tileset').css({width: img.width, height: img.height});
                $('.selector').css({width: that.tilesize-2, height: that.tilesize-2});
                $('#tileset-wrapper').jScrollPane({mouseWheelSpeed:20});
            });
        },

        render: function() {
            this.container.append(this.toolview.render().el);
            this.main.append(this.mapview.render().el);
        }
    }

    return Editor;
});