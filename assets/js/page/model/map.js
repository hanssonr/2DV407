/**
 * Created by rkh on 2013-11-26.
 */
define(['backbone', 'tilemodel'],
    function(Backbone, Tile) {

        var Map = Backbone.Model.extend({

            initialize: function(opts) {
                this.update(opts);
                this.listenTo(Backbone, "saveMap", this.createJSON)
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

            createJSON: function() {
                console.log(this);
            },

            getTilesize: function() {
                return this.get("tilesize");
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
                        this.tiles[y][x] = new Tile(array[y][x]);
                    }
                }
            }

        });
        return Map;
    });