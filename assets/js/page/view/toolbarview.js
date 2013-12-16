/**
 * Created by rkh on 2013-11-25.
 */
define(['backbone', 'handlebars', 'baseview', 'tilesetview', 'text!../templates/toolbarTemplate.html'],
    function(Backbone, Handlebars, BaseView, TilesetView, toolbarTemplate) {

    var ToolbarView = Backbone.View.extend({

        childviews: [],
        id: 'toolbar',
        template: Handlebars.compile( toolbarTemplate ),

        events: {
            "click #eraser": "erase",
            "click #draw": "draw",
            "click #rotate": "rotate"
        },

        rotate: function() {
            Backbone.trigger("rotateTile");
        },

        erase: function() {
            Backbone.trigger("toolChange", 0);
        },

        draw: function() {
            Backbone.trigger("toolChange", 1);
        },

        //get url and tilesize from the editor
        initialize: function(opts) {
            this.listenTo(Backbone, "currentTile", this.showActiveTile);
            this.url = opts.map.url;
            this.tileset = new TilesetView(opts);
            this.childviews.push(this.tileset);
        },

        showActiveTile: function(pos) {
            this.$('#currenttile').css({
                backgroundImage: 'url('+this.url+')',
                backgroundPosition: pos[0] + 'px ' + pos[1] + 'px'
            });
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template(this));
            this.delegateEvents();

            //append sub-view
            this.$el.append(this.tileset.render().el);
            return this;
        },

        update: function(opts) {
            this.url = opts.url;

            this.childviews.forEach(function(view) {
                view.update(opts);
            });
        }
    });

    return ToolbarView;
});