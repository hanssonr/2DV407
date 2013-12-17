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
        currentTile: [0,0],
        currentTool: 1,
        temptiles: [],

        events: {
            'mousemove #map': 'hoverMap',
            'mousedown #map': 'mousedown',
            'mouseup': 'mouseup',
            'contextmenu #map': 'contextmenu'
        },

        initialize: function(opts) {
            this.listenTo(Backbone, "saveMap", this.saveMap);
            this.listenTo(Backbone, "currentTile", this.currentTileChange);
            this.listenTo(Backbone, "toolChange", this.setCurrentTool);
            this.listenTo(Backbone, "rotateTile", function() {
                this.rotateTile();
                this.showOpaqueTile();
            });

            this.map = opts.map;
            this.mapwidth = this.map.getCalculatedWidth();
            this.mapheight = this.map.getCalculatedHeight();
        },

        currentTileChange: function(e) {
            this.currentTile = e;
            this.setCurrentTool(1);
        },

        saveMap: function() {
            window.open("data:text/JSON;charset=UTF-8;," + this.map.createJSONString(), "_blank");
        },

        //Remove contextmenu
        contextmenu: function(e) {
            e.preventDefault();
        },

        //Calculate map-x/map-y
        calculatePosition: function(e) {
            offsetx = $('#map').offset().left;
            offsety = $('#map').offset().top;
            this.mx = Math.floor((e.pageX - offsetx) / this.map.tilesize);
            this.my = Math.floor((e.pageY - offsety) / this.map.tilesize);

            //fix for getting pos < 0 || pos > mapwidth/mapheight
            if (this.mx > this.map.mapwidth-1) { this.mx = this.map.mapwidth-1; }
            else if (this.mx < 0) { this.mx = 0; }
            if (this.my > this.map.mapheight-1) { this.my = this.map.mapheight-1; }
            else if (this.my < 0) { this.my = 0; }
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

            var tile = this.map.tiles[this.my][this.mx];

            if (typeof(tile) === 'undefined') {
                tile = new Tile({
                    position: [this.mx, this.my],
                    bgPosition: [this.currentTile[0], this.currentTile[1]],
                    element: this.createDOMElement(),
                    rotation: this.rotation
                });

                this.map.tiles[this.my][this.mx] = tile;
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

        createDOMElement: function(input) {
            var tileX = this.mx;
            var tileY = this.my;
            var bgX = this.currentTile[0];
            var bgY = this.currentTile[1];
            var rotation = this.rotation;

            if (input) {
                tileX = input.getTileX();
                tileY = input.getTileY();
                bgX = input.getBgX();
                bgY = input.getBgY();
                rotation = input.getRotation();
            }

            var div = $("<div></div>");
            $(div).css({
                position: 'absolute',
                top: tileY * this.map.tilesize,
                left: tileX * this.map.tilesize,
                width: this.map.tilesize,
                height: this.map.tilesize,
                backgroundImage: 'url('+this.map.url+')',
                backgroundPosition: bgX + 'px ' + bgY + 'px',
                transform:'rotate('+ rotation +'deg)'
            });

            return div;
        },

        rotateTile: function() {
            this.rotation = this.rotation + 90 > 270 ? 0 : this.rotation + 90;
        },

        //removes a tile from the map
        removeTile: function() {
            if(this.currentTool !== 0) return;
            if(!this.mdown) return;

            var tile = this.map.tiles[this.my][this.mx];
            if (typeof(tile) === 'undefined') return;
            this.$(tile.getElement()).remove();
            this.map.tiles[this.my][this.mx] = undefined;
        },

        drawTile: function(tile) {
            this.$("#map div:last").before(tile.getElement());
        },

        //Clears the interval and reset mdown variable
        mouseup: function(e) {
            this.mdown = false;
            clearInterval(this.trigger);

            //save to localStorage
            this.map.save();
        },

        //Takes care of mousedown commands and do the appropriate thing depending on mousebutton
        mousedown: function(e) {
            if(e.button == 0) { //Draw
                var that = this;
                this.mdown = true;

                if(this.currentTool == 1) {
                    this.trigger = setInterval(function() {that.setTile();}, 10);
                }
                else if (this.currentTool == 0) {
                    this.trigger = setInterval(function() {that.removeTile();}, 10);
                }
            }
            else if(e.button == 1) { //Rotate
                e.preventDefault();
                this.rotateTile();
            }
            else if(e.button == 2) { //Copy tile from map
                var tile = this.map.tiles[this.my][this.mx];

                if (typeof(tile) != 'undefined') {
                    var mapPos = $(tile.getElement()).css('background-position').split(' ');
                    Backbone.trigger("currentTile", [parseInt(mapPos[0]), parseInt(mapPos[1])]);
                }
            }
        },

        //Moves the selector over the #Map via CSS
        hoverMap: function(e) {
            this.calculatePosition(e);
            this.$('.selector').css({
                top: this.my * this.map.tilesize,
                left: this.mx * this.map.tilesize
            });

            this.showOpaqueTile();
        },

        showOpaqueTile: function() {
            if(this.currentTile === null) {
                this.$('.selector').css({backgroundImage: 'url('+ +')'});
            } else {
                this.$('.selector').css({
                    backgroundImage: 'url('+this.map.url+')',
                    backgroundPosition: this.currentTile[0] + 'px ' + this.currentTile[1] + 'px',
                    opacity: 0.5,
                    transform:'rotate('+ this.rotation +'deg)'
                });
            }
        },

        render: function() {
            this.$el.html(this.template(this));

            if (this.temptiles.length != 0) {
                var that = this;
                this.temptiles.forEach(function(tile) {
                    that.drawTile(tile);
                });

                this.temptiles = [];
            }

            this.delegateEvents();
            return this;
        },

        update: function(opts) {
            this.map = opts.map;
            this.mapwidth = this.map.getCalculatedWidth();
            this.mapheight = this.map.getCalculatedHeight();

            var that = this;
            this.map.tiles.forEach(function(cols) {
                cols.forEach(function(tile) {
                    if(typeof(tile) !== "undefined") {
                        tile.setElement(that.createDOMElement(tile));
                        that.temptiles.push(tile);
                    }
                })
            });
        }
    });

    return MapView;
});