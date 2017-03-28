
var peSlider = (function(){
  
  "use strict"

  var slider, wrapper, slides, slidesList, config, prev, next, sliderPagination, _actual, _total, sliderElements;

  var initialize = function (options) {

    config = {
      slider: '.pe-slider',
      navigation: true,
      pagination: true,
      auto: false,
      delay: 5000,
      hoverPause: false,
      infinite: true,
      hoverNav: false,
      carousel: false,
      overflow: false,
      swipe: false,
      touch: false,
      afterChange: null,
      beforeChange: null
    };

    for(var prop in options) {
      if(options.hasOwnProperty(prop)){
        config[prop] = options[prop];
      }
    }

    // slider = config.slider.nodeType === 1 ? config.slider :  document.querySelector(config.slider)
    // wrapper = slider.parentElement;

    // Just in this case I called 'slider' for convenience on init but here in the script is the 'wrapper'.
    wrapper = config.slider.nodeType === 1 ? config.slider :  document.querySelector(config.slider)
    slider = wrapper.querySelector('.pe-slides');
    
    slides = slider.querySelectorAll('li');
    slidesList = [].slice.call(slides);
    prev = wrapper.querySelector('.pe-slider-prev');
    next = wrapper.querySelector('.pe-slider-next');
    sliderPagination = _pagination(slides);

    sliderElements = {
      slider : slider,
      wrapper : wrapper,
      slides : slides,
      slidesList : slidesList,
      prev : prev,
      next : next,
      sliderPagination : sliderPagination,
      timer: 0,
      infinite: config.infinite,
      carousel: config.carousel,
      afterChange: config.afterChange,
      beforeChange: config.beforeChange
    }

    _initEvents(config,sliderElements);
    
  } // initialize
 
  var _initEvents = function(options, sElems){

    _updatePagination(sElems);

    var _activeSlide = sElems.slider.querySelector('.selected');
    var _n = sElems.slidesList.indexOf(_activeSlide);
    var startX, diff, winW;

    sElems.wrapper.classList.add('pe-slider-wrapper');
    if( options.overflow ){
      sElems.wrapper.classList.add('overflow');
    }

    _total = slides.length;
    _actual = {
      number: _n,
      elem: sElems.slidesList[_n]
    }
    
    if( sElems.carousel ){
      sElems.slider.classList.add('carousel');
      sliderWidth();
      _translation(sElems, _n);
      
      window.addEventListener( 'resize', toActual, false);
      window.addEventListener( 'orientationchange', sliderWidth, false);
      window.addEventListener( 'orientationchange', toActual, false);
      
    }

    if( options.swipe ){
      sElems.slider.classList.add('swipe');
      document.addEventListener( 'mousedown', swipeStartHandler, false );
      document.addEventListener( 'touchstart', swipeStartHandler, false );
      document.addEventListener( 'mouseup', swipeEndHandler, false );
      document.addEventListener( 'touchend', swipeEndHandler, false );
    }

    if( options.touch ){
      document.addEventListener( 'touchstart', swipeStartHandler, false );
      document.addEventListener( 'touchend', swipeEndHandler, false );
    }

    if( !options.navigation ){
      sElems.wrapper.classList.add('no-nav');
    }

    if( !options.pagination ){
      sElems.wrapper.classList.add('no-pag');
    }

    if( options.hoverNav ){
      sElems.wrapper.classList.add('nav-hover');
    }


    function getTranslated() {
      var st = window.getComputedStyle(slider, null);
      var tr = st.getPropertyValue("-webkit-transform") ||
               st.getPropertyValue("-moz-transform") ||
               st.getPropertyValue("-ms-transform") ||
               st.getPropertyValue("-o-transform") ||
               st.getPropertyValue("transform") ||
               "Either no transform set, or browser doesn't do getComputedStyle";
      var values = tr.split('(')[1],
      values = values.split(')')[0],
      values = values.split(',');
      var translateValue = values[4];
      return translateValue;
    }
    
    function moveHandler(e){
      // Detect if event target is an element inside the slider
      if(isDescendant(slider, e.target)){
        var x = e.pageX;
        diff = (startX - x) / winW * 100;
        slider.style.webkitTransform = "translate3d(" + (getTranslated() - diff) + "px, 0px, 0px)";
        slider.style.transform = "translate3d(" + (getTranslated() - diff) + "px, 0px, 0px)";
      }
    }

    function isDescendant(parent, child) {
         var node = child.parentNode;
         while (node != null) {
             if (node == parent) {
                 return true;
             }
             node = node.parentNode;
         }
         return false;
    }
    function swipeStartHandler(e){
      startX = e.pageX;
      winW = window.innerWidth;
      diff = 0;
      this.addEventListener( 'mousemove', moveHandler, false);
      this.addEventListener( 'touchmove', moveHandler, false);
    }

    function swipeEndHandler(e){
      this.removeEventListener( 'mousemove', moveHandler, false);
      this.removeEventListener( 'touchmove', moveHandler, false);
      if(!sElems.carousel){ 
        slider.style.webkitTransform = "translate3d(0px, 0px, 0px)";
        slider.style.transform = "translate3d(0px, 0px, 0px)";
      }
      if ( (diff > -8 && diff < 8) || !diff ) {
        slider.classList.add('anim');
        if(sElems.carousel){ _translation(sElems, _actual.number); }
        slider.addEventListener("transitionend", function(){ slider.classList.remove('anim'); }, false);
        return;
      }
      if (diff <= -8) {
        _prevSlide(null, sElems, sElems.afterChange, sElems.beforeChange);
      }
      if (diff >= 8) {
        _nextSlide(null, sElems, sElems.afterChange, sElems.beforeChange);
      }
    }

    function sliderWidth(){
      var slWidth = 0;
      for (var i = 0; i < sElems.slidesList.length; i++) {
         slWidth = slWidth + outerWidth(sElems.slidesList[i]);
       };
      sElems['slider'].style.width = slWidth + "px";
    }

    function toActual(){
      var aS = sElems.slider.querySelector('.selected');
      var nS = sElems.slidesList.indexOf(aS);
      sliderWidth();
      _translation(sElems, nS);
    }

    function clearTimer(){
      clearInterval(sElems.timer);
    }

    function continueTimer(){
      startTimer(sElems, options.delay);
    }

    if( options.auto ){ 
      startTimer(sElems, options.delay);
      if ( options.hoverPause ) {
        sElems.wrapper.addEventListener('mouseover', clearTimer, false);
        sElems.wrapper.addEventListener('mouseout', continueTimer, false);
      }
    }

    function n(){
      _nextSlide(null, sElems, sElems.afterChange, sElems.beforeChange);
      if( options.auto && !options.hoverPause ){ startTimer(sElems, options.delay); }
    }

    function p(){
      _prevSlide(null, sElems, sElems.afterChange, sElems.beforeChange);
      if( options.auto && !options.hoverPause ){ startTimer(sElems, options.delay); }
    }

    next.addEventListener('click', n, false);
    prev.addEventListener('click', p, false);


    function paginationAction(){
      var selectedDot = this;
      
      if(!hasClass(selectedDot,'selected')){
        var dotList = [].slice.call(this.parentNode.children);
        var selectedPosition = dotList.indexOf(this);
        var activePosition = sElems.slidesList.indexOf(sElems.slider.querySelector('.selected'));
        
        if (activePosition < selectedPosition){
          _nextSlide(selectedPosition, sElems, sElems.afterChange, sElems.beforeChange);
        } else {
          _prevSlide(selectedPosition, sElems, sElems.afterChange, sElems.beforeChange);
        }
        if( options.auto && !options.hoverPause ){ startTimer(sElems, options.delay); }
      }

    } // paginationAction

    for (var i = 0; i < sElems.sliderPagination.length; i++){
      sElems.sliderPagination[i].addEventListener('click', paginationAction, false);
    }


  } // _initEvents



  var _nextSlide = function(s, sElems, afterCB, beforeCB) {

    if(typeof beforeCB == "function") {
      beforeCB();
    }

    var n,
        activeSlide = sElems.slider.querySelector('.selected'),
        activeDot = sElems.wrapper.querySelector('.pe-slider-pag .selected');
    
    if(s === null){
      n = sElems.slidesList.indexOf(activeSlide) + 1;
    } else {
      n = s;
    }
    
    var num = (n == sElems.slidesList.length) ? 0 : n;
    _actual = {
      number: num,
      elem: sElems.slidesList[num]
    }
    
    activeSlide.classList.remove('selected');
    activeDot.classList.remove('selected');
    
    if(n === sElems.slides.length) {
      sElems.slides[0].classList.add('selected');
      sElems.sliderPagination[0].classList.add('selected');
      sElems.slidesList.forEach(function(item, index){
        sElems.slides[index].classList.remove('past');
      });
    } else {
      sElems.slides[n].classList.add('selected');
      sElems.sliderPagination[n].classList.add('selected');
      sElems.slidesList.forEach(function(item, index){
        if(index < n){
          sElems.slides[index].classList.add('past');
        }
      });
    }

    if(!sElems.infinite){
      _updateNavigation(sElems.slides[n], sElems);
    }

    if(sElems.carousel){
      // var num = (n == sElems.slidesList.length) ? 0 : n;
      slider.classList.add('anim');
      _translation(sElems, num);
      slider.addEventListener("transitionend", function(){ slider.classList.remove('anim'); }, false);
    }

    if(typeof afterCB == "function") {
      afterCB();  
    }
    
  
  } // _nextSlide


  var _prevSlide = function(s, sElems, afterCB, beforeCB){

    if(typeof beforeCB == "function") {
      beforeCB();
    }

    var n,
        activeSlide = sElems.slider.querySelector('.selected'),
        activeDot = sElems.wrapper.querySelector('.pe-slider-pag .selected');
    
    if(s === null){
      n = sElems.slidesList.indexOf(activeSlide) - 1;
    } else {
      n = s;
    }
    
    var num = (n < 0) ? sElems.slidesList.length - 1 : n;
    _actual = {
      number: num,
      elem: sElems.slidesList[num]
    }

    activeSlide.classList.remove('selected');
    activeDot.classList.remove('selected');

    if(sElems.infinite) {
      sElems.slidesList.forEach(function(item, index){
        sElems.slides[index].classList.add('past');
      });
    }

    if(n === -1) {
      sElems.slides[sElems.slides.length - 1].classList.add('selected');
      sElems.slides[sElems.slides.length - 1].classList.remove('past');
      sElems.sliderPagination[sElems.slides.length - 1].classList.add('selected');
    } else {
      sElems.slides[n].classList.add('selected');
      sElems.slides[n].classList.remove('past');
      sElems.sliderPagination[n].classList.add('selected');
      sElems.slidesList.forEach(function(item, index){
        if(index > n){
          sElems.slides[index].classList.remove('past');
        }
      });
    }

    if(!sElems.infinite){
      _updateNavigation(sElems.slides[n], sElems);
    }

    if(sElems.carousel){
      slider.classList.add('anim');
      _translation(sElems, num);
      slider.addEventListener("transitionend", function(){ slider.classList.remove('anim'); }, false);
    }

    if(typeof afterCB == "function") {
      afterCB();
    }
    
  } // _prevSlide


  var _translation = function(sElems, num){
    var wrapperWidth = sElems['wrapper'].offsetWidth;
    var slideWidth = outerWidth(sElems.slidesList[num]);
    var spaceBefore = 0;
    for (var i = 0; i < num; i++) {
      spaceBefore = spaceBefore + outerWidth(sElems.slidesList[i]);
    };
    var result = (wrapperWidth/2 - slideWidth/2 - spaceBefore);
    
    slider.style.webkitTransform = "translate3d(" + result + "px, 0px, 0px)";
    slider.style.transform = "translate3d(" + result + "px, 0px, 0px)";

    return result;
  }


  var _pagination = function(s){
    var ul = document.createElement('ul');
    ul.className = 'pe-slider-pag';
    
    [].slice.call(s).forEach(function(elem, index){
      var dotContainer = document.createElement('li');
      if(index === 0){
        dotContainer.className = 'selected';
      }
      var dot = document.createElement('a');
      dot.setAttribute('href','#0');
      dot.innerHTML = index + 1;
      dotContainer.appendChild(dot);
      ul.appendChild(dotContainer);
    });

    wrapper.appendChild(ul);
    
    return ul.querySelectorAll('li');
    
  } // _pagination


  var _updateNavigation = function(active, sElems){
    // Hide prev button
    if(sElems.slidesList.indexOf(active) === 0){
      sElems.prev.classList.add('inactive');
    } else {
      sElems.prev.classList.remove('inactive');
    }
    
    // Hide next button
    if(sElems.slidesList.indexOf(active) === sElems.slides.length - 1){
      sElems.next.classList.add('inactive');
    } else {
      sElems.next.classList.remove('inactive');
    }

    // Add .past class to past slides if start from other than first
    sElems.slidesList.forEach(function(item, index){
      if(index < sElems.slidesList.indexOf(active) ){
        sElems.slides[index].classList.add('past');
      }
    });

  } // _updateNavigation


  var _updatePagination = function(sElems){
    var n;

    // If pre-exist a slide with class 'selected'
    if(sElems.slider.querySelector('.selected')){

      n = sElems.slidesList.indexOf(sElems.slider.querySelector('.selected'));
      if(sElems.carousel) { _translation(sElems, n); }
      sElems.wrapper.querySelector('.pe-slider-pag .selected').classList.remove('selected');
      sElems.sliderPagination[n].classList.add('selected');
      if(!sElems.infinite) { _updateNavigation(sElems.slides[n],sElems); }
    } else {
      sElems.slider.querySelector('li').classList.add('selected');
      if(!sElems.infinite) { _updateNavigation(sElems.slides[0],sElems); }
    }
        
  }

  var _autoSlide = function(p, sElems) {
    if ( p === (sElems.slides.length - 1) ) {
      _prevSlide(0, sElems, sElems.afterChange, sElems.beforeChange);
    } else {
      _nextSlide(null, sElems, sElems.afterChange, sElems.beforeChange);
    }
  }

  var startTimer = function(sElems, delay){
    clearInterval(sElems.timer);
    sElems.timer = setInterval(function(){
      var activePosition = sElems.slidesList.indexOf(sElems.slider.querySelector('.selected'));
      _autoSlide(activePosition, sElems)
    }, delay);
  }


  function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  function outerHeight(el) {
    var height = el.offsetHeight;
    var style = getComputedStyle(el);

    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
  }

  function outerWidth(el) {
    var width = el.offsetWidth;
    var style = getComputedStyle(el);

    width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    return width;
  }


  // Public Methods
  
  var getActual = function(){
    return _actual;
  }

  var getTotal = function(){
    return _total;
  }

  var nextSlide = function(){
    _nextSlide(null, sliderElements, sliderElements.afterChange, sliderElements.beforeChange);
  }

  var prevSlide = function(){
    _prevSlide(null, sliderElements, sliderElements.afterChange, sliderElements.beforeChange);
  }

  var getSlider = function(){
    return {
      slider: slider,
      wrapper: wrapper, 
      slides: slides
    }
  }

  return {
    init: initialize,
    activeSlide: getActual,
    totalSlides: getTotal,
    nextSlide: nextSlide,
    prevSlide: prevSlide,
    getSlider: getSlider
  };

});