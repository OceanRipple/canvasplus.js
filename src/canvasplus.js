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