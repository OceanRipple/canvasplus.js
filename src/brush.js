(function(cp) {
    'use strict';
    var defualtWith = 10;
    var defualtColor = "rgba(0,0,0,1)";
    cp.prototype.normalBrush = function(brushSize, brushColor) {
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
            beginPoint = null;

        function startFunc(e, pos) {
            drag = true;
            beginPoint = pos;
        }

        function moveFunc(e, pos) {
            if (drag) {
                ctx.save();
                ctx.globalCompositeOperation = "source-over";
                ctx.beginPath();
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.moveTo(beginPoint.x, beginPoint.y);
                ctx.lineTo(pos.x, pos.y);
                ctx.lineWidth = brushSize;
                ctx.strokeStyle = defualtColor;
                ctx.stroke();
                ctx.restore();
                beginPoint = pos;
            }
        }

        function endFunc(e, pos) {
            drag = false;
            beginPoint = null;
        }
        _this.bindEvent("start", startFunc);
        _this.bindEvent("move", moveFunc);
        _this.bindEvent("end", endFunc);
    };
    cp.prototype.penciltest = function(beginPoint, endPoint) {
        console.log(beginPoint);
        console.log(endPoint);
        var _this = this,
            ctx = _this.context,
            pos = endPoint,
            brushSize = defualtWith,
            r = brushSize / 2,
            disx = pos.x - beginPoint.x,
            disy = pos.y - beginPoint.y,
            dis = Math.sqrt(disx * disx + disy * disy),
            absx = Math.abs(disx),
            absy = Math.abs(disy),
            tan = disx / dis,
            ctan = disy / dis;
        for (var i = 0; i < dis; i++) {
            //找到目标中点
            var midPoint = {
                x: beginPoint.x + i * tan,
                y: beginPoint.y + i * ctan
            };
            for (var j = -r; j <= r; j++) {
                var targetPoint = {
                    x: midPoint.x - j * ctan,
                    y: midPoint.y + j * tan
                };
                //找到渲染点，开始渲染随机灰度色
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(targetPoint.x, targetPoint.y);
                ctx.lineTo(targetPoint.x + 1, targetPoint.y);
                ctx.lineTo(targetPoint.x + 1, targetPoint.y + 1);
                ctx.lineTo(targetPoint.x, targetPoint.y + 1);
                ctx.closePath();
                var randoma = Math.floor(Math.random() * 100) / 100;
                ctx.fillStyle = "rgba(0,0,0,0.8)";
                ctx.fill();
                ctx.restore();

            }
        }
    };

    cp.prototype.pencil = function(brushSize) {
        var _this = this;
        if (!brushSize) {
            brushSize = defualtWith;
        }
        var canvas = _this.canvas,
            ctx = _this.context,
            drag = false,
            beginPoint = null;

        function startFunc(e, pos) {
            drag = true;
            beginPoint = {
                x: Math.floor(pos.x),
                y: Math.floor(pos.y)
            };
        }

        function moveFunc(e, pos) {
            pos = {
                x: Math.floor(pos.x),
                y: Math.floor(pos.y)
            }
            if (drag) {
                var r = brushSize / 2,
                    disx = pos.x - beginPoint.x,
                    disy = pos.y - beginPoint.y,
                    dis = Math.sqrt(disx * disx + disy * disy),
                    absx = Math.abs(disx),
                    absy = Math.abs(disy),
                    tan = disx / dis,
                    ctan = disy / dis;
                for (var i = 0; i < dis; i++) {
                    //找到目标中点
                    var midPoint = {
                        x: beginPoint.x + i * tan,
                        y: beginPoint.y + i * ctan
                    };
                    for (var j = -r; j <= r; j++) {
                        var targetPoint = {
                            x: midPoint.x - j * ctan,
                            y: midPoint.y + j * tan
                        };
                        //找到渲染点，开始渲染随机灰度色
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(targetPoint.x, targetPoint.y);
                        ctx.lineTo(targetPoint.x + 1, targetPoint.y);
                        ctx.lineTo(targetPoint.x + 1, targetPoint.y + 1);
                        ctx.lineTo(targetPoint.x, targetPoint.y + 1);
                        ctx.closePath();
                        var randoma = Math.floor(Math.random() * 100) / 100;

                        //需要正太分布模型
                        ctx.fillStyle = "rgba(0,0,0,{@randoma})".replace(/{@randoma}/, randoma);
                        ctx.fill();
                        ctx.restore();

                    }

                }

               
                beginPoint = pos;
            }
        }

        function endFunc(e, pos) {
            drag = false;
            beginPoint = null;
        }
        _this.bindEvent("start", startFunc);
        _this.bindEvent("move", moveFunc);
        _this.bindEvent("end", endFunc);
    };


    cp.prototype.bindEvent = function(type, action) {
        var _this = this;
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
            };
            action(e, _this.posConvert(pos));
        });
        _this.canvas.addEventListener(touchType, function(e) {
            pos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            action(e, _this.posConvert(pos));
        });
    };

    cp.prototype.posConvert = function(pos) {
        var _this = this;
        var canvas = _this.canvas;
        var bbox = canvas.getBoundingClientRect();
        return {
            x: pos.x - bbox.left * (canvas.width / bbox.width),
            y: pos.y - bbox.top * (canvas.height / bbox.height)
        };
    };



})(Canvasplus);