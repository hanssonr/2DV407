/**
 * Created by rkh on 2013-11-25.
 */

define(['backbone', 'handlebars', 'tilemodel', 'text!../templates/mapTemplate.html'],
    function(Backbone, Handlebars, Tile, mapTemplate) {

    var MapView = Backbone.View.extend({
        id: 'map-wrapper',
        template: Handlebars.compile( mapTemplate ),

        mapwidth: 0,
        mapheight: 0,
        offsetx: 0,
        offsety: 0,
        mx: 0,
        my: 0,
        mdown: false,
        trigger: null,
        rotation: 0,
        currentTile: null,
        currentTool: 1,

        initialize: function(opts) {
            this.listenTo(Backbone, "currentTile", this.currentTileChange);
            this.listenTo(Backbone, "toolChange", this.setCurrentTool);
            this.map = opts;
            this.mapwidth = this.map.getCalculatedWidth();
            this.mapheight = this.map.getCalculatedHeight();
        },

        currentTileChange: function(e) {
            this.currentTile = e;
            this.setCurrentTool(1);
        },

        events: {
            'mousemove #map': 'hoverMap',
            'mousedown #map': 'mousedown',
            'mouseup': 'mouseup',
            'contextmenu #map': 'contextmenu'
        },

        //Remove contextmenu
        contextmenu: function(e) {
            e.preventDefault();
        },

        //Calculate map-x/map-y
        calculatePosition: function(e) {
            offsetx = $('#map').offset().left;
            offsety = $('#map').offset().top;
            mx = Math.floor((e.pageX - offsetx) / this.map.tilesize);
            my = Math.floor((e.pageY - offsety) / this.map.tilesize);

            //fix for getting pos < 0 || pos > mapwidth/mapheight
            if (mx > this.map.mapwidth-1) { mx = this.map.mapwidth-1; }
            else if (mx < 0) { mx = 0; }
            if (my > this.map.mapheight-1) { my = this.map.mapheight-1; }
            else if (my < 0) { my = 0; }
        },

        /*
            0 == erase
            1 == draw
         */
        setCurrentTool: function(toolID) {
            this.currentTool = toolID;
        },

        //Draws a tile to #Map and puts it into the array in the map-object
        setTile: function() {
            if(this.currentTool !== 1) return;
            if(!this.mdown) return;
            if(this.currentTile == null) return;

            var tile = this.map.tiles[my][mx];

            if (typeof(tile) === 'undefined') {
                var div = $("<div></div>");
                $(div).css({
                    position: 'absolute',
                    top: my * this.map.tilesize,
                    left: mx * this.map.tilesize,
                    width: this.map.tilesize,
                    height: this.map.tilesize,
                    backgroundImage: 'url('+this.map.url+')',
                    backgroundPosition: this.currentTile[0] + 'px ' + this.currentTile[1] + 'px',
                    transform:'rotate('+ this.rotation +'deg)'
                });

                tile = new Tile({
                    position: [mx, my],
                    bgPosition: [this.currentTile[0], this.currentTile[1]],
                    element: div,
                    rotation: this.rotation
                });

                this.map.tiles[my][mx] = tile;
                this.drawTile(tile);
            } else {
                tile.setBackgroundPosition([this.currentTile[0], this.currentTile[1]]);
                tile.setRotation(this.rotation);
                this.$(tile.getElement()).css({
                    backgroundPosition: tile.getBgX() + 'px ' + tile.getBgY() + 'px',
                    transform:'rotate('+ tile.getRotation() +'deg)'
                });
            }
        },

        //removes a tile from the map
        removeTile: function() {
            if(this.currentTool !== 0) return;
            if(!this.mdown) return;

            var tile = this.map.tiles[my][mx];
            if (typeof(tile) === 'undefined') return;
            this.$(tile.getElement()).remove();
            this.map.tiles[my][mx] = undefined;
        },

        drawTile: function(tile) {
            this.$("#map div:last").before(tile.getElement());
        },

        //Clears the interval and reset mdown variable
        mouseup: function(e) {
            this.mdown = false;
            clearInterval(this.trigger);
        },

        //Takes care of mousedown commands and do the appropriate thing depending on mousebutton
        mousedown: function(e) {
            if(e.button == 0) {
                var that = this;
                this.mdown = true;

                if(this.currentTool == 1) {
                    this.trigger = setInterval(function() {that.setTile();}, 10);
                }
                else if (this.currentTool == 0) {
                    this.trigger = setInterval(function() {that.removeTile();}, 10);
                }
            }
            else if(e.button == 1) {
                e.preventDefault();
                this.rotation = this.rotation + 90 > 270 ? 0 : this.rotation + 90;
            }
            else if(e.button == 2) {
                var tile = this.map.tiles[my][mx];

                if (typeof(tile) != 'undefined') {
                    var mapPos = $(tile.getElement()).css('background-position').split(' ');
                    Backbone.trigger("currentTile", [parseInt(mapPos[0]), parseInt(mapPos[1])]);
                }
            }
        },

        //Moves the selector over the #Map via CSS
        hoverMap: function(e) {
            this.calculatePosition(e);
            $('#map-wrapper .selector').css('top', my * this.map.tilesize).css('left', mx * this.map.tilesize);

            if(this.currentTile === null) {
                $('#map-wrapper .selector').css({backgroundImage: 'url('+ +')'});
            } else {
                $('#map-wrapper .selector').css({
                    backgroundImage: 'url('+this.map.url+')',
                    backgroundPosition: this.currentTile[0] + 'px ' + this.currentTile[1] + 'px',
                    opacity: 0.5,
                    transform:'rotate('+ this.rotation +'deg)'
                });
            }
        },

        render: function() {
            this.$el.empty();
            this.$el.html(this.template(this));
            return this;
        }
    });

    return MapView;
});