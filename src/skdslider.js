/* =========================================================

// SKD Slider
// Update Date: 2013-12-24
// Author: Samir Kumar Das
// Mail: cse.samir@gmail.com
// Web: http://dandywebsolution.com/skdslider
// Version: 1.2
 *  $('#demo').skdslider({'delay':5000, 'animationSpeed': 2000});
 *

// ========================================================= */
(function($){
    $.skdslider = function(container,options){
        // settings
        var config = {
            'delay': 2000,
            'animationSpeed': 500,
			'showNav':true,
			'autoSlide':true,
			'showNextPrev':false,
			'pauseOnHover':false,
			'numericNav':false,
			'showPlayButton':false,
			'animationType':'fading', /* fading/sliding */
        };
		
        if ( options ){$.extend(config, options);}
        // variables
		
	    var touch = (( "ontouchstart" in window ) || window.DocumentTouch && document instanceof DocumentTouch);
	  
       
	    $(container).wrap('<div class="skdslider"></div>');
		var element=$(container).closest('div.skdslider');
		element.find('ul').addClass('slides');
        var slides = element.find('ul.slides li');
		var targetSlide=0;
		config.currentSlide=0;
		config.currentState='pause';
		config.running=false;
		
		if(config.animationType=='fading'){
		   slides.each(function(){$(this).css({'position': 'absolute', 'left': '0','top': '0','bottom':'0','right':'0'});});
		}
		
		if(config.animationType=='sliding'){
		   slides.each(function(){$(this).css({'float': 'left', 'display': 'block','position': 'relative'});});
		   
		   var totalWidth=element.outerWidth()*slides.size();
		   element.find('ul.slides').css({'position': 'absolute', 'left': '0','width':totalWidth});
		   slides.css({'width':element.outerWidth(),'height':element.outerHeight()});
		   
		   $( window ).resize(function() {
			  var totalWidth=element.outerWidth()*slides.size();
		      element.find('ul.slides').css({'position': 'absolute', 'left': '0','width':totalWidth});
		      slides.css({'width':element.outerWidth(),'height':element.outerHeight()});
		   });
		}
		
		//if (touch)
		$.skdslider.enableTouch(element,slides, config);
	   
	    $.skdslider.createNav(element,slides, config);
	    slides.eq(targetSlide).show();
		if (config.autoSlide==true){
		   config.currentState='play';	
           config.interval=setTimeout(function() {
                    $.skdslider.playSlide(element,slides, config);
                }, config.delay); 
		}
		
		if(config.pauseOnHover==true){
		   slides.hover(function(){
			  if (config.autoSlide==true){					 
			    config.currentState='pause'; 
			    clearTimeout(config.interval);
			  }
		   },function(){ 
		     if (config.autoSlide==true){		
		         config.currentState='play'; 
			     if(config.autoSlide==true) $.skdslider.playSlide(element,slides, config);
		       }
			} );
		}
    };
	

  $.skdslider.createNav=function(element,slides,config){
			
			var slideSet ='<ul class="slide-navs">';
			for(i=0;i<slides.length;i++){
			  var slideContent='';
			  if(config.numericNav==true) slideContent=(i+1);
			  if(i==0)
			  slideSet+='<li class="current-slide slide-nav-'+i+'"><a>'+slideContent+'</a></li>';
			  else
			  slideSet+='<li class="slide-nav-'+i+'"><a>'+slideContent+'</a></li>';
			}
			slideSet+='</ul>';
			
			
			
			if (config.showNav==true){
					element.append(slideSet);
					var nav_width=element.find('.slide-navs')[0].offsetWidth;
					nav_width=parseInt((nav_width/2));
					nav_width=(-1)*nav_width;
					element.find('.slide-navs').css('margin-left',nav_width);
					// Slide marker clicked
					element.find('.slide-navs li').click(function(){
						index = element.find('.slide-navs li').index(this);
						targetSlide = index;
						clearTimeout(config.interval);
						config.currentState='play';
						config.running=false;
						$.skdslider.playSlide(element,slides, config,targetSlide);
						return false;
					});
			}
			
	    if (config.showNextPrev==true){
			 var nextPrevButton ='<a class="prev"></a>'; 
			     nextPrevButton +='<a class="next"></a>'; 
				 
			 element.append(nextPrevButton);
			 
			 element.find('a.prev').click(function(){
				 $.skdslider.prev(element,slides, config);									   
			 });
			
			 element.find('a.next').click(function(){
				  $.skdslider.next(element,slides, config);								   
			 });
		}
		
	  if (config.showPlayButton==true){
		   
			var playPause =(config.currentState=='play' || config.autoSlide==true)?'<a class="play-control pause"></a>':'<a class="play-control play"></a>';  
			element.append(playPause);			
			element.hover(function(){element.find('a.play-control').css('display','block');},function(){element.find('a.play-control').css('display','none');});
		   
		    element.find('a.play-control').click(function(){
											   
					if(config.autoSlide==true)
					{
					   clearTimeout(config.interval);
					   config.autoSlide=false;
					   config.currentState='pause';
					   $(this).addClass('play');
					   $(this).removeClass('pause');
					}
					else
					{
					   config.currentState='play';
					   config.autoSlide=true;
					   $(this).addClass('pause');
					   $(this).removeClass('play');
					   
					   if((config.currentSlide+1)==slides.length)targetSlide = 0;
					   else targetSlide = (config.currentSlide+1);
					   
					   clearTimeout(config.interval);
					   $.skdslider.playSlide(element,slides, config,targetSlide);
					}	
				   return false;
			 });
	  }
	  
  };
  
 $.skdslider.next=function(element,slides,config){
    if((config.currentSlide+1)==slides.length)targetSlide = 0;
	else targetSlide = (config.currentSlide+1);
	
	clearTimeout(config.interval);
	config.currentState='play';
	$.skdslider.playSlide(element,slides, config,targetSlide);
	return false;
 }
 
 $.skdslider.prev=function(element,slides,config){
    if(config.currentSlide==0)targetSlide = (slides.length-1);
	else targetSlide = (config.currentSlide-1);

	clearTimeout(config.interval);
	config.currentState='play';
	config.running=false;
	$.skdslider.playSlide(element,slides, config,targetSlide);
	return true;
 }
 
 $.skdslider.prev=function(element,slides,config){
    if(config.currentSlide==0)targetSlide = (slides.length-1);
	else targetSlide = (config.currentSlide-1);

	clearTimeout(config.interval);
	config.currentState='play';
	config.running=false;
	$.skdslider.playSlide(element,slides, config,targetSlide);
	return true;
 }
 
 $.skdslider.playSlide=function(element,slides,config,targetSlide){
	   
	    if(config.currentState=='play' && config.running==false){
			
				element.find('.slide-navs li').removeClass('current-slide');
				if(typeof (targetSlide)=='undefined'){
					  targetSlide = ( config.currentSlide+1 == slides.length ) ? 0 : config.currentSlide+1;
				}
				if(config.animationType=='fading'){
					config.running=true;
					slides.eq(config.currentSlide).fadeOut(config.animationSpeed);
					slides.eq(targetSlide).fadeIn(config.animationSpeed, function() {													 
						$.skdslider.removeIEFilter($(this)[0]);
						 config.running=false;		
					});
				}
				if(config.animationType=='sliding'){
					var left=(targetSlide*element.outerWidth())*(-1);
					config.running=true;
					element.find('ul.slides').animate({left:left}, config.animationSpeed,function(){
					  config.running=false;																		 
					});
				}
				element.find('.slide-navs li').eq(targetSlide).addClass('current-slide');
				config.currentSlide=targetSlide;
		}
		
	  if (config.autoSlide==true && config.currentState=='play'){
			config.interval=setTimeout((function() {
				$.skdslider.playSlide(element,slides, config);
			}), config.delay);
	  }
  };
  
  $.skdslider.enableTouch=function(element,slides,config){
	  element[0].addEventListener('touchstart', onTouchStart, false);
	   var startX;
       var startY;
	   var dx;
	   var dy;
	   
	   function onTouchStart(e){
		   startX = e.touches[0].pageX;
    	   startY = e.touches[0].pageY; 
		   element[0].addEventListener('touchmove', onTouchMove, false);
           element[0].addEventListener('touchend', onTouchEnd, false);
	   }
	   
	   function onTouchMove(e) {
				 e.preventDefault();
	    		 var x = e.touches[0].pageX;
	    		 var y = e.touches[0].pageY;
	    		 dx = startX - x;
	    		 dy = startY - y;
      }
	  
	 function onTouchEnd(e) {
				 element[0].removeEventListener('touchmove', onTouchMove, false);
				 if(dx>0){
					  $.skdslider.next(element,slides, config);		 
				 }else{
				     $.skdslider.prev(element,slides, config);			 
			     }
	    		 element[0].removeEventListener('touchend', onTouchEnd, false);
    	 }	
  }
   
  
  $.skdslider.removeIEFilter=function(elm){
	  if(elm.style.removeAttribute){
		elm.style.removeAttribute('filter');
	   }  
  }

 $.fn.skdslider = function(options){
        return this.each(function(){
            (new $.skdslider(this,options));
        });
    };
	
})(jQuery);