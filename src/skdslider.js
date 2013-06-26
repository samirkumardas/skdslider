/* =========================================================

// SKD Slider

// Datum: 2013-02-14
// Author: Samir Kumar Das
// Mail: cse.samir@gmail.com
// Web: http://dandywebsolution.com/skdslider

 *  $('#demo').skdslider({'delay':5000, 'fadeSpeed': 2000});
 *

// ========================================================= */
(function($){
    $.skdslider = function(container,options){
        // settings
        var config = {
            'delay': 2000,
            'fadeSpeed': 500,
			'showNav':true,
			'numericNav':false
        };
        if ( options ){$.extend(config, options);}
        // variables
       
	    var element=$(container);
        var slides = element.find('img.slide');
		var targetSlide=0;
		$.skdslider.currentSlide=0;
	   
	   $.skdslider.createNav(element,slides, config);
	   slides.eq(targetSlide).show();
       $.skdslider.interval=setTimeout(function() {
                    $.skdslider.playSlide(element,slides, config);
                }, config.delay);  
    };
	

  $.skdslider.createNav=function(element,slides,config){
			
			var slideSet ='<ul class="slide-links">';
			for(i=0;i<slides.length;i++){
			  var slideContent='';
			  if(config.numericNav==true) slideContent=(i+1);
			  if(i==0)
			  slideSet+='<li class="current-slide slide-link-'+i+'"><a>'+slideContent+'</a></li>';
			  else
			  slideSet+='<li class="slide-link-'+i+'"><a>'+slideContent+'</a></li>';
			}
			slideSet+='</ul>';
			
			
			
			if (config.showNav==true){
					element.append(slideSet);
					var nav_width=element.find('.slide-links')[0].offsetWidth;
					nav_width=parseInt((nav_width/2));
					element.find('.slide-links').css('margin-left',nav_width);
					// Slide marker clicked
					element.find('.slide-links li').click(function(){
						index = element.find('.slide-links li').index(this);
						targetSlide = index;
						clearTimeout($.skdslider.interval);
						$.skdslider.playSlide(element,slides, config,targetSlide);
						return false;
					});
			}
  };

 $.skdslider.playSlide=function(element,slides,config,targetSlide){
	   
	    element.find('.slide-links li').removeClass('current-slide');	
		slides.eq($.skdslider.currentSlide).fadeOut(config.fadeSpeed);
		
		if(typeof (targetSlide)=='undefined'){
	      targetSlide = ( $.skdslider.currentSlide+1 == slides.length ) ? 0 : $.skdslider.currentSlide+1;
		}
		
		element.find('.slide-links li').eq(targetSlide).addClass('current-slide');
	    slides.eq(targetSlide).fadeIn(config.fadeSpeed, function() {													 
			$.skdslider.removeIEFilter($(this)[0]);
		});
		$.skdslider.currentSlide=targetSlide;
		
		$.skdslider.interval=setTimeout((function() {
            $.skdslider.playSlide(element,slides, config);
        }), config.delay);
			   
  };
  
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
