var peSVGttern = (function(){

  "use strict"

  var initialize = function (options) {

    var config = {
      elems: '.section-pattern',
      bgSize: 70,
      stroke: '',
      fill: '',
      offset: 0,
      anim: false,
      svgSrc: ''
    };

    for(var prop in options) {
      if(options.hasOwnProperty(prop)){
        config[prop] = options[prop];
      }
    }

    var isFirefox = typeof InstallTrigger !== 'undefined';
    var bg = config['elems'].constructor === Array ? config['elems'].map(function(e){ return document.querySelector(e)}) : document.querySelectorAll(config.elems), 
        svgContent;
    var reStroke = /stroke=\"([^"]*)\"/i;
    var reFill = /fill=\"([^"]*)\"/i;
    var reSVG = /<svg[^>]+>(.+?)<\/svg>/i;
    var rePath = /<[^>]+?\/>/i;
    var animLoop = "<style type=\"text/css\"> * { animation: dash-fade-in 2s cubic-bezier(0.6,0,0.4,1) alternate infinite; -webkit-animation: dash-fade-in 2s cubic-bezier(0.6,0,0.4,1) alternate infinite; fill-opacity:0; stroke-dasharray: 3000; stroke-dashoffset: 3000; } @-webkit-keyframes dash-fade-in { 50% { fill-opacity: 0; stroke-opacity: 1; } 100% { stroke-opacity: 0; fill-opacity: 1; stroke-dashoffset: 0; } } @keyframes dash-fade-in { 50% { fill-opacity: 0; stroke-opacity: 1; } 100% { stroke-opacity: 0; fill-opacity: 1; stroke-dashoffset: 0; } }</style>";
    var animFillIn = "<style type=\"text/css\"> * { animation: dash-fade-in 5s cubic-bezier(0.6,0,0.4,1) forwards; -webkit-animation: dash-fade-in 5s cubic-bezier(0.6,0,0.4,1) forwards; fill-opacity:0; stroke-dasharray: 3000; stroke-dashoffset: 3000; } @-webkit-keyframes dash-fade-in { 50% { fill-opacity: 0; stroke-opacity: 1; } 100% { stroke-opacity: 0; fill-opacity: 1; stroke-dashoffset: 0; } } @keyframes dash-fade-in { 50% { fill-opacity: 0; stroke-opacity: 1; } 100% { stroke-opacity: 0; fill-opacity: 1; stroke-dashoffset: 0; } } </style>";
    var animStrokeIn = "<style type=\"text/css\"> * { animation: dash-fade-in 5s cubic-bezier(0.6,0,0.4,1) forwards; -webkit-animation: dash-fade-in 5s cubic-bezier(0.6,0,0.4,1) forwards; fill-opacity:0; stroke-dasharray: 3000; stroke-dashoffset: 3000; } @-webkit-keyframes dash-fade-in { to { stroke-dashoffset: 0; } } @keyframes dash-fade-in { to { stroke-dashoffset: 0; } }</style>";
    var animFillOut = "<style type=\"text/css\"> * { animation: dash-fade-in 5s cubic-bezier(0.6,0,0.4,1) forwards; -webkit-animation: dash-fade-in 5s cubic-bezier(0.6,0,0.4,1) forwards; stroke-dashoffset: 0; stroke-width:2px; stroke-dasharray: 3000; stroke-dashoffset: 0; } @-webkit-keyframes dash-fade-in { 50% { fill-opacity:0; stroke-opacity: 1; } 100% { stroke-dashoffset: 3000; fill-opacity:0; } } @keyframes dash-fade-in { 50% { fill-opacity:0; stroke-opacity: 1; } 100% { stroke-dashoffset: 3000; fill-opacity:0; } }</style>";
    var animStrokeOut = "<style type=\"text/css\"> * { animation: dash-fade-in 5s cubic-bezier(0.6,0,0.4,1) forwards; -webkit-animation: dash-fade-in 5s cubic-bezier(0.6,0,0.4,1) forwards; fill-opacity:0; stroke-dasharray: 3000; stroke-dashoffset: 0; } @-webkit-keyframes dash-fade-in { to { stroke-dashoffset: 3000; } } @keyframes dash-fade-in { to { stroke-dashoffset: 3000; } }</style>";
    var nocache = new Date().getTime();

    for (var i = 0; i < bg.length; i++) {

      (function (i) {
        
        var xhr = new XMLHttpRequest();
        var url = bg[i].dataset.svgSrc ? bg[i].dataset.svgSrc + '?cache=' + nocache : config.svgSrc;
        
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onload = function(e) {

          svgContent = xhr.responseText;
          
          if(bg[i].dataset.strokeColor || config.stroke){
            var sk = bg[i].dataset.strokeColor ? bg[i].dataset.strokeColor : config.stroke;
            if(testColor(sk) || sk == "none"){
              svgContent = svgContent.replace(reStroke, 'stroke="' + sk + '"');
            }
          }

          if(bg[i].dataset.fillColor || config.fill ){
            var fl = bg[i].dataset.fillColor ? bg[i].dataset.fillColor : config.fill;
            if(testColor(fl) || fl == "none"){
              svgContent = svgContent.replace(reFill, 'fill="' + fl + '"');
            }
          }
      
          if(bg[i].dataset.svgOffset || config.offset){
            var os = bg[i].dataset.svgOffset ? bg[i].dataset.svgOffset : config.offset;
            svgContent = svgContent.replace(svgContent.match(reSVG)[1], '<g transform="translate(' + os + ') ">' + svgContent.match(reSVG)[1] + '</g>')  
          }

          if( (bg[i].dataset.svgAnim || config.anim) && !isFirefox ){
            var anm = bg[i].dataset.svgAnim ? bg[i].dataset.svgAnim : config.anim;
            if(anm == 'stroke-in'){
              svgContent = svgContent.replace(svgContent.match(reSVG)[1], animStrokeIn + svgContent.match(reSVG)[1]);  
            } else if(anm == 'fill-in'){
              svgContent = svgContent.replace(svgContent.match(reSVG)[1], animFillIn + svgContent.match(reSVG)[1]);  
            } else if(anm == 'stroke-out'){
              svgContent = svgContent.replace(svgContent.match(reSVG)[1], animStrokeOut + svgContent.match(reSVG)[1]);  
            } else if(anm == 'fill-out'){
              svgContent = svgContent.replace(svgContent.match(reSVG)[1], animFillOut + svgContent.match(reSVG)[1]);  
            } else {
              svgContent = svgContent.replace(svgContent.match(reSVG)[1], animLoop + svgContent.match(reSVG)[1]);  
            }
          } else {
            console.log('Seems that doesn\'t work CSS animations inside an SVG data uri image as background-image in your browser')
          }
          
          var encoded = encodeURIComponent(svgContent).replace(/'/g,"%27").replace(/"/g,"%22");
          bg[i].style.backgroundImage = 'url(\'data:image/svg+xml;charset=UTF-8,' + encoded + '\')';

         }

       })(i); // loop
      
       bg[i].style.backgroundSize = bg[i].dataset.bgSize ? bg[i].dataset.bgSize + 'px' : config.bgSize + 'px';

    }

  }

  return {
    init: initialize
  };

});