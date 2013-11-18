/**
 * Created by rkh on 2013-11-18.
 */
define(['backbone', 'helloview'], function(Backbone, HelloView) {

    var Router = Backbone.Router.extend({

        initialize: function(args) {
            this.el = args.el;
        },

        //set up routingroutines
        routes: {
            "": "index"
        },

        index: function() {
            var view = new HelloView();
            //this.el.empty();
            this.el.append(view.render().el);
        }
    });

    return Router;
});
