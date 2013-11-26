/**
 * Created by rkh on 2013-11-25.
 */
define(['backbone', 'handlebars'],
    function(Backbone, Handlebars) {

    var MapView = Backbone.View.extend({
        id: 'map-wrapper',

        template: Handlebars.compile($("#map-template").html()),
        mapwidth: 0,
        mapheight: 0,

        initialize: function(map) {
            this.map = map;
            this.mapwidth = map.getCalculatedWidth();
            this.mapheight = map.getCalculatedHeight();
        },

        events: {
            'mouseover': 'hoverMap'
        },

        hoverMap: function(e) {
            console.log(this)
            var offsetx = $('#map').offset().left;
            var offsety = $('#map').offset().top;
            var tx = Math.floor((e.pageX - offsetx) / this.map.tilesize);
            var ty = Math.floor((e.pageY - offsety) / this.map.tilesize);
            $('#map .selector').css('top', ty * this.map.tilesize).css('left', tx * this.map.tilesize);
        },

        render: function() {
            this.$el.html(this.template(this));
            return this;
        }
    });

    return MapView;
});