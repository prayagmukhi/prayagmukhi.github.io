var peBg = (function(){

  "use strict"

  // shim layer with setTimeout fallback
  // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){ window.setTimeout(callback, 1000 / 60); };
  })();


  var bg,
      blend, 
      bgcolor, 
      bgop;


  var initialize = function (options, cb) {

    var config = {
      elems: '.section-background',
      blend: 'normal',
      bgColor: '',
      bgSrc: '',
      bgOpacity: 1,
      parallax: false,
      factor: 0.55,
      fixed: false,
      mobile: true,
      extraHeight: false
    };

    for(var prop in options) {
      if(options.hasOwnProperty(prop)){
        config[prop] = options[prop];
      }
    }

    bg = config['elems'].constructor === Array ? config['elems'].map(function(e){ return document.querySelector(e)}) : document.querySelectorAll(config.elems);

    for (var i = 0; i < bg.length; i++) {

      (function (i) {

        if(bg[i] !== null){

          if(bg[i].dataset.bgBlend || config.blend) {
            blend = bg[i].dataset.bgBlend ? bg[i].dataset.bgBlend : config.blend
          }
          if(bg[i].dataset.bgColor || config.bgColor) {
            bgcolor = bg[i].dataset.bgColor ? bg[i].dataset.bgColor : config.bgColor;
          }
          if(bg[i].dataset.bgOpacity || config.bgOpacity) {
            bgop = bg[i].dataset.bgOpacity ? bg[i].dataset.bgOpacity : config.bgOpacity;
          }

          if(bg[i].dataset.bgSrc || config.bgSrc){

            var bgs = bg[i].dataset.bgSrc ? bg[i].dataset.bgSrc : config.bgSrc;

              if(config.extraHeight) { bg[i].classList.add(config.extraHeight); }
              if(config.fixed) { bg[i].classList.add('pe-fixed'); }

              if(bg[i].classList.contains('pe-parallax') || config.parallax) {
                // If parallax



                if( (!config.mobile) && (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ){
                  // If mobile: false 
                  bg[i].style.backgroundImage = "url(" + bgs + ")";

                  if(blend) {
                    bg[i].style.backgroundColor = bgcolor;
                    bg[i].style.webkitBackgroundBlendMode = blend;
                    bg[i].style.backgroundBlendMode = blend;
                  }
                
                } else {

                  if(!bg[i].classList.contains('pe-parallax')) { 
                    bg[i].classList.add('pe-parallax'); 
                  }
                  
                  var pElem;

                  if(bg[i].querySelector('.prlx') !== null){
                    // exist 
                    pElem = document.querySelector('.prlx');
                  } else {
                    // new
                    pElem = document.createElement('div');
                    pElem.className = 'prlx';
                    bg[i].insertBefore(pElem, bg[i].firstChild);
                  }
                  
                  
                  // pElem.style.backgroundImage = "url(" + bgs + ")";
                  var img = new Image();
                  img.onload = function() {
                      // img loaded
                      pElem.style.backgroundImage = "url(" + bgs + ")";
                      if(typeof cb == "function" ) {
                        cb();
                      }
                  };
                  img.src = bgs;

                  
                  if(blend) {
                    pElem.style.backgroundColor = bgcolor;
                    pElem.style.webkitBackgroundBlendMode = blend;
                    pElem.style.backgroundBlendMode = blend;
                    pElem.style.opacity = bgop;
                  }

                }


              } else {
                // Not parallax

                if(bg[i].querySelector('.prlx') !== null){
                  bg[i].removeChild(bg[i].querySelector('.prlx'));
                }

                // bg[i].style.backgroundImage = "url(" + bgs + ")";
                var img = new Image();
                img.onload = function() {
                    // img loaded
                    bg[i].style.backgroundImage = "url(" + bgs + ")";
                    if(typeof cb == "function" ) {
                      cb();
                    }
                };
                img.src = bgs;                

                if(blend) {
                  bg[i].style.backgroundColor = bgcolor;
                  bg[i].style.webkitBackgroundBlendMode = blend;
                  bg[i].style.backgroundBlendMode = blend;
                }

              }  // if/else parallax

            } // check if has data.bgSrc

          } // if !== null

        })(i); // loop closure

      } // for loop
      

    var latestKnownScrollY = 0,
        ticking = false;

    function onScroll() {
      latestKnownScrollY = window.scrollY();
      requestTick();
    }

    function requestTick() {
      if(!ticking) {
        requestAnimFrame(update);
      }
      ticking = true;
    }

    function update() {
      ticking = false;

      var currentScrollY = latestKnownScrollY;
      // var st = scrollY();
      var st = currentScrollY;
      var parallax = document.querySelectorAll('.prlx');

      if(parallax.length > 0) {
        var rect = parallax[0].getBoundingClientRect();
        var pos = document.body.scrollTop;
        var translateY = st * 0.5,
            translateX = 0,
            scale = 1, 
            opacity = 1,
            viewed = st + getViewportH();

        for (var i = 0; i < parallax.length; i++) {
          if(inViewport(parallax[i].parentNode)){
            var factor = config.factor;
            var variable = (getViewportH() - parallax[i].offsetHeight) * factor;
            translateY = (viewed - getOffset(parallax[i]).top - parallax[i].offsetHeight)* factor - variable;
            parallax[i].style.WebkitTransform = 'translate3d(' + translateX +'px, ' +   translateY + 'px, 0) scale('+ scale +')';
            parallax[i].style.transform = 'translate3d(' + translateX +'px, ' +   translateY + 'px, 0) scale('+ scale +')';
          }
        } // for
      
      } // if
    } // update()

    window.addEventListener( 'scroll', onScroll);

    onScroll();

  } // Init()

  function reset(){
    for (var i = 0; i < bg.length; i++) {
      bg[i].classList.remove('pe-parallax', 'pe-fixed', 'x2', 'x3', 'x4');
      bg[i].style.backgroundImage = "";
      bg[i].style.backgroundColor = "";
    }
  }

  return {
    init: initialize,
    reset: reset
  };

});