/**
 * Created by rkh on 2013-11-25.
 */
define(['backbone', 'handlebars', 'tilesetview', 'text!../templates/toolbarTemplate.html'],
    function(Backbone, Handlebars, TilesetView, toolbarTemplate) {

    var ToolbarView = Backbone.View.extend({
        id: 'toolbar',
        template: Handlebars.compile( toolbarTemplate ),

        events: {
            "click #eraser": "erase",
            "click #draw": "draw"
        },

        erase: function() {
            Backbone.trigger("toolChange", 0);
        },

        draw: function() {
            Backbone.trigger("toolChange", 1);
        },

        //get url and tilesize from the editor
        initialize: function(opts) {
            this.url = opts.url;
            this.tileset = new TilesetView(opts);
            this.listenTo(Backbone, "currentTile", this.showActiveTile);
        },

        showActiveTile: function(pos) {
            this.$('#currenttile').css({
                backgroundImage: 'url('+this.url+')',
                backgroundPosition: pos[0] + 'px ' + pos[1] + 'px'
            });
        },

        render: function() {
            this.$el.append(this.template(this));

            //append sub-view
            this.$el.append(this.tileset.render().el);
            return this;
        }
    });

    return ToolbarView;
});