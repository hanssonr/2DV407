/**
 * Created by rkh on 2013-12-03.
 */
define(['backbone', 'handlebars'],
    function(Backbone, Handlebars) {

        var CreateMapView = Backbone.View.extend({

            className: "overlay-wrapper",
            template: Handlebars.compile($("#createmap-template").html()),

            events: {
                'click #newmap-submit' : 'createMap',
                'click #newmap-cancel' : 'cancelCreation'
            },

            initialize: function(opts) {
                this.editor = opts;
            },

            createMap: function(e) {
                if ($('form')[0].checkValidity()) {
                    e.preventDefault();
                    var data = $('form').serializeArray();
                    this.editor.initialize({
                        url: data[0].value,
                        tilesize: parseInt(data[1].value),
                        mapwidth: parseInt(data[2].value),
                        mapheight: parseInt(data[3].value)
                    });
                }
            },

            cancelCreation: function(e) {
                e.preventDefault();
                $('.overlay-wrapper').remove();
            },

            render: function() {
                this.$el.html(this.template(this));
                return this;
            }
        });

        return CreateMapView;
});