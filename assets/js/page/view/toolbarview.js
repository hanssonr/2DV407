/**
 * Created by rkh on 2013-11-25.
 */
define(['backbone', 'handlebars', 'tilesetview', 'tool', 'text!../templates/toolbarTemplate.html'],
    function(Backbone, Handlebars, TilesetView, TOOL, toolbarTemplate) {

    var ToolbarView = Backbone.View.extend({

        childviews: [],
        id: 'toolbar',
        className: 'unselectable',
        template: Handlebars.compile( toolbarTemplate ),

        buttonOff: 'btn-inverse',
        buttonOn: 'btn-warning',

        events: {
            "click #draw" : "draw",
            "click #eraser": "erase",
            "click #draw": "draw",
            "click #rotate": "rotate",
            "click #fill": "fill"
        },

        /**
         * Setup listeners and creates childview
         */
        initialize: function() {
            this.listenTo(Backbone, "CURRENT_TILE", this.showActiveTile);
            this.listenTo(Backbone, "ROTATION_DEGREES", this.rotateActiveTile);
            this.listenTo(Backbone, "TOOL_CHANGE", this.changeTool);

            this.tileset = new TilesetView();
            this.childviews.push(this.tileset);
        },

        /**
         * Puts active tile in a box (for view only)
         * @param pos
         */
        showActiveTile: function(pos) {
            this.$('#currenttile').css({
                backgroundImage: 'url('+this.url+')',
                backgroundPosition: pos[0] + 'px ' + pos[1] + 'px',
                transform: 'rotate('+ 0 +'deg)'
            });
        },

        /**
         * Rotates the active tile (for view only)
         * @param rotation
         */
        rotateActiveTile: function(rotation) {
            this.$('#currenttile').css({
                transform:'rotate('+ rotation +'deg)'
            });
        },

        /**
         * Updates the toolbar with the current chosen tool
         * @param toolID - Enum (TOOL)
         */
        changeTool: function(toolID) {
            _.each(this.$('button'), function(button) {
                $(button).removeClass(this.buttonOn).addClass(this.buttonOff);
            }, this);

            var button;
            if (toolID === TOOL.ERASE) { button = this.$('#eraser'); }
            else if (toolID === TOOL.DRAW) { button = this.$('#draw'); }
            else if (toolID === TOOL.FILL) { button = this.$('#fill'); }

            $(button).removeClass(this.buttonOff).addClass(this.buttonOn);
        },

        /**
         * Draw tool is selected
         */
        draw: function() {
            Backbone.trigger("TOOL_CHANGE", TOOL.DRAW);
        },

        /**
         * Erase tool is selected
         */
        erase: function() {
            Backbone.trigger("TOOL_CHANGE", TOOL.ERASE);
        },

        /**
         * Fill tool is selected
         */
        fill: function() {
            Backbone.trigger("TOOL_CHANGE", TOOL.FILL);
        },

        /**
         * Rotate tile is clicked
         */
        rotate: function() {
            Backbone.trigger("ROTATE_TILE");
        },

        /**
         * Renders the view and subviews
         * @returns {ToolbarView}
         */
        render: function() {
            this.$el.empty();
            this.$el.append(this.template(this));
            this.delegateEvents();

            //activate first tile in the sheet
            this.showActiveTile([0,0]);

            //set drawtool to active
            Backbone.trigger("TOOL_CHANGE", TOOL.DRAW);

            //append sub-view
            this.$el.append(this.tileset.render().el);
            return this;
        },

        /**
         * Updates the view and its subviews
         * @param map
         */
        update: function(map) {
            this.url = map.url();

            _.each(this.childviews, function(view) {
                view.update(map);
            });
        }
    });

    return ToolbarView;
});