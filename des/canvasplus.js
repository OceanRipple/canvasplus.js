;(function() {
    'use strict';

    function Canvasplus(canvas) {
    	this.canvas = canvas;
    	this.context = canvas.getContext('2d');
    	this.width = canvas.width;
    	this.height = canvas.height;
    }
    
    if (!window.Canvasplus) {
        window.Canvasplus = Canvasplus;
    }
})();
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
/*
	@author:Shadow Cun
	@time: 2015-06-04 17:33:03
	@description: matrix tools
*/
!(function  (cp) {
	Uint8ClampedArray.prototype.reduce = function(cb,start){
		var data = this;
		var re = start;
		var i = 0;
		if(re === "undefined"){
			re = data[0];
			i = 1;
		}
		if(typeof cb == "function"){
			for(i;i<data.length;i++){
				data.hasOwnProperty(i) && (re = cb(re,data[i],i,data));
			}	
		}
		return re;
	}
	Uint8ClampedArray.prototype.map = function(cb,context){
		var arr = new Uint8ClampedArray(this.length);
		if (typeof cb === "function"){
			for(var k = 0,length = this.length;k<length;k++){
				arr[k] = fn.call(context,this[k],k,this)
			}
		}
		return arr;
	}
	/*
		@arguments:
		   image:Object{
				width,
				height,
				data
		   }
	*/ 

	function matrix(imageData) {

		var _width = imageData.width;
		var _height = imageData.height;
		var data = imageData.data;
		var mat = [];

		if(data.constructor.name !== Uint8ClampedArray.name)
			throw "not a imagedata";

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
		for(var i = 0;i < _height;i++){
			var start = i*_width*4;
			mat.push(data.subarray(start,start+_width*4));
		}
		return {
			width:_width,
			height:_height,
			data:mat
		}
	}
	function dotProduct(v1,v2) {
		//  two vector dot product
		if(v1.length !== v2.length) throw "error dot droduct";
		var v = v1.reduce(function(prev,curr,ind,arr){
				return Number(prev)+Number(curr*v2[ind]);
			},0);
		return v
	}
	function mxv(m,v){
		var t = m.map(function(item){
			return dotProduct(item,v);
		})
		return t ; 
	}
	function trans(m){
		var arr = [];
		for(var x = 0; x < m.width*4; x= x+4 ){
			var temp = [];
			for(var y = 0;y < m.height;y++){
				temp.push(m.data[y][x]);
				temp.push(m.data[y][x+1]);
				temp.push(m.data[y][x+2]);
				temp.push(m.data[y][x+3]);
			}
			arr.push(temp);
		}
		return {
			data:arr,
			width:m.height,
			height:m.width	
		}
	}
	function flat(m){
		// the reverse method of matrix -> imagedata
		var d = m.data;
		var w = m.width;
		var h = m.height;
		var ff = new Uint8ClampedArray(w*h*4);
		for(var x = 0; x < h; x++ ){
			for(var y = 0; y < w*4 ; y++){
				var idx = x*w*4 + y;
				ff[idx] = d[x][y];
			}
		}
		return new ImageData(ff,w,h);
	}
	function mxm(m1,m2){ 
		//[todo] http://zh.wikipedia.org/zh/%E6%96%BD%E7%89%B9%E6%8B%89%E6%A3%AE%E6%BC%94%E7%AE%97%E6%B3%95
		m2 = trans(m2);

		//暴力解法
		mm = [];
		for(var i = 0; i < m1.height; i++){//vector
			var line = [];
			for(var j = 0;j < m2.height;j++){
				line.push(dotProduct(m1.data[i],m2.data[j]))
			}
			mm.push(line);
		}
		return {
			data:mm,
			width:m2.height,
			height:m1.height
		}
	}
	// 逆时针旋转90度
	function rotate90(imagedata){
		return flat(trans(matrix(imagedata)))
	}
	cp.prototype.matrix = matrix;
	cp.prototype.mxm = mxm;
	cp.prototype.flat = flat;
	cp.prototype.trans = trans;
	cp.prototype.rotate90 = rotate90;
})(Canvasplus)