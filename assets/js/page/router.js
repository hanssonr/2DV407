/**
 * Created by rkh on 2013-11-18.
 */
define(['backbone', 'editorview'], function(Backbone, EditorView) {

    var Router = Backbone.Router.extend({

        initialize: function(args) {
            this.el = args.el;
        },

        //set up routingroutines
        routes: {
            "": "index"
        },

        //Show the index view
        index: function() {
            var view = new ToolbarView();
            this.el.append(view.render());
        }
    });

    return Router;
});
