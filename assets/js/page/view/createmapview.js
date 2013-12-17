/**
 * Created by rkh on 2013-12-03.
 */
define(['backbone', 'handlebars', 'text!../templates/createMapTemplate.html'],
    function(Backbone, Handlebars, createMapTemplate) {

        var CreateMapView = Backbone.View.extend({

            className: "overlay-wrapper",
            template: Handlebars.compile( createMapTemplate ),

            events: {
                'click #newmap-submit' : 'validateMapCredentials',
                'click #newmap-cancel' : 'cancelCreation'
            },

            //Validates form input
            validateMapCredentials: (function(e) {
                if (this.$('form')[0].checkValidity()) {
                    e.preventDefault();
                    var data = this.$('form').serializeArray();
                    var that = this;

                    Backbone.trigger("VALIDATE_PICTURE", data[0].value, function(img) {
                        if (img !== false) {
                            Backbone.trigger("MAP_EVENT", {
                                url: data[0].value,
                                tilesize: parseInt(data[1].value),
                                mapwidth: parseInt(data[2].value),
                                mapheight: parseInt(data[3].value)
                            });
                        } else {
                            that.outputError("The URL is not a valid image")
                        }
                    });
                }
            }),

            //Outputs error to the form
            outputError: function(error) {
                this.$('#form-validator ul').html("");
                this.$('#form-validator ul').append($('<li>'+error+'</li>'));
                this.$('#form-validator').removeClass("hidden");
            },

            //removes overlay
            cancelCreation: function(e) {
                e.preventDefault();
                this.$el.remove();
            },

            render: function() {
                this.$el.html(this.template(this));
                return this;
            }
        });

        return CreateMapView;
});