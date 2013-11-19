/**
 * Created by rkh on 2013-11-19.
 */

//Model for a tile
define(['backbone'], function(Backbone) {
    var Tile = Backbone.Model.extend({

        //instantiate default values if none was
        defaults: {
            position: [0,0],
            typeId: -1
        },

        setPosition: function(newpos) {
            this.set({position: newpos});
        },

        setTypeId: function(id) {
            this.set({typeId: id});
        }
    });

    return Tile;
});