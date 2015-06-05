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

		var _width = imageData.width*4;
		var _height = imageData.height;
		var data = imageData.data;
		var mat = [];

		if(data.constructor.name !== Uint8ClampedArray.name)
			throw "not a imagedata";

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
		for(var i = 0;i < _height;i++){
			var start = i*_width;
			mat.push(data.subarray(start,start+_width));
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
		for(var x = 0; x < m.width; x++){
			var temp = new Uint8ClampedArray(m.height);
			for(var y = 0;y < m.height;y++){
				temp[y] = m.data[y][x];
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
		var ff = new Uint8ClampedArray(w*h);
		for(var x = 0; x < h; x++ ){
			for(var y = 0; y < w ; y++){
				var idx = x*h + y;
				ff[idx] = d[x][y];
			}
		}
		return new ImageData(ff,w/4,h);
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
	cp.prototype.matrix = matrix;
	cp.prototype.mxm = mxm;
	cp.prototype.flat = flat;
	cp.prototype.trans = trans;
})(Canvasplus)