/**
 * Created by rkh on 2013-11-19.
 */
require.config({
    baseUrl: 'assets/js/',
    urlArgs: 'cb=' + Math.random(),  //cache buster
    paths: {
        jquery: 'lib/jquery-2.0.3',
        backbone: 'lib/backbone',
        backbone_LS: 'lib/backbone.localStorage',
        bootstrap: 'lib/bootstrap',
        handlebars: 'lib/handlebars-v1.1.2',
        underscore: 'lib/underscore',
        router: 'page/router',
        tile: 'page/model/tile',
        jasmine: 'lib/jasmine/jasmine',
        jasmine_html: 'lib/jasmine/jasmine-html',
        spec: 'spec/'
    },

    //config non-amd scripts
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        handlebars: {
            exports: 'Handlebars'
        },
        jasmine: {
            exports: 'jasmine'
        },
        jasmine_html: {
            deps: ['jasmine'],
            exports: 'jasmine'
        }
    }
});

require(['underscore', 'jquery', 'jasmine_html'], function(_, $, jasmine) {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    var specs = [];

    specs.push('spec/model/tileSpec');

    $(function() {
       require(specs, function() {
          jasmineEnv.execute();
       });
    });
});