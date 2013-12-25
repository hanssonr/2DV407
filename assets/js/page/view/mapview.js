/**
 * Created by rkh on 2013-11-25.
 */

define(['backbone', 'handlebars', 'tilemodel', 'mapmodel', 'tool', 'text!../templates/mapTemplate.html'],
    function(Backbone, Handlebars, Tile, Map, TOOL, mapTemplate) {

    var MapView = Backbone.View.extend({
        id: 'map-wrapper',
        className: 'unselectable',
        template: Handlebars.compile( mapTemplate ),

        events: {
            'mousemove #map': 'hoverMap',
            'mouseleave #map' : 'mouseup',
            'mouseenter #map' : 'mouseenter',
            'mousedown #map': 'mousedown',
            'mouseup': 'mouseup',
            'contextmenu #map': 'contextmenu'
        },

        /**
         * Setup listeners
         */
        initialize: function() {
            this.listenTo(Backbone, "EXPORT_MAP", this.exportMap);
            this.listenTo(Backbone, "SAVE_MAP", this.saveMap);
            this.listenTo(Backbone, "CURRENT_TILE", this.currentTileChange);
            this.listenTo(Backbone, "TOOL_CHANGE", this.setCurrentTool);
            this.listenTo(Backbone, "ROTATE_TILE", function() {
                this.rotateTile();
                this.showOpaqueTile();
            });
        },

        /**
         * Gives focus to this element on mouseenter
         */
        mouseenter: function() {
            $(this.$el).focus();
        },

        /**
         * Changes current tile
         * @param e - array [x, y]
         */
        currentTileChange: function(e) {
            this.currentTile = e;
            this.rotation = 0;
        },

        /**
         * Translates the map into a json-object and opens up a new tab with the data
         */
        exportMap: function() {
            window.open("data:text/JSON;charset=UTF-8;," + this.map.createJSONString(), "_blank");
        },

        /**
         * Saves the map to localstorage
         */
        saveMap: function() {
            localStorage.setItem("TJLS_MAP", this.map.createJSONString());
        },

        /**
         * Disables contextmenu
         * @param e
         */
        contextmenu: function(e) {
            e.preventDefault();
        },

        /**
         * Calculates the mouse position relative to the map
         * @param e
         */
        calculatePosition: function(e) {
            var offsetx = this.$('#map').offset().left;
            var offsety = this.$('#map').offset().top;
            this.mx = Math.floor((e.pageX - offsetx) / this.map.tilesize());
            this.my = Math.floor((e.pageY - offsety) / this.map.tilesize());

            //fix for getting pos < 0 || pos > mapwidth/mapheight
            if (this.mx > this.map.mapwidth()-1) { this.mx = this.map.mapwidth()-1; }
            else if (this.mx < 0) { this.mx = 0; }
            if (this.my > this.map.mapheight()-1) { this.my = this.map.mapheight()-1; }
            else if (this.my < 0) { this.my = 0; }
        },

        /**
         * Updates the current tool
         * @param toolID
         */
        setCurrentTool: function(toolID) {
            this.currentTool = toolID;
        },

        /**
         * Puts or updates a tile on the map-object
         */
        setTile: function() {
            var tile = this.map.tiles[this.my][this.mx];

            if (typeof(tile) === 'undefined') {
                tile = new Tile({
                    position: [this.mx, this.my],
                    bgPosition: [this.currentTile[0], this.currentTile[1]],
                    element: this.createDOMElement(),
                    rotation: this.rotation
                });

                this.map.tiles[this.my][this.mx] = tile;
                this.drawTile(tile.getElement());
            } else {
                tile.setBackgroundPosition([this.currentTile[0], this.currentTile[1]]);
                tile.setRotation(this.rotation);
                this.$(tile.getElement()).css({
                    backgroundPosition: tile.getBgX() + 'px ' + tile.getBgY() + 'px',
                    transform:'rotate('+ tile.getRotation() +'deg)'
                });
            }
        },

        /**
         * Helper function to create a div-tag representing a tile
         * @param input - optional data (used when reading tiles from a json-object)
         * @returns {HTMLElement}
         */
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

            var div = document.createElement('div');
            $(div).css({
                position: 'absolute',
                top: tileY * this.map.tilesize(),
                left: tileX * this.map.tilesize(),
                width: this.map.tilesize(),
                height: this.map.tilesize(),
                backgroundImage: 'url('+this.map.url()+')',
                backgroundPosition: bgX + 'px ' + bgY + 'px',
                transform:'rotate('+ rotation +'deg)'
            });

            return div;
        },

        /**
         * Rotates a tile
         */
        rotateTile: function() {
            this.rotation = this.rotation + 90 > 270 ? 0 : this.rotation + 90;
            Backbone.trigger("ROTATION_DEGREES", this.rotation);
        },

        /**
         * Removes a tile from the map-object
         */
        removeTile: function() {
            var tile = this.map.tiles[this.my][this.mx];
            if (tile === undefined) return;

            this.$(tile.getElement()).remove();
            this.map.tiles[this.my][this.mx] = undefined;
        },

        /**
         * Puts a element to the DOM
         * @param element - HTML element (div tag or a documentFragment)
         */
        drawTile: function(element) {
            this.$("#map div:last").before(element);
        },

        /**
         * Clears the interval for the trigger
         * @param e
         */
        mouseup: function(e) {
            clearInterval(this.trigger);
        },

        //Takes care of mousedown commands and do the appropriate thing depending on mousebutton
        /**
         * Function that handles mousedown commands
         * Left button(0): Do different things depending on marked tool
         * Middle button (1): Rotates current tile
         * Right button (2): Sets currenttile to the clicked one
         * @param e
         */
        mousedown: function(e) {
            if(e.button === 0) { //Left mouse button
                if(this.currentTool === TOOL.DRAW) {
                    this.trigger = setInterval(_.bind(function() {this.setTile();},this), 10);
                }
                else if (this.currentTool === TOOL.ERASE) {
                    this.trigger = setInterval(_.bind(function() {this.removeTile();},this), 10);
                }
                else if (this.currentTool === TOOL.FILL) {
                    this.fill(this.mx, this.my);
                }
            }
            else if(e.button === 1) { //Middle mouse button
                e.preventDefault();
                this.rotateTile();
            }
            else if(e.button === 2) { //Right mouse button
                var tile = this.map.tiles[this.my][this.mx];

                if (tile !== undefined) {
                    var mapPos = $(tile.getElement()).css('background-position').split(' ');
                    Backbone.trigger("CURRENT_TILE", [parseInt(mapPos[0]), parseInt(mapPos[1])]);
                }
            }
        },

        /**
         * Moves the selector over the map by calculating its position
         * and applying css
         * @param e
         */
        hoverMap: function(e) {
            this.calculatePosition(e);
            this.$('.selector').css({
                top: this.my * this.map.tilesize(),
                left: this.mx * this.map.tilesize()
            });

            this.showOpaqueTile();
        },

        /**
         * Sets the current chosen tile's background to the selector
         */
        showOpaqueTile: function() {
            this.$('.selector').css({
                backgroundImage: 'url('+this.map.url()+')',
                backgroundPosition: this.currentTile[0] + 'px ' + this.currentTile[1] + 'px',
                opacity: 0.5,
                transform:'rotate('+ this.rotation +'deg)'
            });
        },

        /**
         * Flood-fill algorithm
         * Gets the tile at position [x,y], checks its background and tries to
         * change all backgrounds that are the same to the currenttile's background
         * @param x - int of clicked tile
         * @param y - int of clicked tile
         */
        fill: function(x, y) {
            var match = this.map.tiles[y][x] === undefined ? undefined : this.map.tiles[y][x].getBgPosition().toString();

            if (this.checkMatch(this.currentTile.toString(), match)) { return; }

            var fillqueue = [];
            var fragment = document.createDocumentFragment();
            var x, y, current, target;

            fillqueue.push([x, y]);
            while(fillqueue.length > 0) {
                current = fillqueue.pop();
                x = current[0];
                y = current[1];

                target = this.map.tiles[y][x] === undefined ? undefined : this.map.tiles[y][x].getBgPosition().toString();

                if (this.checkMatch(target, match)) {
                    if (target === undefined) {
                        target = new Tile({
                            position: [x, y],
                            bgPosition: [this.currentTile[0], this.currentTile[1]],
                            rotation: this.rotation
                        });
                        target.setElement(this.createDOMElement(target));
                        this.map.tiles[y][x] = target;
                        fragment.appendChild(target.getElement());
                    } else {
                        target = this.map.tiles[y][x];
                        target.setBackgroundPosition(this.currentTile);
                        $(target.getElement()).css({
                            backgroundPosition: target.getBgX() + 'px ' + target.getBgY() + 'px',
                            transform:'rotate('+ this.rotation +'deg)'
                        });
                    }

                    if (x-1 >= 0) { fillqueue.push([x-1, y]); }
                    if (x+1 <= this.map.mapwidth()-1) { fillqueue.push([x+1, y]); }
                    if (y-1 >= 0) { fillqueue.push([x, y-1]); }
                    if (y+1 <= this.map.mapheight()-1) { fillqueue.push([x, y+1]); }
                }
            }

            this.drawTile(fragment);
            return;
        },

        /**
         * Helpfunction for the fill-function
         * @param target undefined || String
         * @param match undefined || String
         * @returns {boolean}
         */
        checkMatch: function(target, match) {
            if (target === undefined && match === undefined) { return true; }
            if (target === undefined && match !== undefined) { return false; }
            if (target !== undefined && match === undefined) { return false; }
            return target === match;
        },

        /**
         * Renders the view
         * if the tempfragment has tiles, render them
         * @returns {MapView}
         */
        render: function() {
            this.$el.html(this.template(this));

            if (this.tempfragment !== null) {
                this.drawTile(this.tempfragment);
                this.tempfragment = null;
            }

            this.delegateEvents();
            return this;
        },

        /**
         * Updates the view
         * if the map-object has tiles, put them into a fragment
         * @param map
         */
        update: function(map) {
            this.map = map;

            this.currentTile = [0,0];
            this.mapwidth = this.map.getCalculatedWidth();
            this.mapheight = this.map.getCalculatedHeight();

            this.tempfragment = document.createDocumentFragment();
            _.each(this.map.tiles, function(cols) {
                _.each(cols, function(tile) {
                    if(typeof(tile) !== 'undefined') {
                        tile.setElement(this.createDOMElement(tile));
                        this.tempfragment.appendChild(tile.getElement());
                    }
                }, this);
            }, this);
        }
    });

    return MapView;
});