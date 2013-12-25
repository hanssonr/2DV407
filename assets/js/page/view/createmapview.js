/**
 * Created by rkh on 2013-12-03.
 */
define(['backbone', 'handlebars', 'mapmodel', 'text!../templates/createMapTemplate.html'],
    function(Backbone, Handlebars, Map, createMapTemplate) {

        var CreateMapView = Backbone.View.extend({

            className: "overlay-wrapper",
            template: Handlebars.compile( createMapTemplate ),

            events: {
                'click #newmap-submit' : 'validateForm',
                'click #newmap-cancel' : 'cancelCreation'
            },

            /**
             * Checks whether form is validated
             * in that case validate the data
             */
            validateForm: (function(e) {
                this.$('#form-validator ul').html("");

                if (this.$('form')[0].checkValidity()) {
                    e.preventDefault();
                    var data = [];
                    $.each(this.$('form').serializeArray(), function(k, v) {
                        data[k] = v.value;
                    });

                    this.validateData(data);
                }
            }),

            /**
             * Validates input from form
             * @param data - array
             */
            validateData: function(data) {
                Backbone.trigger("VALIDATE_PICTURE", data[0], _.bind(function(img) {
                    if(img !== false) {
                        var map = this.createNewMap(data);

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
                }, this));
            },

            /**
             * Helper function for creating a Map-object
             * @param data - array
             * @returns {mapmodel}
             */
            createNewMap: function(data) {
                var map = new Map({
                    url: data[0],
                    tilesize: parseInt(data[1]),
                    mapwidth: parseInt(data[2]),
                    mapheight: parseInt(data[3])
                });

                return map;
            },

            /**
             * Helper function for outputting errors to the user
             * @param error
             */
            outputError: function(error) {
                this.$('#form-validator ul').append($('<li>'+error+'</li>'));
                this.$('#form-validator').removeClass("hidden");
            },

            /**
             * Removes the overlay
             * @param e
             */
            cancelCreation: function(e) {
                e.preventDefault();
                this.$el.remove();
            },

            /**
             * Renderds view
             * @returns {CreateMapView}
             */
            render: function() {
                this.$el.html(this.template(this));
                return this;
            }
        });

        return CreateMapView;
});