/**
 * Created by rkh on 2013-11-19.
 */
//init the application
define(['jquery', 'backbone', 'router'], function($, Backbone, Router) {
    return {
        initialize: function() {
            var main = $('#main');
            var router = new Router({el: main}); //inject the main element
            Backbone.history.start();
        }
    };
});