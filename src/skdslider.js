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
            stopSlidingAfter: false,
            animationType: 'fading', /* fading or sliding */
            slideSelector: '.slide',
            activeClass: 'active',
            onMarkup: function() {},
        };

        this.options = $.extend({}, config, options);
        this.isTouchable =!!('ontouchstart' in window) || !!(navigator.msMaxTouchPoints);
        this.currentSlide = 0;
        this.nextSlide = 0;
        this.isPaused = false;
        this.playPauseStatus = this.options.autoSlide;
        this.isAnimating = false;
        this.container = $(container);
        this.dom = {};

        this.element = this.container.wrap('<div class="skdslider"></div>').closest('div.skdslider');
        this.slides = this.container.find(this.options.slideSelector);
        this.totalSlides = this.slides.length;
        this.dimension = {
            width: this.element.outerWidth(),
            height: this.element.outerHeight()
        };

        if (!this.totalSlides) {
            throw('There are no slides found. Look likes your have not set slideSelector option properly');
        }

        this.pivotImage = this.slides.eq(0).find('img');
        this.markup = {
            navs: '<li>%d</li>',
            prev: '<a class="prev"></a>',
            next: '<a class="next"></a>',
            play: '<a class="play"></a>'
        }

    
        this.init = function() {
            this.createEnvironment();
            this.options.onMarkup.call(this);
            this.createNav();
            this.enableEvents();
            this.slides.eq(this.currentSlide).show();
            this.slides.eq(this.nextSlide).addClass(this.options.activeClass);
            this.dom.navs.eq(this.nextSlide).addClass(this.options.activeClass);

            if (this.options.stopSlidingAfter) {
                if (this.options.stopSlidingAfter == 'all') {
                    this.options.stopSlidingAfter = this.slides.length;
                }
                this.options.stopSlidingAfter -= 1;
            }

            if (this.dimension.height == 0 && this.pivotImage[0].complete) {
                this.getDimension();
            }

            if (this.options.autoSlide) {
                this.play();
                if (this.dom.play) {
                    this.dom.play.removeClass('play').addClass('pause');
                }
            }
        }

        this.next = function() {
            this.isAnimating = false;
            this.nextSlide++;
            if(this.nextSlide == this.totalSlides) {
                this.nextSlide = 0;
            }
            this.play();
        };

        this.prev = function() {
            this.isAnimating = false;
            this.nextSlide--;
            if(this.nextSlide == -1) {
                this.nextSlide = this.totalSlides - 1;
            }
            this.play();
        };

        this.animate = function() {

            this.isAnimating = true;
            this.dom.navs.removeClass(this.options.activeClass);
            this.dom.navs.eq(this.nextSlide).addClass(this.options.activeClass);
            this.slides.removeClass(this.options.activeClass);
            this.slides.eq(this.nextSlide).addClass(this.options.activeClass);
            this.stopAnimation();

            if (this.options.animationType == 'fading') {
                this.slides.eq(this.currentSlide).fadeOut(this.options.animationSpeed);
                this.slides.eq(this.nextSlide).fadeIn(this.options.animationSpeed, function() {
                    _self.isAnimating = false;
                });
            } else {
                var left,
                    width;
                width = this.element.outerWidth();
                if (width != this.slides.eq(0).outerWidth()) {
                    this.setDimension();
                }
                left = (-1 * this.nextSlide * width); 
                this.container.animate({left:left}, this.options.animationSpeed, function() {
                    _self.isAnimating = false;
                });
            }
            
            this.currentSlide = this.nextSlide;
        };

        this.play = function () {
            this.removeTimer();
            this.animate();
            this.addTimer();
        };

        this.addTimer = function() {
            if (!this.isPaused && this.options.autoSlide) {
                this.timer = setTimeout(this.next.bind(this), this.options.delay);
            }
            this.handleStopAtSlide();
        }

        this.removeTimer = function() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = '';
            }
        };


        this.stopAnimation = function() {
            if (this.options.animationType == 'fading') {
                this.slides.stop();
            } else {
                this.container.stop();
            }
        };

        this.handleStopAtSlide = function() {
            if (this.options.stopSlidingAfter && this.options.stopSlidingAfter == this.nextSlide) {
                if (this.dom.play) {
                    this.dom.play.removeClass('pause').addClass('play');
                }
                this.isPaused = true;
                this.playPauseStatus = false;
                this.options.autoSlide = false;
            }
        }

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
                navs = $('<ul class="slide-navs">'+markup+'</ul>');
                this.element.append(navs);
                this.dom.navs = navs.children();
            }

            if (this.options.showNextPrev) {
                this.dom.prev = $(this.markup.prev);
                this.dom.next = $(this.markup.next);
                this.element.append(this.dom.prev, this.dom.next);
            }

            if (this.options.showPlayButton) {
                this.dom.play = $(this.markup.play);
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
            }
            this.setDimension();
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
                    if (this.playPauseStatus) {
                        this.isPaused = true;
                        this.playPauseStatus = false;
                        this.removeTimer();
                        this.stopAnimation();
                        this.dom.play.removeClass('pause').addClass('play');
                    } else {
                       this.isPaused = false;
                       this.playPauseStatus = true;
                       this.next();
                       this.dom.play.removeClass('play').addClass('pause');
                    }

                }.bind(this));
            }

            /* general events */
            this.element.on('mouseenter', function(e) {
                e.preventDefault();
                if (this.dom.play) {
                    this.dom.play.show();
                }
                if (!this.playPauseStatus) return;
                if (this.options.pauseOnHover) {
                    this.isPaused = true;
                    this.removeTimer();
                    this.stopAnimation();
                }
            }.bind(this));

            this.element.on('mouseleave', function(e) {
                e.preventDefault();
                if (this.dom.play) {
                    this.dom.play.hide();
                }
                if (!this.playPauseStatus) return;
                if (this.options.pauseOnHover) {
                    this.isPaused = false;
                    this.addTimer();
                }
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

            $(window).resize(this.setDimension);
            this.pivotImage.on('load', this.getDimension);
        };

        this.getDimension = function() {
            this.dimension.width = this.pivotImage[0].naturalWidth || this.pivotImage[0].target.width; 
            this.dimension.height = this.pivotImage[0].naturalHeight || this.pivotImage[0].height;
            this.setDimension();
        }

        this.setDimension = function() {
             var totalWidth = this.options.animationType == 'fading' ? this.element.outerWidth() : (this.element.outerWidth() * this.totalSlides),
                 slierWidth = this.element.outerWidth(),
                 sliderHeight = Math.ceil(this.dimension.height * (slierWidth / this.dimension.width));
                 sliding = {width: totalWidth, height: sliderHeight},
                 fading =  {height: sliderHeight};
             this.container.css(this.options.animationType == 'fading' ? fading : sliding);
             this.element.css({height:sliderHeight});
             this.slides.css({width:slierWidth});
        }

        this.setDimension = this.setDimension.bind(this);
        this.getDimension = this.getDimension.bind(this);
        this.init();
    } 

    $.fn.skdslider = function(options){
        return this.each(function() {
            (new Skdslider(this,options));
        });
    };

})(jQuery);