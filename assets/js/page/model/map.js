/**
 * Created by rkh on 2013-11-26.
 */
define(['backbone'],
    function(Backbone) {

        var Map = Backbone.Model.extend({
            tiles: [],

            initialize: function(opts) {
                this.mapwidth = opts.mapwidth;
                this.mapheight = opts.mapheight;
                this.tilesize = opts.tilesize;
                this.url = opts.url;

                for (var y=0; y < this.mapheight; y++) {
                    this.tiles[y] = new Array(this.mapwidth);
                }
            },

            getCalculatedWidth: function() {
                return this.mapwidth * this.tilesize;
            },

            getCalculatedHeight: function() {
                return this.mapheight * this.tilesize;
            }


        });
        return Map;
    });