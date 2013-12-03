/**
 * Created by rkh on 2013-11-26.
 */
define(['backbone', 'handlebars'],
    function(Backbone, Handlebars) {

    var TilesetView = Backbone.View.extend({
        id: 'tileset-wrapper',
        template: Handlebars.compile($("#tileset-template").html()),

        //tile X, tile Y
        tx: 0,
        ty: 0,
        offsetx: 0,
        offsety: 0,

        //get url and tilesize from the toolbarview
        initialize: function(opts) {
            this.el = this.$el;
            this.url = opts.url;
            this.tilesize = opts.tilesize;
            this.editor = opts;
        },

        events: {
            'mousemove #tileset': 'hoverTileset',
            'click .selector': 'setActiveTile'
        },

        render: function() {
            this.$el.html(this.template(this));
            return this;
        },

        //show active tile as well as set active tile in editor
        setActiveTile: function(e) {
            var x = -tx * this.tilesize;
            var y = -ty * this.tilesize;
            $('#tools').css({
                backgroundImage: 'url('+this.url+')',
                backgroundPosition: x + 'px ' + y + 'px',
            });
            this.editor.currentTile = [x, y];
        },

        //moves the selector to the current tile hoovered
        hoverTileset: function(e) {
            offsetx = $('#tileset').offset().left;
            offsety = $('#tileset').offset().top;
            tx = Math.floor((e.pageX - offsetx) / this.tilesize);
            ty = Math.floor((e.pageY - offsety) / this.tilesize);
            $('#toolbar .selector').css('top', ty * this.tilesize).css('left', tx * this.tilesize);
        }
    });

    return TilesetView;
});