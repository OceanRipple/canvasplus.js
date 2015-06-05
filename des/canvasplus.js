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
	/*
		@arguments:
		   image:Object{
				width,
				height,
				data
		   }
	*/ 
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
	cp.prototype.matrixCreater = function(imageData) {

		var _this = this;
		var _width = imageData.width;
		var _height = imageData.height;
		var data = imageData.data;
		var matrix = [];

		if(data.constructor.name !== Uint8ClampedArray.name)
			throw "not a imagedata";

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
		for(var i = 0;i < _this.height;i++){
			var start = i*4*_width;
			matrix.push(data.subarray(start,start+4*_width));
		}
		_this.matrixStack = [];
		_this.matrix = matrix;
		_this.imageData = imageData;
		return _this;
	};
	cp.prototype.dotProduct = function(v1,v2) {
		//  two vectpr dot product
		var _this = this;
		if(v1.length !== v2.length) throw "error dot droduct";
		var v = v1.reduce(function(prev,curr,ind,arr){
				return Number(prev)+Number(curr*v2[ind]);
			},0);
		return v
	};
	cp.prototype.mxv = function(v){
		var _this = this;
		var t = _this.matrix.map(function(item){
			return _this.dotProduct(item,v);
		})
		_this.matrixStack.push(t);
		return t ; 
	}
	function accumulaten(m,start){
		var len = m[0].length;
		var arr = [];
		for(var x = 0; x < len; x++){
			var temp = 0;
			for(var y = 0;y<len;y++){
				temp += y;
			}
			arr.push(temp);
		}
		return arr;
	}
	cp.prototype.mxm = function(){
		// http://www.cs.berkeley.edu/~oholtz/Talks/mit.pdf
		var _this = this;
		
	}

})(Canvasplus)