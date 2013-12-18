/**
 * Created by rkh on 2013-11-25.
 */
define(['backbone', 'handlebars', 'tilesetview', 'text!../templates/toolbarTemplate.html'],
    function(Backbone, Handlebars, TilesetView, toolbarTemplate) {

    var ToolbarView = Backbone.View.extend({

        childviews: [],
        id: 'toolbar',
        template: Handlebars.compile( toolbarTemplate ),

        events: {
            'mousedown': function() {return false;},
            "click #eraser": "erase",
            "click #draw": "draw",
            "click #rotate": "rotate",
            "click #fill": "fill"
        },

        //get url and tilesize from the editor
        initialize: function() {
            this.listenTo(Backbone, "CURRENT_TILE", this.showActiveTile);
            this.listenTo(Backbone, "ROTATION_DEGREES", this.rotateActiveTile);
            this.listenTo(Backbone, "TOOL_CHANGE", this.changeTool);

            this.tileset = new TilesetView();
            this.childviews.push(this.tileset);
        },

        showActiveTile: function(pos) {
            this.$('#currenttile').css({
                backgroundImage: 'url('+this.url+')',
                backgroundPosition: pos[0] + 'px ' + pos[1] + 'px',
                transform: 'rotate('+ 0 +'deg)'
            });
        },

        rotateActiveTile: function(rotation) {
            this.$('#currenttile').css({
                transform:'rotate('+ rotation +'deg)'
            });
        },

        changeTool: function(toolID) {
            if(toolID === 0) {
                this.$('#eraser').removeClass("btn-inverse").addClass("btn-warning");
            } else {
                this.$('#eraser').removeClass("btn-warning").addClass("btn-inverse");
            }
        },

        rotate: function() {
            Backbone.trigger("ROTATE_TILE");
        },

        erase: function() {
            Backbone.trigger("TOOL_CHANGE", 0);
        },

        fill: function() {
            Backbone.trigger("TOOL_CHANGE", 3);
        },

        render: function() {
            this.$el.empty();
            this.$el.append(this.template(this));
            this.delegateEvents();

            //activate first tile in the sheet
            this.showActiveTile([0,0]);

            //append sub-view
            this.$el.append(this.tileset.render().el);
            return this;
        },

        update: function(opts) {
            this.url = opts.url;

            _.each(this.childviews, function(view) {
                view.update(opts);
            });
        }
    });

    return ToolbarView;
});