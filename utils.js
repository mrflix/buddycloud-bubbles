/* ###

redraw function to make sure that transitions are triggered

### */
!function(document){

    // (C) WebReflection (As It Is) - Mit Style

    // we all love function declarations
    function redraw() {

        // clientHeight returns 0 if not present in the DOM
        // e.g. document.removeChild(document.documentElement);
        // also some crazy guy may swap runtime the whole HTML element
        // this is why the documentElement should be always discovered
        // and if present, it should be a node of the document
        // In all these cases the returned value is true
        // otherwise what is there cannot really be considered as painted

        return !!(document.documentElement || 0).clientHeight;
    }

    // ideally an Object.defineProperty
    // unfortunately some engine will complain
    // if used against DOM objects
    document.redraw = redraw;

}(document);

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var isTouchDevice = 'ontouchstart' in document.documentElement ? true : false;

function normalizedX(event){
  return isTouchDevice ? event.touches[0].pageX : event.pageX;
}

function normalizedY(event){
  return isTouchDevice ? event.touches[0].pageY : event.pageY;
}