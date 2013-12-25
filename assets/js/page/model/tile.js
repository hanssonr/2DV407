/**
 * Created by rkh on 2013-11-19.
 *
 * Object representing a Tile
 */
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

        getBgString: function() {
            return this.get('bgPosition').toString();
        },

        setRotation: function(deg) {
            this.set({rotation: deg});
        },

        getTileX: function() {
            return this.get("position")[0];
        },

        getBgPosition: function() {
            return this.get("bgPosition");
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

        setElement: function(div) {
            this.set({element: div});
        },

        getRotation: function() {
            return this.get("rotation");
        },

        toReadable: function() {
            return {
                position: this.get('position'),
                bgPosition: this.get('bgPosition'),
                rotation: this.get('rotation')
            }
        }
    });

    return Tile;
});