/**
 * Created by rkh on 2013-11-18.
 */
define(['backbone', 'handlebars'], function(Backbone, Handlebars) {

    var HelloView = Backbone.View.extend({

        tiles: [1,2,3,4,5,6],
        phrase: "Hello World!",
        template: Handlebars.compile($("#tile-template").html()),

        initialize: function(tile) {
            this.phrase = tile.get('position');
        },

        events: {
            'click': "welcome"
        },

        render: function() {
            this.$el.html(this.template(this));
            return this;
        },

        welcome: function() {
            console.log("WELCOME");
        }
    });

    return HelloView;
});
