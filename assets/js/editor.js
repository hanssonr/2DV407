/**
 * Created by rkh on 2013-11-19.
 */
//init the application
define(['jquery', 'backbone', 'toolbarview', 'mapview', 'mapmodel', 'jscrollpane'],
    function($, Backbone, ToolbarView, MapView, Map, jScrollPane) {

    var Editor = {

        //hardcoded values, TODO: should read input from user
        url: "http://img20.imageshack.us/img20/64/dustvg.png",
        tilesize: 32,
        mapWidth: 20,
        mapHeight: 20,
        map: null,

        initialize: function() {
            this.container = $('#container');
            this.main = $('#main');

            var img = new Image();
            img.src = this.url;
            var that = this;

            $(img).load(function() {
                that.map = new Map({mapsizeX: that.mapWidth, mapsizeY: that.mapHeight, tilesize: that.tilesize});

                that.toolview = new ToolbarView({url: that.url, tilesize: that.tilesize});
                that.mapview = new MapView(that.map);
                that.render();

                $('#tileset').css('width', img.width).css('height', img.height);
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