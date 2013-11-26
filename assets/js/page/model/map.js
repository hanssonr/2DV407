/**
 * Created by rkh on 2013-11-26.
 */
define(['backbone'],
    function(Backbone) {

        var Map = Backbone.Model.extend({
            tiles: [],

            initialize: function(opts) {
                this.mapsizeX = opts.mapsizeX;
                this.mapsizeY = opts.mapsizeY;
                this.tilesize = opts.tilesize;

                for (var y=0; y < this.mapsizeY; y++) {
                    this.tiles[y] = new Array(this.mapsizeX);
                }
            },

            getCalculatedWidth: function() {
                return this.mapsizeX * this.tilesize;
            },

            getCalculatedHeight: function() {
                return this.mapsizeY * this.tilesize;
            }


        });
        return Map;
    });