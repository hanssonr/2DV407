/**
 * Created by rkh on 2013-11-20.
 */

function Canvas(con) {
    this.context = con;

    this.drawLine = function(x, y, x1, y1, lw, color) {
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x1,y1);
        context.lineWidth = lw;
        context.strokeStyle = color;
        context.stroke();
    }

    this.getContext = function() {
        return this.context;
    }

    this.setLineCap = function(cap) {
        context.lineCap = cap;
    }

    this.drawImage = function(src, x, y, destrect) {
        var img = new Image();
        img.src = src;

        $(img).load(function() {
            context.drawImage(img, x, y, destrect.x1, destrect.y1, destrect.x, destrect.y, destrect.w, destrect.h);
        });
    }
};

function Tile(img) {

};

function Rectangle(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.x1 = this.x + w;
    this.y1 = this.y + h;
    this.w = w;
    this.h = h;
};

$(document).ready(function() {
    var craw = $("#mycanvas");
    var cdata = $("#mycanvas")[0];
    var canvas = new Canvas(cdata.getContext('2d'));
    var maincdata = $('#maincanvas');

    var mc = document.createElement("canvas");
    var ctx = mc.getContext('2d');
    var img = new Image();
    img.src = "assets/img/test.png";
    var tiles = [];
    var tilesize = 32;
    var tilesX = 0;
    var tilesY = 0;
    var currentTile = null;

    img.onload = function() {
        console.log(cdata.height);
        cdata.height = img.height;

        console.log(cdata.height);

        $(".bar").draggable({
            containment: "parent"
        });

        $(".bar").css("height", 300-(cdata.height-300));

        $(".bar").on("drag", function(event, ui) {
            var ctop = (-ui.position.top);
            cdata.style.top = ctop + "px";
        });

        console.log("loaded");
        mc.width = img.width;
        mc.height = img.height;
        ctx.drawImage(img, 0, 0);
        tilesX = img.width / tilesize;
        tilesY = img.height / tilesize;

        for (var y = 0; y < tilesY; y++) {
            for (var x = 0; x < tilesX; x++) {
                var imgData = ctx.getImageData(x * tilesize, y * tilesize, tilesize, tilesize);
                tiles.push(imgData);
            }
        }

        var i = 0, x = 0, y = 0;

        tiles.forEach(function(tile) {
            canvas.getContext().putImageData(tile, x, y);

            x += tilesize;

            if (x >= mc.width) {
                x = 0;
                y+=tilesize;
            }
        });

    }

    var mx, my, mousedown = false;
    var trigger;

    $(maincdata).mousemove(function(e) {
        mx = Math.floor((e.pageX - parseInt($(this).parent().css('left'))) / tilesize);
        my = Math.floor((e.pageY - parseInt($(this).parent().css('top'))) / tilesize);
        $("#mapselector").css("top", my * tilesize).css("left", mx * tilesize);
    });

    $("#mapselector").mousedown(function(e) {
        mousedown = true;
        trigger = setInterval(function() {draw();}, 50);
    }).mouseup(function() {
        mousedown = false;
        clearInterval(trigger);
    });

    var draw = function() {
        if (!mousedown) return;
        if (currentTile !== null) {
            maincdata[0].getContext('2d').putImageData(tiles[currentTile], mx * tilesize, my * tilesize);
        }
    }



    $("#tileselector").click(function(e) {
        var offset = parseInt($('.bar').css('top'));
        var x = Math.floor((e.pageX - craw[0].parentNode.offsetLeft) / tilesize);
        var y = Math.floor((((e.pageY + offset) - craw[0].parentNode.offsetTop)) / tilesize);
        currentTile = y * tilesX + x;
    });

    $(cdata).mousemove(function(e) {
        var offset = parseInt($('.bar').css('top'));
        var x = Math.floor((e.pageX - craw[0].parentNode.offsetLeft) / tilesize);
        var y = Math.floor(e.pageY / tilesize);
        $("#tileselector").css("top", (y * tilesize) - (offset % tilesize)).css("left", x * tilesize);
    });
});