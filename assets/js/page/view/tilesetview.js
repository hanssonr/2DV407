/**
 * Created by rkh on 2013-11-26.
 */
define(['backbone', 'handlebars', 'text!../templates/tilesetTemplate.html'],
    function(Backbone, Handlebars, tilesetTemplate) {

    var TilesetView = Backbone.View.extend({

        id: 'tileset-wrapper',
        template: Handlebars.compile( tilesetTemplate ),

        events: {
            'mouseenter #tileset': 'mouseenter',
            'mousemove #tileset': 'hoverTileset',
            'click .selector': 'setActiveTile'
        },

        /**
         * Helper function for focusing tileset
         */
        mouseenter: function() {
            $(this.$el).focus();
        },

        /**
         * Renders the view
         * @returns {TilesetView}
         */
        render: function() {
            this.$el.empty();
            this.$el.append(this.template(this));
            this.delegateEvents();
            return this;
        },

        /**
         * Calculates the position of the choosen tile and
         * sends an event with the information
         * @param e
         */
        setActiveTile: function(e) {
            var x = -tx * this.tilesize;
            var y = -ty * this.tilesize;
            Backbone.trigger("CURRENT_TILE", [x, y]);
        },

        /**
         * Hoovers the tileset and displaying a square
         * above the hovered tile
         * @param e
         */
        hoverTileset: function(e) {
            offsetx = this.$('#tileset').offset().left;
            offsety = this.$('#tileset').offset().top;
            tx = Math.floor((e.pageX - offsetx) / this.tilesize);
            ty = Math.floor((e.pageY - offsety) / this.tilesize);
            this.$('.selector').css({
                top: ty * this.tilesize,
                left: tx * this.tilesize
            });
        },

        /**
         * Updates data
         * @param map - Map (model)
         */
        update: function(map) {
            this.url = map.url();
            this.tilesize = map.tilesize();
        }
    });

    return TilesetView;
});