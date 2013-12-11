/**
 * Created by rkh on 2013-12-10.
 */
define(['backbone'],
    function(Backbone) {
        var BaseView = Backbone.View.extend({

            close: function(list) {
                list.forEach(function(view) {
                    view.close();
                });

                this.remove();
                this.unbind();
                this.stopListening();
            }
        });

        return BaseView;
});