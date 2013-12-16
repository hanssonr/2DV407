/**
 * Created by rkh on 2013-11-26.
 */
define(['backbone', 'handlebars', 'text!../templates/tilesetTemplate.html'],
    function(Backbone, Handlebars, tilesetTemplate) {

    var TilesetView = Backbone.View.extend({
        id: 'tileset-wrapper',
        template: Handlebars.compile( tilesetTemplate ),

        //tile X, tile Y
        tx: 0,
        ty: 0,
        offsetx: 0,
        offsety: 0,

        //get url and tilesize from the toolbarview
        initialize: function(opts) {
            this.url = opts.url;
            this.tilesize = opts.tilesize;
        },

        events: {
            'mousemove #tileset': 'hoverTileset',
            'click .selector': 'setActiveTile'
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template(this));
            this.delegateEvents();
            return this;
        },

        //trigger current tile event
        setActiveTile: function(e) {
            var x = -tx * this.tilesize;
            var y = -ty * this.tilesize;
            Backbone.trigger("currentTile", [x, y]);
        },

        //moves the selector to the current tile hoovered
        hoverTileset: function(e) {
            offsetx = this.$('#tileset').offset().left;
            offsety = this.$('#tileset').offset().top;
            tx = Math.floor((e.pageX - offsetx) / this.tilesize);
            ty = Math.floor((e.pageY - offsety) / this.tilesize);
            $('#toolbar .selector').css('top', ty * this.tilesize).css('left', tx * this.tilesize);
        },

        update: function(opts) {
            this.url = opts.url;
            this.tilesize = opts.tilesize;
        }
    });

    return TilesetView;
});