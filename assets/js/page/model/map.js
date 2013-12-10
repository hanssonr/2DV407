/**
 * Created by rkh on 2013-11-26.
 */
define(['backbone', 'tilemodel'],
    function(Backbone, Tile) {

        var Map = Backbone.Model.extend({
            tiles: null,
            mapwidth: 0,
            mapheight: 0,
            tilesize: 0,

            initialize: function(opts) {
                this.mapwidth = opts.mapwidth;
                this.mapheight = opts.mapheight;
                this.tilesize = opts.tilesize;
                this.url = opts.url;
                this.tiles = [];

                for (var y=0; y < this.mapheight; y++) {
                    this.tiles[y] = [];
                    for (var x=0; x < this.mapwidth; x++) {
                        this.tiles[y][x] = undefined;
                    }
                }

                this.listenTo(Backbone, "saveMap", this.createJSON)
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

            addTileArray: function(array) {
                for (var y=0; y < array.length; y++) {
                    for (var x=0; x < array[y].length; x++) {
                        this.tiles[y][x] = new Tile(array[y][x]);
  /*                      this.tiles[y][x] = new Tile({
                            position: [, my],
                            bgPosition: [this.currentTile[0], this.currentTile[1]],
                            element: div,
                            rotation: this.rotation
                        });*/
                    }
                }

                console.log(this);
            }

        });
        return Map;
    });