skdslider
-----------
SKDSlider - Full Width Jquery Slider - Jquery Responsive Full Width Slider - Full Screen Slider- Simple Jquery Slider

Demo
-----

http://dandywebsolution.com/skdslider/


**How to use?**

**markup**
    
    <link href="skdslider.css" rel="stylesheet">
    <script src="skdslider.min.js"></script>
    
     <div id="demo1">
        <div class="slide">
           <img height="285" src="slides/1.jpg" />
        </div>
        <div class="slide">
           <img height="285" src="slides/2.jpg" />
        </div>
        <div class="slide">
          <img height="285" src="slides/3.jpeg" />
        </div>
     </div>

**Javascript**

    $('#demo1').skdslider({
        slideSelector: '.slide',
        delay:5000,
        animationSpeed: 2000,
        showNextPrev:true,
        showPlayButton:true,
        autoSlide:true,
        animationType:'fading'
    });
    
Available options are:

<table class="option-table" width="90%" border="0" cellspacing="2" cellpadding="4" align="center">
  <tr bgcolor="#CCCCCC">
    <td><strong>Option</strong></td>
    <td><strong>Description</strong></td>
  </tr>
  <tr>
    <td>slideSelector</td>
    <td>Define your slide css selector. Default selector: .slide</td>
  </tr>
  <tr>
    <td>activeClass</td>
    <td>Define what class would be set as active class to the active slide. Defaul class name: active</td>
  </tr>
  <tr>
    <td>delay</td>
    <td>Delay duration between two  slides in micro seconds. Example: 5000</td>
  </tr>
  <tr>
    <td>animationSpeed</td>
    <td>Fading Speed in micro seconds. Example: 2000</td>
  </tr>
  <tr>
    <td>animationType</td>
    <td>fading/sliding - Default value is fading.</td>
  </tr>
  <tr>
    <td>showNav</td>
    <td>true/false - Default value is true. It will show/hide navigation icon</td>
  </tr>
  <tr>
    <td>numericNav</td>
    <td>true/false - Default value is false. If true, navigation will be numeric</td>
  </tr>
  <tr>
    <td>autoSlide</td>
    <td>true/false - Default value is true. Automatically start slideshow</td>
  </tr>
  <tr>
    <td>showNextPrev</td>
    <td>true/false - Default value is false. Either it will show next/prev button or not</td>
  </tr>
  <tr>
    <td>showPlayButton</td>
    <td>true/false - Default value is false. Either it will show play/pause button or not</td>
  </tr>
  <tr>
    <td>pauseOnHover</td>
    <td>true/false - Default value is false. Pause sliding on mouse hover</td>
  </tr>
    <tr>
    <td>stopSlidingAfter</td>
    <td> Default value is false. Other allowed values are 'all', 1,2,3..    If this properties is set, sliding will  automatically stop at the specified slide</td>
  </tr>
 <tr>
    <td>onMarkup</td>
    <td>It is a hooking function and will be invoked just before UI is generated. So it is possible to modify ui like navigiation layout without modify core file. (example: coming soon...) </td>
  </tr>

</table>
