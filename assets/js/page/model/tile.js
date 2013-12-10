/**
 * Created by rkh on 2013-11-19.
 */

//Model for a tile
define(['backbone'], function(Backbone) {
    var Tile = Backbone.Model.extend({

        initialize: function() {
        },

        setTilePosition: function(newpos) {
            this.set({position: newpos});
        },

        setBackgroundPosition: function(newpos) {
            this.set({bgPosition: newpos});
        },

        setRotation: function(deg) {
            this.set({rotation: deg});
        },

        getTileX: function() {
            return this.get("position")[0];
        },

        getTileY: function() {
            return this.get("position")[1];
        },

        getBgX: function() {
            return this.get("bgPosition")[0];
        },

        getBgY: function() {
            return this.get("bgPosition")[1];
        },

        getElement: function() {
            return this.get("element");
        },

        getRotation: function() {
            return this.get("rotation");
        }
    });

    return Tile;
});