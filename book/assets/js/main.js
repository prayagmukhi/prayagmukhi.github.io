


// function addBg(elem){

//   var bg = document.querySelectorAll(elem), blend, bgcolor, bgop;
  
//   for (var i = 0; i < bg.length; i++) {

//     if(bg[i].dataset.bgBlend) {
//       blend = bg[i].dataset.bgBlend;
//     }
//     if(bg[i].dataset.bgColor) {
//       bgcolor = bg[i].dataset.bgColor;
//     }
//     if(bg[i].dataset.bgOpacity) {
//       bgop = bg[i].dataset.bgOpacity;
//     }

//     if(bg[i].classList.contains('parallax')) {
//       var pElem = document.createElement('div');
//       pElem.setAttribute('class','parallaxing');
//       pElem.style.backgroundImage = "url(" + bg[i].dataset.bgSrc + ")";
//       if(blend) {
//         pElem.style.backgroundColor = bgcolor;
//         pElem.style.backgroundBlendMode = blend;
//         pElem.style.webkitBackgroundBlendMode = blend;
//         pElem.style.opacity = bgop;
//       }
//       bg[i].insertBefore(pElem, bg[i].firstChild);
//     } else {
//       bg[i].style.backgroundImage = "url(" + bg[i].dataset.bgSrc + ")";
//       if(blend) {
//         bg[i].style.backgroundColor = bgcolor;
//         bg[i].style.backgroundBlendMode = blend;
//         bg[i].style.webkitBackgroundBlendMode = blend;
//       }
//     }
//   }


//   function updateScroll() {
//     var st = scrollY();
//     var parallax = document.querySelectorAll('.parallaxing');

//     if(parallax.length > 0) {
//       var rect = parallax[0].getBoundingClientRect();
//       var pos = document.body.scrollTop;
//       var translateY = st * 0.5,
//           translateX = 0,
//           scale = 1, 
//           opacity = 1,
//           viewed = st + getViewportH();

//       for (var i = 0; i < parallax.length; i++) {
//         if(inViewport(parallax[i])){
//           var factor = 0.55;
//           var variable = (getViewportH() - parallax[i].offsetHeight) * factor;
//           translateY = (viewed - getOffset(parallax[i]).top - parallax[i].offsetHeight)* factor - variable;
//           parallax[i].style.WebkitTransform = 'translate3d(' + translateX +'px, ' +   translateY + 'px, 0) scale('+ scale +')';
//           parallax[i].style.transform = 'translate3d(' + translateX +'px, ' +   translateY + 'px, 0) scale('+ scale +')';
//         }
//       } // for
    
//     } // if

//   } // onscroll

//   window.addEventListener( 'scroll', updateScroll );

// }



// function addSVGPattern(elem) {

//   var bg = document.querySelectorAll(elem), svgContent;
//   var reStroke = /stroke=\"([^"]*)\"/i;
//   var reFill = /fill=\"([^"]*)\"/i;
//   var reSVG = /<svg[^>]+>(.+?)<\/svg>/i

//   for (var i = 0; i < bg.length; i++) {

//     (function (i) {
//        var ajax = new XMLHttpRequest();
//        ajax.open("GET", bg[i].dataset.svgSrc, true);
//        ajax.send();
//        ajax.onload = function(e) {
//         svgContent = ajax.responseText;
//         if(bg[i].dataset.strokeColor && (testColor(bg[i].dataset.strokeColor) || bg[i].dataset.strokeColor == "none") ){
//           svgContent = svgContent.replace(reStroke, 'stroke="' + bg[i].dataset.strokeColor + '"');
//         }
//         if(bg[i].dataset.fillColor && (testColor(bg[i].dataset.fillColor) || bg[i].dataset.strokeColor == "none") ){
//           svgContent = svgContent.replace(reFill, 'fill="' + bg[i].dataset.fillColor + '"');
//         }

//         // console.log(typeof bg[i].dataset.svgOffset)

//         var stl = "<style type=\"text/css\"> * { animation: dash-fade-in 2s cubic-bezier(0.6,0,0.4,1) alternate infinite forwards; -webkit-animation: dash-fade-in 2s cubic-bezier(0.6,0,0.4,1) alternate infinite forwards; fill-opacity:0; stroke-dasharray: 3000; stroke-dashoffset: 3000; stroke:#EFD644; } @-webkit-keyframes dash-fade-in { 50% { fill-opacity: 0; stroke-opacity: 1; } 100% { stroke-opacity: 0; fill-opacity: 1; stroke-dashoffset: 0; } } @keyframes dash-fade-in { 50% { fill-opacity: 0; stroke-opacity: 1; } 100% { stroke-opacity: 0; fill-opacity: 1; stroke-dashoffset: 0; } </style>";
    
//         if(bg[i].dataset.svgOffset){
//           svgContent = svgContent.replace(svgContent.match(reSVG)[1], '<g transform="translate(' + bg[i].dataset.svgOffset + ') ">' + svgContent.match(reSVG)[1] + '</g>')  
//         }

//         if(bg[i].dataset.svgAnim){
//           svgContent = svgContent.replace(svgContent.match(reSVG)[1], stl + svgContent.match(reSVG)[1]);
//         }

        
//         bg[i].style.backgroundImage = 'url(\'data:image/svg+xml;utf8,' + svgContent + '\')';
//        }
//      })(i);
    
//      bg[i].style.backgroundSize = bg[i].dataset.bgSize + 'px';

//   }

// }


// var peLoader = (function(){

//   var initialize = function (options) {

//     config = {
//       loader: '#loading',
//       removeTime: 700
//     };

//     for(var prop in options) {
//       if(options.hasOwnProperty(prop)){
//         config[prop] = options[prop];
//       }
//     }

//     var loaderElem = document.querySelector(config.loader), rl;

//     var removeLoader = function(elem){
//       elem.classList.add('loaded');
//       setTimeout(function(){
//         document.body.removeChild(elem);
//       },config.removeTime);
//     };

//     var doLoading = function() {
//       rl = setTimeout(removeLoader(loaderElem),2000);
//     }

//     if(loaderElem) {
      
//       window.addEventListener('load', doLoading);
      
//       loaderElem.addEventListener('click', function(){
//         clearTimeout(rl);
//         removeLoader(loaderElem);
//       });

//     }

//   }

//   return {
//     init: initialize
//   };

// })();
      



// // Hide Header on on scroll down
// var didScroll;
// var lastScrollTop = 0;
// var delta = 50;
// var navEl = document.querySelector('.navbar');
// var navHeight = outerHeight(navEl);

// window.addEventListener('scroll',function(event){
//     didScroll = true;
// });

// setInterval(function() {
//     if (didScroll) {
//         hasScrolled();
//         didScroll = false;
//     }
// }, 250);

// function hasScrolled() {
//     var st = scrollY();
    
//     // Tolerance to scroll
//     if(Math.abs(lastScrollTop - st) <= delta) {
//       return;
//     }
    
//     // if (st > lastScrollTop && st > navHeight){
//     if (st > lastScrollTop ){
//         // Scroll Down
//         navEl.classList.remove('nav-show')
//         navEl.classList.add('nav-hide');
//     } else {
//         // Scroll Up

//         if(st + $(window).height() < $(document).height()) {

//             navEl.classList.remove('nav-hide');
//             navEl.classList.add('nav-show');
//         }
//     }
    
//     lastScrollTop = st;
// }










// Utility functions


function testColor(str) {
  var dummy = document.createElement('div');
  dummy.style.color = str;

  // Is the syntax valid?
  if (!dummy.style.color) { return null; }
      
  document.head.appendChild(dummy);
  var normalized = getComputedStyle(dummy).color;
  document.head.removeChild(dummy);
  
  if (!normalized) { return null; }
  var rgb = normalized.match(/\((\d+), (\d+), (\d+)/);
  
  return normalized; // for testing purposes
}

function SelectText(element) {
  var doc = document,
      text = element,
      range, selection;

  if (doc.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
      /*
      if(range.toString().length === 0){
        range.moveToElementText(text);
        range.select();
      }
      */
  } else if (window.getSelection) {
      selection = window.getSelection();
      if(selection.toString().length === 0){
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
      }
  }
}

var docElem = window.document.documentElement;

function getViewportH() {
  var client = docElem.clientHeight,
  inner = window.innerHeight;
  
  if( client < inner ) {
    return inner; 
  } else {
    return client;
  }
}

function scrollY() {
  return window.pageYOffset || docElem.scrollTop;
}

function getOffset( el ) {
  var offsetTop = 0, offsetLeft = 0;
  do {
    if ( !isNaN( el.offsetTop ) ) {
     offsetTop += el.offsetTop;
    }
    if ( !isNaN( el.offsetLeft ) ) {
     offsetLeft += el.offsetLeft;
    }
  } while( el = el.offsetParent );

    return {
    top : offsetTop,
    left : offsetLeft
  };
}

function inViewport( el, h ) {
  var elH = el.offsetHeight,
    scrolled = scrollY(),
    viewed = scrolled + getViewportH(),
    elTop = getOffset(el).top,
    elBottom = elTop + elH,
    h = h || 0;
    return (elTop + elH * h) <= viewed && (elBottom - elH * h) >= scrolled;
}

function getRadioVal(name){
  var radioGroup = document.getElementsByName(name);
  for (var i = 0, length = radioGroup.length; i < length; i++) {
    if (radioGroup[i].checked) {
        return radioGroup[i].value;
    }
  }
}

function setRadioVal(name, value){
  var radioGroup = document.getElementsByName(name);
  for (var i = 0, length = radioGroup.length; i < length; i++) {
    if (radioGroup[i].value == value) {
        radioGroup[i].checked = true;
    }
  }
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

