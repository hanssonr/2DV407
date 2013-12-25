/**
 * Created by rkh on 2013-11-26.
 *
 * Object representing a Map
 */
define(['backbone', 'tilemodel'],
    function(Backbone, Tile) {

        var Map = Backbone.Model.extend({

            /**
             * Model validation
             */
            validation: {
                url: [{
                    required: true,
                    pattern: 'url',
                    msg: "Please fill in a URL to a tilesheet"
                }],
                tilesize: [{
                    required: true,
                    oneOf: [16, 32, 48, 64],
                    msg: 'Tilesize must be either of (16, 32, 48, 64)'
                }],
                mapwidth: [{
                    required: true,
                    range: [1, 250],
                    pattern: 'number',
                    msg: 'Mapwidth must be in the range 1-250'
                }],
                mapheight: [{
                    required: true,
                    range: [1, 250],
                    pattern: 'number',
                    msg: 'Mapheight must be in the range 1-250'
                }]
            },

            initialize: function() {
                this.tiles = [];
                this.createTileArray();
            },

            /**
             * Creates a matrix for the map
             */
            createTileArray: function() {
                for (var y=0; y < this.mapheight(); y++) {
                    this.tiles[y] = [];
                    for (var x=0; x < this.mapwidth(); x++) {
                        this.tiles[y][x] = undefined;
                    }
                }
            },

            /**
             * Calculates mapwidth in pixels
             * @returns {number}
             */
            getCalculatedWidth: function() {
                return this.mapwidth() * this.tilesize();
            },

            /**
             * Calculates mapheight in pixels
             * @returns {number}
             */
            getCalculatedHeight: function() {
                return this.mapheight() * this.tilesize();
            },

            /**
             * Creates JSON-string of the map-object
             * @returns {*}
             */
            createJSONString: function() {
                var output = {
                    "url": this.url(),
                    "mapwidth": this.mapwidth(),
                    "mapheight": this.mapheight(),
                    "tilesize": this.tilesize(),
                    "tiles": this.generateTiles()
                }

                return JSON.stringify(output);
            },

            /**
             * Creates readable string of the tiles-array inside the map-object
             * @returns {Array}
             */
            generateTiles: function() {
                var temp = [];
                for(var y = 0; y < this.mapheight(); y++) {
                    temp.push([]);
                    for (var x = 0; x < this.mapwidth(); x++) {
                        if (typeof(this.tiles[y][x]) != 'undefined') {
                            temp[y].push(this.tiles[y][x].toReadable());
                        }
                    }
                }
                return temp;
            },

            /**
             * Adds tiles to the tilearray
             * @param array
             */
            addToTileArray: function(array) {
                for (var y=0; y < array.length; y++) {
                    for (var x=0; x < array[y].length; x++) {
                        var tx = array[y][x].position[0];
                        var ty = array[y][x].position[1];
                        this.tiles[ty][tx] = new Tile(array[y][x]);
                    }
                }
            },

            url: function() {
                return this.get('url');
            },

            tilesize: function() {
                return this.get('tilesize');
            },

            mapwidth: function() {
                return this.get('mapwidth');
            },

            mapheight: function() {
                return this.get('mapheight');
            }

        });
        return Map;
    });