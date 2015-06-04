;(function() {
    'use strict';

    function Canvasplus(canvas) {
    	this.canvas = canvas;
    	this.context = canvas.getContext('2d');
    }
    
    if (!window.Canvasplus) {
        window.Canvasplus = Canvasplus;
    }
})();