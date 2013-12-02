/**
 * Created by rkh on 2013-11-25.
 */
define(['backbone', 'handlebars'],
    function(Backbone, Handlebars) {

    var MapView = Backbone.View.extend({
        id: 'map-wrapper',

        template: Handlebars.compile($("#map-template").html()),

        mapwidth: 0,
        mapheight: 0,
        offsetx: 0,
        offsety: 0,
        mx: 0,
        my: 0,
        mdown: false,
        trigger: null,
        rotation: 0,

        initialize: function(opts) {
            this.map = opts.map;
            this.mapwidth = opts.map.getCalculatedWidth();
            this.mapheight = opts.map.getCalculatedHeight();
            this.editor = opts;
        },

        events: {
            'mousemove #map': 'hoverMap',
            'mousedown #map': 'mousedown',
            'mouseup': 'mouseup',
            'contextmenu #map': 'contextmenu'
        },

        //Remove contextmenu
        contextmenu: function(e) {
            e.preventDefault();
        },

        //Calculate map-x/map-y
        calculatePosition: function(e) {
            offsetx = $('#map').offset().left;
            offsety = $('#map').offset().top;
            mx = Math.floor((e.pageX - offsetx) / this.map.tilesize);
            my = Math.floor((e.pageY - offsety) / this.map.tilesize);
        },

        //Draws a tile to #Map and puts it into the array in the map-object
        setTile: function() {
            if(!this.mdown) return;
            if(this.editor.currentTile == null) return;
            if(my > this.map.mapsizeY-1 || mx > this.map.mapsizeX-1) return;

            var tile = this.map.tiles[my][mx];

            if (typeof(tile) === 'undefined') {
                var div = $("<div></div>");
                $(div).css({
                    position: 'absolute',
                    top: my * this.map.tilesize,
                    left: mx * this.map.tilesize,
                    width: this.map.tilesize,
                    height: this.map.tilesize,
                    backgroundImage: 'url('+this.editor.url+')',
                    backgroundPosition: this.editor.currentTile[0] + 'px ' + this.editor.currentTile[1] + 'px',
                    transform:'rotate('+ this.rotation +'deg)'
                });
                $("#map div:last").before(div);
                this.map.tiles[my][mx] = div;
            } else {
                $(tile).css({
                    backgroundPosition: this.editor.currentTile[0] + 'px ' + this.editor.currentTile[1] + 'px',
                    transform:'rotate('+ this.rotation +'deg)'
                });
            }
        },

        //Clears the interval and reset mdown variable
        mouseup: function(e) {
            this.mdown = false;
            clearInterval(this.trigger);
        },

        //Takes care of mousedown commands and do the appropriate thing depending on mousebutton
        mousedown: function(e) {
            if(e.button == 0) {
                var that = this;
                this.mdown = true;
                this.trigger = setInterval(function() {that.setTile();}, 10);
            }
            else if(e.button == 1) {
                e.preventDefault();
                this.rotation = this.rotation + 90 > 270 ? 0 : this.rotation + 90;
            }
            else if(e.button == 2) {
                var tile = this.map.tiles[my][mx];

                if (typeof(tile) != 'undefined') {
                    var mapPos = $(tile).css('background-position').split(' ');
                    this.editor.currentTile = [parseInt(mapPos[0]), parseInt(mapPos[1])];
                }
            }
        },

        //Moves the selector over the #Map via CSS
        hoverMap: function(e) {
            this.calculatePosition(e);
            $('#map-wrapper .selector').css('top', my * this.map.tilesize).css('left', mx * this.map.tilesize);

            if(this.editor.currentTile === null) {
                $('#map-wrapper .selector').css({backgroundImage: 'url('+ +')'});
            } else {
                $('#map-wrapper .selector').css({
                    backgroundImage: 'url('+this.editor.url+')',
                    backgroundPosition: this.editor.currentTile[0] + 'px ' + this.editor.currentTile[1] + 'px',
                    opacity: 0.5,
                    transform:'rotate('+ this.rotation +'deg)'
                });
            }
        },

        render: function() {
            this.$el.html(this.template(this));
            return this;
        }
    });

    return MapView;
});