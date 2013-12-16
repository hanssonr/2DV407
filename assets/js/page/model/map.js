/**
 * Created by rkh on 2013-11-26.
 */
define(['backbone', 'tilemodel'],
    function(Backbone, Tile) {

        var Map = Backbone.Model.extend({

            initialize: function(opts) {
                this.update(opts);
            },

            createTileArray: function() {
                this.tiles = [];
                for (var y=0; y < this.mapheight; y++) {
                    this.tiles[y] = [];
                    for (var x=0; x < this.mapwidth; x++) {
                        this.tiles[y][x] = undefined;
                    }
                }
            },

            getCalculatedWidth: function() {
                return this.mapwidth * this.tilesize;
            },

            getCalculatedHeight: function() {
                return this.mapheight * this.tilesize;
            },

            createJSONString: function() {
                var output = {
                    "url": this.url,
                    "mapwidth": this.mapwidth,
                    "mapheight": this.mapheight,
                    "tilesize": this.tilesize,
                    "tiles": this.generateTiles()
                }

                return JSON.stringify(output);
            },

            generateTiles: function() {
                var temp = [];
                for(var y = 0; y < this.mapheight; y++) {
                    temp.push([]);
                    for (var x = 0; x < this.mapwidth; x++) {
                        if (typeof(this.tiles[y][x]) != 'undefined') {
                            temp[y].push(this.tiles[y][x].toReadable());
                        }
                    }
                }
                return temp;
            },

            update: function(opts) {
                this.mapwidth = opts.mapwidth;
                this.mapheight = opts.mapheight;
                this.tilesize = opts.tilesize;
                this.url = opts.url;

                this.createTileArray();
                if (opts.tiles) {
                    this.addToTileArray(opts.tiles);
                }
            },

            addToTileArray: function(array) {
                for (var y=0; y < array.length; y++) {
                    for (var x=0; x < array[y].length; x++) {
                        var tx = array[y][x].position[0];
                        var ty = array[y][x].position[1];
                        this.tiles[ty][tx] = new Tile(array[y][x]);
                    }
                }
            }

        });
        return Map;
    });