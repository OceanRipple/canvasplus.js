;
(function() {
    'use strict';
    var defualtWith = 10;
    var defualtColor = "rgba(0,0,0,1)";
    Canvasplus.prototype.normalBrush = function(brushSize, brushColor) {
        var _this = this;
        if (!brushSize) {
            brushSize = defualtWith;
        }
        if (!brushColor) {
            brushColor = defualtColor;
        }
        var canvas = _this.canvas,
            ctx = _this.context,
            drag = false,
            beginPoint = null,
            endPoint = null;

        function startFunc(e, pos) {
            drag = true;
            beginPoint = pos;
        }

        function moveFunc(e, pos) {
            if (drag) {
                endPoint = pos;
                ctx.save();
                ctx.globalCompositeOperation = "source-over";
                ctx.beginPath();
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.moveTo(beginPoint.x, beginPoint.y);
                ctx.lineTo(endPoint.x, endPoint.y);
                ctx.lineWidth = brushSize;
                ctx.strokeStyle = defualtColor;
                ctx.stroke();
                ctx.restore();
                beginPoint = endPoint;
            }
        }

        function endFunc(e, pos) {
            drag = false;
            beginPoint = null;
            endPoint = null;
        }
        _this.bindEvent("start",startFunc);
        _this.bindEvent("move",moveFunc);
        _this.bindEvent("end",endFunc);
    };


    Canvasplus.prototype.bindEvent = function(type, action) {
        var _this = this
        var mouseType, touchType, pos;
        switch (type) {
            case "start":
                mouseType = "mousedown";
                touchType = "touchstart";
                break;
            case "move":
                mouseType = "mousemove";
                touchType = "touchmove";
                break;
            case "end":
                mouseType = "mouseup";
                touchType = "touchend";
                break;
        }
        _this.canvas.addEventListener(mouseType, function(e) {
            pos = {
                x: e.clientX,
                y: e.clientY
            }
            action(e, _this.posConvert(pos));
        })
        _this.canvas.addEventListener(touchType, function(e) {
            pos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            }
            action(e, _this.posConvert(pos));
        })
    };

    Canvasplus.prototype.posConvert = function(pos) {
        var _this = this;
        var canvas = _this.canvas;
        var bbox = canvas.getBoundingClientRect();
        return {
            x: pos.x - bbox.left * (canvas.width / bbox.width),
            y: pos.y - bbox.top * (canvas.height / bbox.height)
        };
    };
    	


})();