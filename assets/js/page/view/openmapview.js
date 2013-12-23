/**
 * Created by rkh on 2013-12-16.
 */

define(['backbone', 'handlebars', 'mapmodel', 'text!../templates/openMapTemplate.html'],
    function(Backbone, Handlebars, Map, openMapTemplate) {

        var OpenMapView = Backbone.View.extend({

            className: "overlay-wrapper",
            template: Handlebars.compile( openMapTemplate ),

            events: {
                "click #openmap-open" : "open",
                "click #openmap-cancel" : "cancel"
            },

            open: function(e) {
                this.$('#form-validator ul').html("");
                e.preventDefault();
                var file = this.$("#fileinput")[0].files[0];
                var reader = new FileReader();

                if (file) {
                    $(reader).load(this.parseReadMap, _.bind(this.parseReadMap, this));
                    reader.readAsText(file);
                } else {
                    this.outputError("no file chosen");
                }
            },

            parseReadMap: function(reader) {
                try {
                    var data = $.parseJSON(reader.target.result);

                    var map = new Map(data);
                    map.addToTileArray(data.tiles);

                    Backbone.trigger("VALIDATE_PICTURE", data.url, _.bind(this.validateMapObject, this, map));
                } catch (e) {
                    this.outputError("File can't be read as a correct Map-json object");
                }
            },

            validateMapObject: function(map, img) {
                if(img !== false) {
                    Backbone.Validation.bind(this, {
                        model: map,

                        invalid: function(view, attr, error) {
                            view.outputError(error);
                        }
                    });

                    if (map.isValid(true)) {
                        Backbone.trigger("MAP_EVENT", map, img);
                    }
                } else {
                    this.outputError("The URL could not be read as a image");
                }
            },

            //Outputs error to the form
            outputError: function(error) {
                this.$('#form-validator ul').append($('<li>'+error+'</li>'));
                this.$('#form-validator').removeClass("hidden");
            },

            //removes overlay
            cancel: function(e) {
                e.preventDefault();
                this.$el.remove();
            },

            render: function() {
                this.$el.html(this.template(this));
                return this;
            }

        });

        return OpenMapView;
});