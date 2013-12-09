/**
 * Created by rkh on 2013-11-25.
 */
define(['backbone', 'handlebars', 'tilesetview', 'text!../templates/toolbarTemplate.html'],
    function(Backbone, Handlebars, TilesetView, toolbarTemplate) {

    var ToolbarView = Backbone.View.extend({
        id: 'toolbar',
        template: Handlebars.compile( toolbarTemplate ),

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