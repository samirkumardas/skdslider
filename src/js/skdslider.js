;(function($){

    function Skdslider(container, options) {

        var config,
            _self = this;

        // default options
        config = {
            delay: 2000,
            animationSpeed: 500,
            showNav: true,
            autoSlide: true,
            showNextPrev: false,
            pauseOnHover: false,
            numericNav: false,
            showPlayButton: false,
            animationType: 'fading', /* fading or sliding */
            slideSelector: '.slide',
            activeClass: 'active',
            onMarkup: function() {},
        };

        this.options = $.extend({}, config, options);
        this.isTouchable =!!('ontouchstart' in window) || !!(navigator.msMaxTouchPoints);
        this.currentSlide = 0;
        this.nextSlide = 0;
        this.isSliding = true;
        this.isAnimating = false;
        this.container = $(container);
        this.dom = {};

        this.element = this.container.wrap('<div class="skdslider"></div>').closest('div.skdslider');
        this.slides = this.container.find(this.options.slideSelector);
        this.totalSlides = this.slides.length;

         if (!this.totalSlides) {
            throw('There are no slides found. Look likes your have not set slideSelector option properly');
        }

        this.markup = {
            navs: '<li>%d</li>',
            prev: '<a class="skdslider-prev"></a>',
            next: '<a class="skdslider-next"></a>',
            play: '<a class="skdslider-play"></a>'
        }

    
        this.init = function() {
            this.createEnvironment();
            this.options.onMarkup.call(this);
            this.createNav();
            this.enableEvents();
            this.slides.eq(this.currentSlide).show();
            this.slides.eq(this.nextSlide).addClass(this.options.activeClass);
            this.dom.navs.eq(this.nextSlide).addClass(this.options.activeClass);

            if (this.options.autoSlide) {
                this.play();
            }
        }

        this.next = function() {
            this.nextSlide++;
            if(this.nextSlide == this.totalSlides) {
                this.nextSlide = 0;
            }
            this.play();
        };

        this.prev = function() {
            this.nextSlide--;
            if(this.nextSlide == -1) {
                this.nextSlide = this.totalSlides - 1;
            }
            this.play();
        };

        this.animate = function() {

            if (this.isAnimating || !this.isSliding) {
                return false;
            }

            this.isAnimating = true;
            this.dom.navs.removeClass(this.options.activeClass);
            this.dom.navs.eq(this.nextSlide).addClass(this.options.activeClass);
            this.slides.removeClass(this.options.activeClass);
            this.slides.eq(this.nextSlide).addClass(this.options.activeClass);

            if (this.options.animationType == 'fading') {
                this.slides.eq(this.currentSlide).fadeOut(this.options.animationSpeed);
                this.slides.eq(this.nextSlide).fadeIn(this.options.animationSpeed, function() {
                    _self.isAnimating = false;
                });
            } else {
                var left,
                    width;

                width = element.outerWidth();
                left = (-1 * this.targetSlide * width); 
                this.container.animate({left:left}, this.options.animationSpeed, function() {
                    _self.isAnimating = false;
                });
            }
            
            this.currentSlide = this.nextSlide;
        };

        this.play = function () {
            this.removeTimer();
            this.animate();
            if (this.isSliding) {
                this.timer = setTimeout(this.next.bind(this), this.options.delay);
            }
        };

        this.removeTimer = function() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = '';
            }
        };

        this.createNav = function() {
            var markup = '',
                content = '',
                i,
                navs;

            for(i=0;i <this.totalSlides; i++) {
                 if(this.options.numericNav) {
                    content = (i+1);
                 }
                 markup += this.markup.navs.replace('%d', content);
            }

            if (this.options.showNav) {
                navs = $('<ul class="skdslider-navs">'+markup+'</ul>');
                this.element.append(navs);
                this.dom.navs = navs.children();
            }

            if (this.options.showNextPrev) {
                this.dom.prev = $(this.markup.prev);
                this.dom.next = $(this.markup.next);
                this.element.append(this.dom.prev, this.dom.next);
            }

            if (this.options.showPlayButton) {
                this.dom.prev = $(this.markup.play);
                this.element.append(this.dom.play);
            }
        };

        this.createEnvironment = function() {

            var sliding = {'float': 'left', 'display': 'block','position': 'relative'},
                fading =  {'position': 'absolute', 'left': '0','top': '0','bottom':'0','right':'0'},
                totalWidth;

            this.slides.each(function() {
                $(this).css( _self.options.animationType == 'fading' ? fading : sliding );
            });

            if(this.options.animationType=='sliding') {
                totalWidth = this.element.outerWidth() * this.totalSlides;
                this.container.css({'position': 'absolute', 'left': '0', 'width':totalWidth});
                //slides.css({'width':element.outerWidth(),'height':element.outerHeight()});
            }
        };

        this.enableEvents = function() {
            var startX,
                startY,
                dx,
                dy;

            if (this.dom.navs) {
                this.dom.navs.on('click', function(e) {
                    e.preventDefault();
                    this.nextSlide = this.dom.navs.index(e.target); 
                    this.isAnimating = false;
                    this.isSliding = true;
                    this.play();
                }.bind(this));
            }

            if (this.dom.prev) {
                this.dom.prev.on('click', function(e) {
                    e.preventDefault();
                    this.prev();
                }.bind(this));
            }

            if (this.dom.next) {
                this.dom.next.on('click', function(e) {
                    e.preventDefault();
                    this.next();
                }.bind(this));
            }

            if (this.dom.play) {
                this.dom.play.on('click', function(e) {
                    e.preventDefault();
                    if (this.isSliding) {
                        this.isSliding = false;
                        this.removeTimer();
                        this.dom.play.removeClass('play').addClass('pause');
                    } else {
                       this.isSliding = true;
                       this.next();
                       this.dom.play.removeClass('pause').addClass('play');
                    }

                }.bind(this));
            }

            /* general events */
            this.element.on('hover', function(e) {
                e.preventDefault();
                if (this.options.pauseOnHover) {
                    this.isSliding = !this.isSliding;
                }
                this.dom.play.show();
            }.bind(this));

            this.element.on('blur', function(e) {
                e.preventDefault();
                if (this.options.pauseOnHover) {
                    this.isSliding = !this.isSliding;
                }
                this.dom.play.hide();
            }.bind(this));

            /* touch events */
            if (this.isTouchable) {
                this.element.on('touchstart', function(e) {
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                });

                this.element.on('touchmove', function(e) {
                    var x = e.touches[0].pageX,
                        y = e.touches[0].pageY;
                    dx = startX - x;
                    dy = startY - y;
                });

                this.element.on('touchend', function(e) {
                    e.preventDefault();
                    if(dx > 0) {
                        this.next();
                    } else {
                       this.prev();
                    }
                }.bind(this));
            }


            $(window).resize(function() {
                var totalWidth = this.element.outerWidth() * this.totalSlides;
                this.container.css({'position': 'absolute', 'left': '0','width':totalWidth});
                //slides.css({'width':element.outerWidth(),'height':element.outerHeight()});
            }.bind(this));
        };

        this.init();
    } 

    $.fn.skdslider = function(options){
        return this.each(function() {
            (new Skdslider(this,options));
        });
    };

})(jQuery);