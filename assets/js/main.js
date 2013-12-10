/**
 * Created by rkh on 2013-11-18.
 */
//require config
require.config({
    baseUrl: 'assets/js/',
    paths: {
        text: 'lib/text',
        jquery: 'lib/jquery/jquery-2.0.3',
        jquerymousewheel: 'lib/jquery/jquery.mousewheel',
        purebackbone: 'lib/backbone/purebackbone',
        backbone_LS: 'lib/backbone/backbone.localStorage',
        backbone: 'lib/backbone/backbone',
        underscore: 'lib/underscore',
        bootstrap: 'lib/bootstrap',
        handlebars: 'lib/handlebars-v1.1.2',
        toolbarview: 'page/view/toolbarview',
        savemapview: 'page/view/savemapview',
        mapview: 'page/view/mapview',
        mapmodel: 'page/model/map',
        tilemodel: 'page/model/tile',
        tilesetview: 'page/view/tilesetview',
        jscrollpane: 'lib/jquery/jquery.jscrollpane',
        navigationview: 'page/view/navigationview',
        createmapview: 'page/view/createmapview'
    },

    //config non-amd scripts
    shim: {
        underscore: { exports: "_" },
        purebackbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        backbone_LS: ["purebackbone", "underscore"],
        handlebars: {
            exports: 'Handlebars'
        },
        jquerymousewheel: {
            deps: ["jquery"]
        },
        jscrollpane: {
            deps: ["jquery"]
        }
    }
});

require(['editor', 'jquery'], function(Editor, $) {
    var editorView = new Editor();
    $("body").append(editorView.el);
});