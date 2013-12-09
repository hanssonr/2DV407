/**
 * Created by rkh on 2013-11-25.
 */
define(['backbone', 'handlebars', 'tilesetview'],
    function(Backbone, Handlebars, TilesetView) {

    var ToolbarView = Backbone.View.extend({
        id: 'toolbar',
        template: Handlebars.compile($("#toolbar-template").html()),

        //get url and tilesize from the editor
        initialize: function(opts) {
            this.tileset = new TilesetView(opts);
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