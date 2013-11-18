/**
 * Created by rkh on 2013-11-18.
 */
define(['backbone', 'handlebars'], function(Backbone, Handlebars) {

    var HelloView = Backbone.View.extend({

        phrase: "Hello World!",
        template: Handlebars.compile($("#helloworld-template").html()),

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
