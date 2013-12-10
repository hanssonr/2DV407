/**
 * Created by rkh on 2013-12-10.
 */
define(['backbone', 'handlebars', 'text!../templates/saveMapTemplate.html'],
    function(Backbone, Handlebars, saveMapTemplate) {

        var SaveMapView = Backbone.View.extend({

            className: "overlay-wrapper",
            template: Handlebars.compile( saveMapTemplate ),


            render: function() {
                this.$el.html(this.template(this));
                return this;
            }
        });

        return SaveMapView;
});