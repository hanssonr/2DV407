/**
 * Created by rkh on 2013-11-18.
 */
//require config
require.config({
    baseUrl: 'assets/js/',
    paths: {
        text: 'lib/text',
        editor: 'page/view/editor',
        jquery: 'lib/jquery/jquery-2.0.3',
        jquerymousewheel: 'lib/jquery/jquery.mousewheel',
        purebackbone: 'lib/backbone/purebackbone',
        backbone_validation: 'lib/backbone/backbone-validation',
        backbone: 'lib/backbone/backbone',
        underscore: 'lib/underscore',
        bootstrap: 'lib/bootstrap',
        handlebars: 'lib/handlebars-v1.1.2',
        toolbarview: 'page/view/toolbarview',
        openmapview: 'page/view/openmapview',
        mapview: 'page/view/mapview',
        mapmodel: 'page/model/map',
        tilemodel: 'page/model/tile',
        tilesetview: 'page/view/tilesetview',
        jscrollpane: 'lib/jquery/jquery.jscrollpane',
        navigationview: 'page/view/navigationview',
        createmapview: 'page/view/createmapview',
        tool: 'page/model/tool'
    },

    //config non-amd scripts
    shim: {
        underscore: { exports: "_" },
        purebackbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        backbone_validation: ["purebackbone", "underscore"],
        handlebars: {
            exports: 'Handlebars'
        },
        jquerymousewheel: {
            deps: ["jquery"]
        },
        jscrollpane: {
            deps: ["jquery", "jquerymousewheel"]
        }
    }
});

define(['editor'], function(Editor) {
    var editorView = new Editor();
    $("body").append(editorView.el);
});