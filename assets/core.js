  function Init(path){
    var assets_path,
      root,
      tag;
      is_desctop = 0;

    var old_screen_open = 0,
        old_is_small = 1;

      var m_left = 0, 
      m_top = 0;

      //scaling steps
      var size_photo = {
        2: 1.25,
        3: 1.6,
        4: 2.0,
        5: 2.6,
        6: 1.8
      }

      var size_photo_mobile = {
        2: 0.9,
        3: 1.3,
        4: 1.5,
        5: 1.9,
        6: 1.5
      }

      var offsetY, offsetX;
      var old_context, img_pos;
    
    //hostname to spin conservation
    var host = "3d-kub.ru";
    //control items
    var left_button, 
      right_button,
      up_button,
      down_button,
      plus_button,
      minus_button,
      fullscreen_button;

    var modal_is_created = false,
      mode_sceen_open = 0,
      window_size_trigger = true;

    //DOM objects
    var show_scene,
      show_scene_img,
      view_port,
      pane_scene,
      progress_cur,
      percent_of_progress,
      progress_bar_spin,
      helper_text,
      helper_block,
      container_preview;

    var download_status;

    var count_items,
      max_items,
      line,
      column,
      current_image = 0;

    //active categories
    var cat = ['rotate', 'transform', 'fragment'];

    var current_context,
      current_context_cat = 0;

    var status_show = 0;

    //var for animation
    var rotate      = false,
      scale       =  false;

    //basic object save status each category
    var helpStatus = {
      rotate:false,
      transform:false,
      scale:false
    }

    //slider for animate
    var animationSlide = {
      posList:[],
      current_pos:0
    }

    //flags for category. You can set default value of auto-slider 
    var animationInterval;
    var category_animation = {
      fragment: false,
      rotate: false,
      transform:false,

      speed_animation_rotate: 140,
      speed_animation_transform:300,
      speed_animation_fragment: 350,
    };

    //basic container for apply timer of show block-helper
    var interval_context;

    var getHelperDesc = function(){
      if(!is_desctop){
        return {
          'rotate':'Для вращения используйте прикосновение </br> или кнопки',
          'transform':'Для трансформации используйте прикосновение </br> или кнопки',
          'scale': 'Для масштабирования используйте прикосновение </br> или кнопки'
        }
      } else {
        return {
          'rotate':'Для вращения используйте </br> кнопки или мышку',
          'transform':'Для трансформации используйте </br> кнопки или мышку',
          'scale': 'Для масштабирования используйте </br> кнопки или колесо мышки'
        }
      }
    }

    //set basic object of time interval
    var updateMenu = {
      rotate : false,
      fragment: false,
      transform: false,
      counter_rotate:0,
      counter_fragment:0,
      counter_trans:0
    }

    //basic size in mode "one"
    var windowWidth = 600,
      windowHeight = 600;

    //value current image(column and line)
    var currentH = 0,
      currentW = 0;

    var old_y = 0,
      old_x = 0;

    var downloaded_counter=0;


    var toogleShow = function(){
      if(!status_show){
        show_scene.css('display','block');
        pane_scene.css('display','block');
      } else {
        show_scene.css('display','none');
        pane_scene.css('display','none');
      }
      status_show = status_show == 0?1:0;
    }


      var detectPlatform = function(){
          var userDeviceArray = [
                  {device: 'Android', platform: /Android/},
                  {device: 'iPhone', platform: /iPhone/},
                  {device: 'iPad', platform: /iPad/},
                  {device: 'Symbian', platform: /Symbian/},
                  {device: 'Windows Phone', platform: /Windows Phone/},
                  {device: 'BlackBerry', platform: /Mobile Safari/},
                  {device: 'Tablet OS', platform: /Tablet OS/},
                  {device: 'Linux', platform: /Linux/},
                  {device: 'Windows', platform: /Windows NT/},
                  {device: 'Macintosh', platform: /Macintosh/}
          ];

          var platform = navigator.userAgent;
          //console.info(platform);
          function getPlatform() {
                  for (var i in userDeviceArray) {
                      if (userDeviceArray[i].platform.test(platform)) {
                          return userDeviceArray[i].device;
                      }
                  }
                  return 'undefined';
          }

          var type = 0;
          
          switch(getPlatform()){
            case 'Windows': 
              type++
              break
            
            case 'Linux':
              type++
              break
            
            case 'Macintosh':
              type++;
              break
          }
          return type;
      }


      var changeModeWindow = function(i){
        scale = true;
        checkHelperWindow();
        
        if(i > 0){
          if(mode_sceen_open < 5) {
            mode_sceen_open ++;
          }

          if(!is_desctop && mode_sceen_open < 1){
            mode_sceen_open ++;
          }
          
          changeWindowSize(mode_sceen_open);
          
        } else {

          //stop double events
          if(is_desctop){
            if(mode_sceen_open == 0){
              return;
            }
          } else {
            if(mode_sceen_open == 1){
              return;
            }
          }

          if(mode_sceen_open > 0) { 
            mode_sceen_open --;
          }

          if(!is_desctop && mode_sceen_open < 1){
            mode_sceen_open ++;
          }

          changeWindowSize(mode_sceen_open);
        }
        updateButtonStatus();
      }


      var checkHelperWindow = function(run){
        var str;
        clearInterval(interval_context);

        if(current_context_cat == 'fragment'){
        //clearInterval(interval_context);
          return false;
        }

        if(run == undefined){

          if(rotate == true || scale ==  true) {
            helper_block.css({'display':'none'});
            clearInterval(interval_context);
          }

          if(helpStatus['scale'] == false && scale == true){
            helpStatus['scale'] = true;
          } else if(scale == false){
            str = getHelperDesc()['scale'];
          }

          if(helpStatus[current_context_cat] == false && rotate == true){
            helpStatus[current_context_cat] = true;
          } else if(rotate == false){
            str = getHelperDesc()[current_context_cat];
          }

          if(str != undefined){
            interval_context = setInterval(function(){
              helper_block.css({'display':'block'});
              helper_text.html(str);
              clearInterval(interval_context);
            }, 500);
          }

      } else {

        clearInterval(interval_context);
          if(helpStatus['scale'] == false){
            str = getHelperDesc()['scale'];
          }

          if(helpStatus[current_context_cat] == false){
            str = getHelperDesc()[current_context_cat];
          }

          if(str != undefined){
            interval_context = setInterval(function(){
              helper_block.css({'display':'block'});
              helper_text.html(str);
              clearInterval(interval_context);
            }, 500);
          }
      }

      }


      var setStartPosition = function(){
      var w_width = $(window)[0].innerWidth,
        w_height = $(window)[0].innerHeight;

      if(is_desctop){ 
        var marginTop = (( w_height / 2) - 600 / 2);
        var marginLeft = (( w_width / 2) - 600 / 2);

        show_scene.css('width', 600);
        show_scene.css('height', 600);

          show_scene.css('top', w_height / 2 - 600 / 2);
          show_scene.css('left', w_width / 2 - 600 / 2);
        } else {
        var marginTop = 0;
        var marginLeft = 0;

        show_scene.css('width', w_width);
        show_scene.css('height', w_height);

          show_scene.css('top', 0);
          show_scene.css('left', 0);

        }
      }


      var changeWindowSize = function(screen_open){ 
        if(window_size_trigger == false) {
          return;
        } else  window_size_trigger = false;

      var w_width = $(window)[0].innerWidth,
        w_height = $(window)[0].innerHeight;

      routeBindEvents(screen_open);

        if(screen_open == 0) {
          var width = 600,
            height  = 600;

          show_scene_img.fadeOut(0);

          if(is_desctop){
            if(current_context_cat == 'fragment'){
              height = 552;
            }
          }

        show_scene_img.animate({
          height: '100%',
          width: 'auto',
          'margin-top':0,
          'margin-left':0
        }, 210).fadeIn(20);


        show_scene.animate(
          { 
            'top': w_height/2 - 600/2,
            'left': w_width/2 - 600/2,
            'width': width,
            'height': height,
          }, 200);


        } else if(screen_open == 1){
          uploadImageQuality();
        
        show_scene_img.css({
          'margin-top':0,
          'margin-left':0
        });
      
        show_scene.animate(
          {
            'width' :w_width,
            'height':w_height, 
            'left':0,
            'top':0
          }, 200);
    
        bindMouseMoveZoom();
        } else if(screen_open >= 2){
          bindMouseMoveZoom();
          zoomImage(screen_open);
        }

      imageChangeSizeAnimate(current_image);    
        
        if(current_context_cat == 'fragment'){
          if(!is_desctop){
            container_preview.css('visibility', 'hidden');
            } else {
            container_preview.css('visibility', 'visible');
          }
        } else {
          container_preview.css('visibility', 'hidden');
        }
      }


      var bindMouseMoveZoom = function(){   
        if(is_desctop){
          show_scene_img.unbind('mousemove');
          show_scene_img.bind('mousemove', function(e){
          offsetY = e.offsetY;
          offsetX = e.offsetX;
        });
        } 
      }


      var zoomImage = function(screen_open){

      var w_width = $(window)[0].innerWidth,
        w_height = $(window)[0].innerHeight;

      if(is_desctop){
        if(current_context_cat == 'fragment'){
          w_height -= 200;
        } else {
          w_height -= 100;
        }
      } 

        var w = show_scene_img.width();
        var h = show_scene_img.height();
        
        var size = is_desctop !=0 ? size_photo[screen_open]:size_photo_mobile[screen_open]; 

        var height = w_height * size;
        var width = w / h * height;

        var w_offset = 0,
          h_offset = 0;

        if(width > w_width || height > w_height){

          w_offset = width - w_width;
          h_offset = height - w_height;

          var coeff_top = 0;        

          if(h_offset > 0 || w_offset > 0){

            var _top =  parseInt(show_scene_img.css('margin-top') );
            var _top_origin = _top;
            var _offset_h = offsetY + _top;

            var m_coeff_top = _top > 0 ? _top: 0;


            var top_part = ( Math.abs(offsetY - m_coeff_top) / h).toFixed(3);
            
            var top_offset = h_offset;

            var _left =  parseInt( show_scene_img.css('margin-left') );
            var _left_origin = _left;
            var left_part = (offsetX / w).toFixed(2);
            var left_offset = w_offset;


          var _center_top = _top_origin + (w_height / 2);
          var _center_left = _left_origin + (w_width / 2);
          

          _top =  ( _center_top ) - (height * top_part); 
          _left = ( _center_left ) - (width * left_part); 
            
          if(_top > 0) _top = 0;          
          if(-h_offset > _top) {
            _top = -h_offset; 
          }

          var coeff = w_width - width;
          if(_left < coeff) _left = w_width - width;
          if(_left > 0) _left = 0;


          var interval = mode_sceen_open > 2 ? 360: 320;

          if(w_width - width < 0){  
            show_scene_img.animate(
              { 'margin-left': _left,
                'margin-top': _top,
                height: height,
                width:'auto'
              }, interval);     
          } else {
            show_scene_img.animate(
              { 
                'margin-left':0,
                'margin-top': _top,
                height: height,
                width:'auto'
              }, interval);                     
          }
          show_scene_img.css({ width:'auto' });
          }
        }
        old_screen_open = screen_open;
    }


      //create basic structure
    var initModalWindow = function(){
      var self=this;
      var w_width = $(window).width(),
        w_height = $(window).height();

      var marginTop = (( w_height / 2 ) - 600 / 2);
      var marginLeft = (( w_width / 2 ) - 600 / 2);

      $('body').append(
        '<div class="pane_scene_3d"></div>');


      $('.pane_scene_3d').append(
        '<div class="view_wrap_3d"></div>');

      $('.view_wrap_3d').append(
        '<div class="show_scene_3d"></div>');

      $('.show_scene_3d').append(
        '<div class="close_show_scene_3d">X</div>'
        );

      $('.show_scene_3d').append(
        '<div class="menu_3d"><ul>'+
            '<li class="rotate"><img src="" alt="rotation"/><p>Вращение</p></li>'+
            '<li class="transform"><img src="" alt="transformation"/><p>Трансформация</p></li>'+
            '<li class="fragment"><img src="" alt="fragments"/><p>Фрагменты</p></li>'+
        '</ul></div>'
        );
      


      $('.show_scene_3d').append('<div class="view_port_3d"><img class="slide_img" align="middle" src="#"></div>');


      $('.view_port_3d').append('<div class="progress_bar_spin_3d" margin-top:-40%;style="width:80%;height:20px;background:#000;position:absolute;">'+
        '<p style="color:#ffe;position:absolute;margin:auto;margin-left: 47%;">0%</p>' +
        '<div class="progress_cur_3d" style="width:100%;background:rgba(10, 10, 10, 0.8);height:100%;">'+
        '</div></div>');


      $('.show_scene_3d').append('<div class="helper_3d"><p></p></div>');

      $('.view_wrap_3d').append('<div class="spin_info_3d"><span class="spin_info_desc_3d">Powered by <a target="_blank" href="http://' + host + '">' + host + '</a></span></div>');


      $('.show_scene_3d').append(
        '<div class="buttons_3d"><div class="button_container_3d">'+
          '<button class="left_button_3d"></button>'+
          '<button class="right_button_3d"></button>'+
          '<button class="up_button_3d"></button>'+
          '<button class="down_button_3d"></button>'+
          '<button class="plus_button_3d"></button>'+
          '<button class="minus_button_3d"></button>'+
          '<button class="fullscreen_button_3d"></button>'+
        '</div></div>'
        );


      $('.show_scene_3d').append(
        '<div class="container_preview_3d"></div>'
        );

      $('.buttons_3d button').css('margin-top','5px');

      $('.view_wrap_3d').append(
        '<div class="slider_3d">'+
        '</div>'
        );

      bindControllerButtom();

      helper_text   = $('.pane_scene_3d .helper_3d p');
      helper_block  = $('.pane_scene_3d .helper_3d');
      show_scene    = $('.pane_scene_3d .show_scene_3d');
      show_scene_img  = $('.pane_scene_3d .slide_img');
      pane_scene    = $('.pane_scene_3d');
      view_port     = $('.pane_scene_3d .view_port_3d');

      progress_cur    = $('.pane_scene_3d .progress_cur_3d');
      progress_bar_spin   = $('.pane_scene_3d .progress_bar_spin_3d');
      percent_of_progress = $('.pane_scene_3d .progress_bar_spin_3d p');
      container_preview   = $('.pane_scene_3d .container_preview_3d');

      if(!is_desctop){
        //stub for fix problem with sampling image
        $('.button_container_3d button').css('width', 33);
        $('.menu_3d').css('zoom', 1.1);
        helper_block.css('zoom', 1.6);
        $('.button_container_3d').css({
          'zoom': 1.2,
        });
      }

      $('.pane_scene_3d .view_wrap_3d').bind('contextmenu', function(i){ 
      //  i.preventDefault();
        //  $('.spin_info_3d').css('display', 'block');
      });

      $('.view_wrap_3d').click(function(){
        $('.spin_info_3d').css('display', 'none');
      });

      $('.view_wrap_3d').bind('mousedown' ,function(e){
          if(  
            (e.target.className == 'close_show_scene_3d' ||
            e.target.className == 'view_wrap_3d' )
            ) {
              $('.spin_info_3d').css('display', 'none');
              toogleShow();
          }
      });


      //set height and width for spin box
      setStartPosition();

      if('onwheel' in document){
        show_scene.bind('wheel', onWheel);
        show_scene_img.bind('wheel', wheelZoom);
      } else if('onmousewheel' in document){
        show_scene.bind('mousewheel', onWheel);
        show_scene_img.bind('mousewheel', wheelZoom);
      } else {
        show_scene.bind('MozMousePixelScroll', onWheel);
        show_scene.bind('onmousewheel', onWheel);
        show_scene_img.bind('onmousewheel MozMousePixelScroll', wheelZoom);
      }


      function onWheel(e) {
        e = e.originalEvent;
        var delta = (e.deltaY || e.detail || (e.wheelDelta)) > 0?-1:1;
        if(window_size_trigger == true) {
          changeModeWindow(delta);
        }
      }


      function wheelZoom(e) {
        e = e.originalEvent;
        offsetY = e.clientY;
        offsetX = e.clientX;
      }


      $('.menu_3d ul li').click(function(i){
        current_context_cat = $(i)[0].currentTarget.className.match(/(\w*)/)[0];        
        changeMenuContext();
        i.preventDefault();
      });

      $('.menu_3d ul li').hover(function(i){
        var data = $(i)[0].currentTarget.className.match(/(\w*)/)[0];       
        $('.menu_3d .'+data).find('p').css('display', 'inline-block');

        if(!is_desctop){
          setTimeout(function(){
            $('.menu_3d .'+data).find('p').css('display', 'none');
          }, 800);
        }
      });

      $('.menu_3d ul li').mouseleave(function(i){
        var data = $(i)[0].currentTarget.className.match(/(\w*)/)[0];       
        $('.menu_3d .'+data).find('p').css('display', 'none');
      });

      document.onkeydown = function(event){
        events = event || window.event;

        switch(events.keyCode){
          case 27:
            if(status_show) $('.close_show_scene_3d').mousedown();
          break;

          case 109:
            screenMode('-');
          break;

          case 107:
            screenMode('+');
          break;

          case 39:
            eventManager(1, 0);
          break;

          case 37:
            eventManager(-1, 0);
          break;
        }
      }
    
      bindResizeEvent();
      modal_is_created = true;
    }


    var routeBindEvents = function(num_target){
      var is_mobile = detectPlatform() == 0 ? true:false;

      if(num_target == 0){
        //if(is_desctop){
          removeMouseMove();
          removeSliderMouseMove();
        //} else {
          removeTouchMove();
          removeSliderTouchMove();
        //}
        
        if(current_context_cat == 'fragment'){
          if(!is_desctop) {
            bindSliderTouchMove();
          }
        } else {
            if(is_desctop){     
              bindSliderMouseMove();
              //bindMouseMove();
            } else {
              //bindTouchMove();
              bindSliderTouchMove();
            }
          }
        
      

      } else if(num_target == 1){
        
        removeMouseMove();
        removeSliderMouseMove();
        removeTouchMove();
        removeSliderTouchMove();
        

        if(current_context_cat == 'fragment'){
          if(!is_desctop){    
            bindSliderTouchMove();
          }
        } else {
          if(is_desctop){   
            //bindMouseMove();
            bindSliderMouseMove();
          } else {
            //bindTouchMove();
            bindSliderTouchMove();
          }
        }


      } else {
        removeSliderMouseMove();
        removeSliderTouchMove();
        removeTouchMove();
        removeMouseMove();

        if(is_desctop){   
          //bindMouseMove();
          bindMouseMove();
        } else {
          //bindTouchMove();
          bindTouchMove();
        }     
        //bindMouseMove();
      }
    }


    var bindSliderMouseMove = function(){
      show_scene_img.bind('mousedown', mouseSliderMove);
    }

    var removeSliderMouseMove = function(){
      show_scene_img.unbind('mousedown');
      //show_scene.unbind('mousemove');
    }

    var bindSliderTouchMove = function(){
      show_scene_img.bind('touchstart', touchSliderMove);
    }


    var removeSliderTouchMove = function(){
      show_scene_img.unbind('touchstart');
    } 

    //drag end drop
    var bindTouchMove = function(){
      show_scene_img.bind('touchmove', touchMove);
      show_scene_img.bind('touchstart', touchStart);
    }


    var removeTouchMove = function(){
      show_scene_img.unbind('touchmove', touchMove);
      show_scene_img.unbind('touchstart');      
    }

    //-----
    var bindMouseMove = function(){
      show_scene_img.bind('mousedown', mouseMove);
    }


    var removeMouseMove = function(){
      console.log('remove .. ');
      show_scene_img.unbind('click');
    }


    var mouseSliderMove = function(e){
        e.preventDefault();
        runAnimate(false);

        old_x = e.offsetX;
        old_y = e.offsetY;

        show_scene.bind('mousemove', function(i){

          var pos_x = 0,
            pos_y = 0;

          if(current_context_cat == 'rotate'){
            if(old_x - i.offsetX >= 30) {
              pos_x = 1;
              old_x = i.offsetX;
            } else if(old_x - i.offsetX <= -30) {
              pos_x = -1;
              old_x = i.offsetX;
            }

            if(old_y - i.offsetY >=  40) {
              pos_y = 1;
              old_y = i.offsetY;
            } else if(old_y - i.offsetY <= -40) {
              pos_y = -1;
              old_y = i.offsetY;
            }
          } else {
            if(old_x - i.offsetX <= -30) {
              pos_x = 1;
              old_x = i.offsetX;
            } else if(old_x - i.offsetX >= 30) {
              pos_x = -1;
              old_x = i.offsetX;
            }

            if(old_y - i.offsetY <=  -40) {
              pos_y = 1;
              old_y = i.offsetY;
            } else if(old_y - i.offsetY >= 40) {
              pos_y = -1;
              old_y = i.offsetY;
            }
          }

          sliderController(pos_x, pos_y, true);
        });

        show_scene.bind('mouseup', function(){
          $(this).unbind('mousemove');
        });

        show_scene.bind('mouseleave', function(){
          $(this).unbind('mousemove');
        });

        show_scene.bind('mouseup', function(){
          $(this).unbind('mousemove');
        });
    }


    var touchSliderMove = function(e){
      e.preventDefault();
      runAnimate(false);

      old_x = e.originalEvent.touches[0].clientX;
      old_y = e.originalEvent.touches[0].clientY;

      show_scene.bind('touchmove', function(i){       
        var pos_x = 0,
          pos_y = 0;
        
        i = i.originalEvent.touches[0];

        if(i.x == undefined || i.y == undefined){
          i.x = i.clientX;
          i.y = i.clientY;
        }

        if(current_context_cat == 'rotate'){
          if(old_x - i.x >= 30) {
            pos_x = 1;
            old_x = i.x;
          } else if(old_x - i.x <= -30) {
            pos_x = -1;
            old_x = i.x;
          }

          if(old_y - i.y >= 40) {
            pos_y = 1;
            old_y = i.y;
          } else if(old_y - i.y <= -40) {
            pos_y = -1;
            old_y = i.y;
          }
        } else {
          if(old_x - i.x <= -30) {
            pos_x = 1;
            old_x = i.x;
          } else if(old_x - i.x >= 30) {
            pos_x = -1;
            old_x = i.x;
          }

          if(old_y - i.y <= -40) {
            pos_y = 1;
            old_y = i.y;
          } else if(old_y - i.y >= 40) {
            pos_y = -1;
            old_y = i.y;
          }
        }

        sliderController(pos_x, pos_y, true);
      });

      show_scene.bind('touchend', function(){
        $(this).unbind('touchmove');
      });
    }


    //drag and drop
    var mouseMove = function(e){
      e.preventDefault();

      $(this).bind('mousemove', function(e){
        console.info(e.originalEvent);
        var data = e.originalEvent;

        if(data.x == undefined || data.y == undefined){
          data.x = data.layerX;
          data.y = data.layerY;
        }
        
        var _w = parseInt( show_scene_img.css('margin-left') );
        var _h = parseInt( show_scene_img.css('margin-top') );
        var offset_w = _w;
        var offset_h = _h;
        
        _h += data.y - mouseMoveBase.y; 
            _w += data.x - mouseMoveBase.x;

        var height_img  = show_scene_img.height(),
          view_height = $('.view_port_3d').height(),
          width_img   = show_scene_img.width(),
          view_width  = $('.view_port_3d').width();


            
            var status = _w < offset_w ? 0: 1;
            var value_w = ( view_width - width_img );
            var border_w = width_img - view_width;
     
        if( ( (offset_w > -border_w) || status)  && (( offset_w <= 0 ) || !status ) ){
              show_scene_img.css({
                'margin-left':_w, 
              });

              mouseMoveBase.set(data);
          }


        var value_h = ( view_height - height_img );
        status = _h < offset_h ? 0: 1;
        var border_h = height_img - view_height;

        if( ( (offset_h > -border_h) || status)  && (( offset_h <= 0 ) || !status ) ){
              show_scene_img.css({
                'margin-top':_h, 
              });
              mouseMoveBase.set(data);
          }

      });

      var mouseMoveBase = {
          set: function(point) {
                  this.x = point.x;
                  this.y = point.y;
              }
      }

      mouseMoveBase.set(e.originalEvent);
      
      show_scene_img.bind('mouseup', function(){
        $(this).unbind('mousemove');
        $(this).unbind('mouseup');
      });
    }


    var touchMoveBase = {
        set: function(point) {
                this.x = point.clientX;
                this.y = point.clientY;
            }
    }


    var touchStart = function(e){
      event.preventDefault();
      console.info(e);
      touchMoveBase.set(e.originalEvent.touches[0]);
    }


    var touchMove = function(e){
      e.preventDefault();

      var data = e.originalEvent.touches[0];
      var _w = parseInt( show_scene_img.css('margin-left') );
      var _h = parseInt( show_scene_img.css('margin-top') );
      
      var offset_w = _w,
        offset_h = _h;
      
      _h += data.clientY - touchMoveBase.y; 
          _w += data.clientX - touchMoveBase.x;

      var height_img  = show_scene_img.height(),
        view_height = $('.view_port_3d').height(),
        width_img   = show_scene_img.width(),
        view_width  = $('.view_port_3d').width();
          
          var status = _w < offset_w ? 0: 1;
          var value_w = ( view_width - width_img );
          var border_w = width_img - view_width;
   
      if( ( (offset_w > -border_w) || status)  && (( offset_w <= 0 ) || !status ) ){
            show_scene_img.css({
              'margin-left':_w, 
            });

            touchMoveBase.set(data);
        }

      var value_h = ( view_height - height_img );
      status = _h < offset_h ? 0: 1;
      var border_h = height_img - view_height;

      if( ( (offset_h > -border_h) || status)  && (( offset_h <= 0 ) || !status ) ){
            show_scene_img.css({
              'margin-top':_h, 
            });
            touchMoveBase.set(data);
        }
    }

    
    var moveImage = function(x, y){
      var m_l = parseInt( show_scene_img.css('margin-left') );
      var m_t = parseInt( show_scene_img.css('margin-top') );

      m_left = m_l + parseInt(x) * 5;
      m_top = m_t  + parseInt(y) * 5;
      console.log(x + ' : ' + y);
      show_scene_img.css({'margin-left': m_left, 'margin-top': m_top});
    }


    var changeMenuContext = function(){
      container_preview.html('');
      
      if(mode_sceen_open >= 2 && aim[current_context].data_download[current_context_cat][0].quality != true){
        uploadImageQuality();
      } else {
        show_scene_img.attr('src', aim[current_context].data_download[current_context_cat][0].src);
      }

      $('.active_menu_cat').removeClass('active_menu_cat');
      $('.'+current_context_cat).addClass('active_menu_cat');

      current_image = 0;
      currentW = 0;
      currentH = 0;
      
      count_items = aim[current_context][current_context_cat].count;
      max_items   = aim[current_context].data_download[current_context_cat + '_count'];
      column = Math.floor( max_items / count_items ) - 1;
      line   = Math.ceil(max_items / Math.floor( max_items / count_items )) - 1;  

      updateButtonStatus();
      
      if(current_context_cat == 'fragment'){
        container_preview.css('margin-left', 0);
        for(var i=0; i<aim[current_context].data_download[current_context_cat].length; i++){
          var img = aim[current_context].data_download[current_context_cat][i];
          if(i == 0){
            container_preview.append('<div><image class="hidden_image_3d active_image_3d" data-n-tag="'+i+'" src="'+ img.src +'"></img></div>');
          } else {
            container_preview.append('<div><image class="hidden_image_3d" data-n-tag="'+ i +'" src="'+ img.src +'"></img></div>');
          }
        }


        setTimeout(function(){
          $('.container_preview_3d .hidden_image_3d').click(function(i){
            var number = parseInt( $(this).attr('data-n-tag') );

            if($(i).hasClass('active_image_3d') == false){
              $('.container_preview_3d img').each(function(i){
                $(this).removeClass('active_image_3d');
                $(this).addClass('hidden_image_3d');
              });

              if(number > aim[current_context].data_download['count_'+current_context_cat]) number -=1;
              current_image = number;
              currentW = number;
              moveSlider(number);


              show_scene_img.attr('src', aim[current_context].data_download[current_context_cat][number].src);
              show_scene_img.css({'margin-top':0, 'margin-left':0});
              //set task upload full-size image
              uploadImageQuality();

              updateButtonStatus();
              changeWindowSize(mode_sceen_open);

              $(this).removeClass('hidden_image_3d');
              $(this).addClass('active_image_3d');  
            }
          });
        }, 50);
      }

      helper_block.css({'display':'none'});
      if(current_context_cat != 'fragment') {
      
        if( category_animation[current_context_cat] == true || 
          aim[current_context][current_context_cat].animate == false
          ){
          checkHelperWindow(true);
        }

      } else helper_block.css({'display':'none'});

      changeWindowSize(mode_sceen_open);
      runAnimate();
    }


    var getSizeImage = function(n){
      var img;
      var _width, _height;
      var coef_w, coef_h;
      
      img = aim[current_context].data_download[current_context_cat][n];
      _width =  img.naturalWidth,
      _height=  img.naturalHeight;

      var coef_w =  parseFloat(_width / _height);
      return parseFloat(100 * coef_w);
    }


    var end = 1, border = 1;

    var moveSlider = function(n){
      if( n == end ) return;

      var c_number = aim[current_context].data_download[current_context_cat].length;
      var counter_line = 0;
      var counter_offset = 0;
      var current_img_width = 0;

      current_img_width += getSizeImage(n);


      var mediana_number = 0, mediana_right_number = 0;
      var data = 0,
        data_right = 0;

      var max_len = 0;


      //left border
      for(var i = 0; i <= c_number - 1; i++){
        if(data >= 300 && mediana_number == 0){
          mediana_number = i;
        } else if(mediana_number == 0){
          data += getSizeImage(i);
        }
      }

      data = 0;
      for(var i=0; i<= mediana_number - 1; i++){
        data += getSizeImage(i);
      }
      //--


      //right border
      for(var i = c_number - 1; i >= 0; i--){
        if(data_right >= 300 && mediana_right_number == 0){
          mediana_right_number = i;
        } else if(mediana_right_number == 0){
          data_right += getSizeImage(i);
        }
      }

      data_right = 0;
      for(var i=0; i<= mediana_right_number - 1; i++){
        data_right += getSizeImage(i);
      }
      //--


      //total length
      for(var i=0; i<= c_number - 1; i++){
        max_len += getSizeImage(i);
        max_len += 8;
      }


      var mediana_left = data - getSizeImage(mediana_number);

      if(300 < mediana_left){
        mediana_left = mediana_left - 300;
      } else {
        mediana_left = 300 - mediana_left;
      }

      var mediana_right = getSizeImage(mediana_number) - mediana_left;
      var distance = 0;
      var new_position = 0;


      var margin_left = parseInt( container_preview.css('margin-left') );

      if(end < n){

        if(mediana_number < n ){
          for(var i = mediana_number; i<n; i++){
            distance += getSizeImage(i);

          }
        } else {
          for(var i = n - 1; i>=mediana_number; i++){
            distance += getSizeImage(i);
          } 
        }

        distance += parseInt(getSizeImage(n) / 2);
        new_position = margin_left + -distance;


        if(new_position < -max_len) {
          var data = 0;

          for(var i=n; i<=c_number - 1; i++){
            data += getSizeImage(i);
          }
          new_position = -max_len;
        }  else {
          new_position = margin_left + -distance;
        }
      
      } else {

        if(mediana_right_number < n ){
          for(var i = mediana_right_number; i<n; i++){
            distance += getSizeImage(i);
          }

          var length = 0;
          for(var i = n; i <= c_number - 1; i ++){
            length += getSizeImage(i);
          }

          distance += getSizeImage(n) / 2;
          new_position = -max_len;

        } else {

          if(mediana_right_number > n){
            for(var i = mediana_right_number; i>n; i--){
              distance += getSizeImage(i);
            } 
            distance += mediana_right;
          } else {
            for(var i = n - 1; i>mediana_right_number; i--){
              distance += getSizeImage(i);
            } 
            distance += mediana_left;
          }
          
          distance += getSizeImage(n) / 2;

          var _lenght = 0;
          for(var i=0; i<n; i++) _lenght += getSizeImage(i);

          if(_lenght > 300){
            new_position += (margin_left + distance); 

            if(new_position >= 0){
              _lenght = 0;
              for(var i=0; i<=mediana_right_number; i++) _lenght += getSizeImage(i);

              new_position = new_position -  ( (_lenght - distance)) - 150;
            }
          } else {
            new_position  = 0;
          }
        }
        
        if(new_position > 0 ) new_position = 0;
      }
  
      
      container_preview.animate({'margin-left': new_position }, 250);
      end = n;
    }


    var openView = function(){
      var self = this;
      if(!modal_is_created) initModalWindow();
    } 


    function sliderController(x, y, is_slider){     
      currentW = currentW + parseInt(x);
      currentH = currentH + parseInt(y);
      var t=0;

      if(is_slider == undefined){
        if(current_context_cat == 'rotate'){

          if(currentW < 0){
            currentW =  line - currentW - 1;
          } else if(currentW > line ){
            currentW = currentW - line - 1; 
          }

          if(currentH <= 0){
            currentH = 1;
          } else if(currentH > column){
            currentH = column + 1;
          }   

          var coeff =  line - currentH;
          t = (currentW - coeff) + (currentH * line - 1);
      
        } else {
          if(currentW < 0){
            currentW = 0;
          } else if(currentW  > line) currentW = line;
          
          t  =  currentW; 
        }
      } else {
        if(current_context_cat == 'rotate'){

          if(currentW < 0){
            currentW =  line - currentW - 1;
          } else if(currentW > line ){
            currentW = currentW - line - 1; 
            console.log(currentW);
          }

          if(currentH <= 0){
            currentH = 1;
          } else if(currentH > column){
            currentH = column + 1;
          }   


          var coeff =  (line) - currentH;
          
          t = (currentW - coeff) + (currentH * line - 1);
        
        } else {

          if(currentW < 0){
            currentW =  0;
          } else if(currentW > line){
            currentW --;
            return false;
          }
          t = currentW;         
        }
      }

      if(is_slider){
        rotate = true;
        checkHelperWindow();
      }

      if(current_image != t){
        current_image = t;
      } else return;

      if(current_context_cat == 'fragment') {
        $('img[data-n-tag = '+ current_image +']').click();
      } else if(mode_sceen_open == 0){
        show_scene_img.attr('src', aim[current_context].data_download[current_context_cat][current_image].src );
      }

      updateButtonStatus();

        if(mode_sceen_open > 0){
          uploadImageQuality();
          return;
        }

      imageChangeSize(current_image);
    }


    var bindControllerButtom = function(){
      left_button = $('.left_button_3d');
      right_button = $('.right_button_3d');
      up_button = $('.up_button_3d');
      down_button = $('.down_button_3d');
      plus_button = $('.plus_button_3d');
      minus_button = $('.minus_button_3d');
      fullscreen_button = $('.fullscreen_button_3d');

      left_button.bind('click', function(){
        eventManager(-1, 0);
      });

      right_button.bind('click', function(){
        eventManager(1, 0);
      });

      up_button.bind('click', function(){
        eventManager(0, -1);

      });

      down_button.bind('click', function(){
        eventManager(0, 1);

      });

      plus_button.bind('click', function(){
        screenMode('+');
      });

      minus_button.bind('click', function(){
        screenMode('-');
      });

      fullscreen_button.bind('click', function(){
        screenMode('full');
      });
    }


    var screenMode = function(data){
      console.log('enabled');
      scale = true;
        checkHelperWindow();
      
      switch(data){
        case '+':
          if(mode_sceen_open < 3)
          mode_sceen_open ++;
        break;

        case '-':
          if(mode_sceen_open > 0)
          mode_sceen_open --;
        break;
      }


      if(data == '+' && mode_sceen_open <= 3){
        plus_button.css('opacity', 1);
      } else {
        plus_button.css('opacity', 0.7);
        
      }

      if(data == '-' && mode_sceen_open > 0){
        minus_button.css('opacity', 1);
      } else if(data == '-' && mode_sceen_open <= 1){
        minus_button.css('opacity', 0.7); 
      }

      if(data == 'full'){
        if(is_desctop){
          if(mode_sceen_open > 0 && is_desctop == 1) {
            mode_sceen_open = 0;
          } else if(mode_sceen_open <= 0) {
            mode_sceen_open = 1;
          }
        } 
      }

        if(!is_desctop) {
          mode_sceen_open = mode_sceen_open == 0?1:mode_sceen_open;         
        } 
        updateButtonStatus();
      changeWindowSize(mode_sceen_open);
    }


    var eventManager = function(x, y, type){
      if(download_status == true) return;
      runAnimate(false);

      var status = sliderController(x, y, true);

      //same staff...
    }


    var imageChangeSize = function(){
      var w_width = $(window)[0].innerWidth,
        w_height = $(window)[0].innerHeight;

      var view_wrap_w = w_width,
        view_wrap_h = w_height;   
      
      if(mode_sceen_open == 0){
        var _h = 550,
          _w = 600;

        if(current_context_cat == 'fragment'){
          if(!is_desctop){
          } else {
            _h = 400,
            _w = 600;
            container_preview.css('visibility', 'visible');
          }
        } else {
          container_preview.css('visibility', 'hidden');
        }

        view_port.css(
          { 
            'height':_h,
            'width':_w,
          }); 

        show_scene_img.css({
          height: '100%',
          width:'auto'
        });

      } else if(mode_sceen_open == 1){

        if(current_context_cat == 'fragment'){
          if(!is_desctop){} else {
            w_height-= 201;
            container_preview.css('visibility', 'visible');
          }
        } else {
          w_height-= 50;
          container_preview.css('visibility', 'hidden');
        } 

        if(is_desctop){
          if(w_height > w_width){         
            
            var coeff_w = view_wrap_w / view_wrap_h;
            var coeff_h = view_wrap_h / view_wrap_w;

            view_port.css(
            { 
              height: w_height * coeff_w,
              width:'auto'
            });
          
            show_scene_img.css({
              height: w_height * coeff_w,
              width:'auto'
            });

          } else {        
            view_port.css(
            { 
              height: w_height,
              width:'auto'
            });

            show_scene_img.css({
              height: w_height,
              width: 'auto'
            });
          }

        } else {
          if(current_context_cat == 'fragment'){
            if(!is_desctop){} else {
              container_preview.css('visibility', 'visible');
              w_height-= 201;
            }
          } else {
            w_height-= 50;
          } 

          view_port.css(
          { 
            'height': w_height,
            'width':'100%'
          }); 

          show_scene_img.css({
            'margin-left':0,
            'margin-top':0
          });

          if(view_wrap_w < w_height){
            show_scene_img.animate({
              'margin-top':  - (view_wrap_w - w_height) / 2,
            }, 100);  
          }

        }
      } else {
        var top_offset = 0;
        if(current_context_cat == 'fragment'){
          if(!is_desctop){} else {
            container_preview.css('visibility', 'visible');
            w_height-= 201;
          }
        } else {
          w_height-= 50;
        } 

        show_scene_img.css({
          'margin-left':0,
          'margin-top':top_offset,
        });

        view_port.css(
        { 
          'height': w_height,
          'width':'auto'
        });
      }
    }


    var imageChangeSizeAnimate = function(val){


      var w_width = $(window)[0].innerWidth,
        w_height = $(window)[0].innerHeight;

      var view_wrap_w = w_width,
        view_wrap_h = w_height;
      

      if(mode_sceen_open == 0){
        var _h = 550,
          _w = 600;

        if(current_context_cat == 'fragment'){
          if(!is_desctop){} else {
            _h = 400;
            _w = 600;
          }
        } 

        view_port.animate(
          { 
            'height':_h,
            'width':_w
          }, 200);

      } else if(mode_sceen_open == 1){
        if(current_context_cat == 'fragment'){
          if(!is_desctop){
            w_height-= 50;
          } else {
            w_height-= 201;
          }
        } else {
          w_height-= 50;
        } 
      
        if(is_desctop){
          if(w_height > w_width){         
            var coeff_w = view_wrap_w / view_wrap_h;
            var coeff_h = view_wrap_h / view_wrap_w;

            view_port.animate(
            { 
              'height': w_height * coeff_w,
              'width':'auto',
            }, 100);

            if(!is_desctop){
              view_port.css(
                { 
                  'margin-top': 100
                });           
            }

            $(show_scene_img).css({
              height: w_height * coeff_w,
              width: 'auto'
            });

          } else {
            
            view_port.css(
            { 
              height: w_height,
              width:'auto',
              'margin-top': 0,
              'margin-left':0
            });

            show_scene_img.css({
              height: '100%',//w_height,
              width: 'auto',
              //'margin-left':0,
              //'margin-top':0
            });
          }
    
        } else {

          show_scene_img.stop();  
          show_scene_img.finish();

          show_scene_img.css({
            'height': 'auto',
            'width': w_width
          });

          view_port.css(
          { 
            'height':w_height,
            'width':w_width
          });


          var offset_top = (( view_wrap_h - 50 ) - ( show_scene_img.height() )) /2;
          show_scene_img.css({
            'margin-top': offset_top
          }); 
        }
      } else {  
        //setTimeout(function(){
          if(!is_desctop){
            /*view_port.animate(
              { 
                'margin-top': 0
              }, 1000);           
          */
          }

          if(current_context_cat == 'fragment'){
            if(!is_desctop){
              w_height-= 50;
            } else {
              w_height-= 200;
            }
          } else {
            w_height-= 50;
          }

          view_port.animate(
          { 
            'height': w_height,
            'width':'auto'
          }, 300);
        //}, 220);
      }

      setTimeout(function(){
        window_size_trigger = true;
      }, 240);
    }

    var getCorrectSlash = function(){
      var os = 0;
      if (navigator.userAgent.indexOf ('Windows') != -1) os = 1;
      if (navigator.userAgent.indexOf ('Linux')!= -1) os = 2;
      if (navigator.userAgent.indexOf ('Mac')!= -1) os = 3;
      if (navigator.userAgent.indexOf ('FreeBSD')!= -1) os = 4;
      var slash = '/';
      // alert(navigator.userAgent);
      switch (os) {
         case 1:
            slash = '\/';
            break;
         case 2:
            break;
         case 3:
            break;
         case 4:
            break;
         default:
            break;
      }

      return slash; 
    }

    var bindResizeEvent = function(){
      $(window).resize(function(){
        console.log('bind resize');

        console.info(current_context_cat);
        var img = aim[current_context].data_download[current_context_cat][0];
        var _w = img.naturalWidth;
        var _h = img.naturalHeight;

        w_width = $(window)[0].innerWidth;
        w_height = $(window)[0].innerHeight;

        var view_wrap_w = w_width,
          view_wrap_h = w_height;


        var offset_height = 550;

        if(current_context_cat == 'fragment'){
          if(!is_desctop){} else {
            offset_height = 448;
          }
        } 

        if(mode_sceen_open == 0){
          
          show_scene.css('width', 600);
          show_scene.css('height', 600);
          //show_scene.css('margin', 'auto');
          view_port.css(
            { 
              'height':offset_height,
              'width':600,
            });

          show_scene_img.css({
            'height': '100%'
          });

          show_scene.css({
            'top': view_wrap_h/2 - 600/2,
            'left': view_wrap_w/2 - 600/2,
          });           

        } else if(mode_sceen_open == 1){
          if(is_desctop){
              if(current_context_cat == 'fragment'){
                if(!is_desctop){} else {
                  w_height-= 201;
                }
              } else {
                w_height-= 50;
              } 
            
            show_scene.css(
              {
                'width' :view_wrap_w,
                'height':view_wrap_h, 
              });


            if(w_height>w_width){         
              
              var coeff_w = view_wrap_w / view_wrap_h;
              var coeff_h = view_wrap_h / view_wrap_w;

              view_port.css(
              { 
                'height': w_height * coeff_w,
                //'width':'auto',
                'width' : view_wrap_w,
              });
        
              show_scene_img.css({
                'height': w_height * coeff_w
              });

            } else {        
              view_port.css(
              { 
                'height': w_height,
                //'width':'auto'
                'width' : view_wrap_w
              });

              show_scene_img.css({
                'height': w_height
              });
            }
          } else {
            view_port.animate(
            { 
              'height':w_height,
              'width':w_width
            }, 100);

            show_scene_img.css({
              'height': 'auto',
              'width': w_width
            }); 

            var offset_top = (( view_wrap_h - 50 ) - ( show_scene_img.height() )) /2;
            show_scene_img.css({
              'margin-top': offset_top
            });     
          }

        } else if(mode_sceen_open > 1){

          if(current_context_cat == 'fragment'){
            if(!is_desctop){} else {
              w_height-= 201;
            }
          } else {
            w_height-= 50;
          } 

          show_scene.css({
            'height': '100%',
            'width':'100%'
          }); 

          view_port.css(
          { 'width':view_wrap_w,
            'height': w_height,
          });

        }
      });
    }


    var count_scripts = 0;
    var downloadEvent = function(){
      count_scripts--;
      if( count_scripts == 0 ){
        Error('The configuration files are loaded!');

        var def;
        var status_err = false;
        var self = this;

        $('[data-show]').each(function(i){
          def = $(this).attr('data-tag'); 
          status_err = false;
          for(var i in aim){
            if(self.aim[i]['uniq'] == def){
              status_err = true;
            }
          }

          if(status_err == false) {
            Error('The link with tag "' + def  + '" is not valid!');
          } else actionController(this);  
        });

        openView();
        initStructure();
      } 
    }


    var actionController = function(self){
        $(self).bind('mouseover', function(i){
          tag = $(i.currentTarget).attr('data-tag');
          current_context = tag;

          downloadImage(tag);
          //dropThumbsTimers();
        });


        $(self).bind('touchmove', function(i){
          tag = $(i.currentTarget).attr('data-tag');
          //if(current_context == tag) return;
          current_context = tag;
          downloadImage(tag);
          
          //dropThumbsTimers();
        });
      
      $(self).bind('click', function(i){
        //tag = $(i.currentTarget).attr('data-tag');
        //current_context = tag;
        renderWindow();
      });
    }





    var runAnimate = function(event_and_clear){
      clearInterval(animationInterval);
      animationSlide.posList = [];
      animationSlide.current_pos = 0;

      if(!event_and_clear && event_and_clear != undefined) {
        category_animation[current_context_cat] = true;
        return;
      }

      if(
        category_animation[current_context_cat] == false && 
        aim[current_context][current_context_cat].animate == true) {

        if(column <= 0){
          //alert(line);
          for(var i2 = line; i2 >= 0; i2--){
            //console.log(i);
            animationSlide.posList.push([1, 0]);
          //  alert();
          }
        } else {

          var coeff = column / (line);
          var x, y, old_y;
          for(var i = 0; i < line; i++){
            y = Math.ceil(i * coeff);
            if(old_y != y) {
              old_y = y;
              y = 1;
            } else {
              y = 0;
            }
            x = 1;

            animationSlide.posList.push([x, y]);
          }
        }


        animationInterval = setInterval(function(){
          var pos = animationSlide.current_pos;
          sliderController(animationSlide.posList[pos][0], animationSlide.posList[pos][1]);
              
          if(animationSlide.posList.length - 1 > pos){  
            animationSlide.current_pos ++;
          } else {
            category_animation[current_context_cat] = true;
            checkHelperWindow(true);
            runAnimate();
          }

        }, category_animation['speed_animation_' + current_context_cat ]);
      }
    }


    var setCurrentCat = function(){
      var name_cat;
      for(var i in cat){
        name_cat = cat[i];
        if(aim[current_context].data_download[name_cat + '_count'] > 0){
          show_scene_img.attr('src', aim[current_context].data_download[name_cat][0].src);
          current_context_cat = name_cat;
        /*
          if(aim[current_context][current_context_cat].animate){
            //runAnimate();
          }
        */
          return 0;
        }
      }
    }


    var dropThumbsTimers = function(){
      for(var i in cat){
        if(updateMenu[cat[i]] != false){
          clearInterval(updateMenu[cat[i]]);
          //console.log(cat[i]);
          updateMenu[cat[i]] = false;
          updateMenu['count_'+cat[i]] = 0;
        }
      }
    }


    var showMenuItem = function(v, status){
      if(status){
        $('.' + v).css('display', 'block');
        runSlideMenuItem(v);
        //$('li.'+current_context_cat).addClass('active_menu_tubs');
      } else {
        $('.' + v).css('display', 'none');
      }
    }


    var updateButtonStatus = function(){

      var up_down_status = column > 0 ? true:false;

      if(!up_down_status) {
        $('.up_button_3d, .down_button_3d').css('display','none');
      } else {
        $('.up_button_3d, .down_button_3d').css('display','block');
      }

      if(mode_sceen_open < 3){
        plus_button.css('opacity', 1);
      } else {
        plus_button.css('opacity', 0.5);
      }

      if(mode_sceen_open == 0){
        minus_button.css('opacity', 0.5);
      } else {
        minus_button.css('opacity', 1);
      }

      if(!is_desctop){
        fullscreen_button.css('display', 'none');

        if(mode_sceen_open <= 1){
          minus_button.css('opacity', 0.5);
        }
      }

      if(current_context_cat == 'rotate'){

        left_button.css('opacity', 1);
        right_button.css('opacity', 1);

        if(currentH > column){
          down_button.css('opacity', 0.5);
        } else {
          down_button.css('opacity', 1);          
        }

        if(currentH <= 1){
          up_button.css('opacity', 0.5);
        } else {
          up_button.css('opacity', 1);
        }

      } else {

        if(currentW >= line){
          right_button.css('opacity', 0.5);
        } else {
          right_button.css('opacity', 1);
        }       
      
        if(currentW <= 0){
          left_button.css('opacity', 0.5);
        } else {
          left_button.css('opacity', 1);
        }     

      }
    

    }

    //dinamic change ico
    var runSlideMenuItem = function(value){
      //console.log(value);
      updateMenu['counter_'+value] = 0;

      var interval = setInterval(function(){
        if(updateMenu['counter_' + value] > aim[current_context][value].count - 1) updateMenu['counter_'+value]=0;
        
        try {
          $('.' + value + ' img').attr('src', aim[current_context].data_download[value][updateMenu['counter_'+value]].src );
        } catch(e) {
          console.log(value + ' >> ' + updateMenu['counter_'+value] + ' max limit: '+ aim[current_context][value].count);
        }

        updateMenu['counter_' + value]++;
      }, 450);
      updateMenu[value] = interval;
    }


    var showContextWindow = function(){
      //clear prepend timer
      dropThumbsTimers();
      var args = {
        'rotate'    :'rotate_count',
        'fragment'  :'fragment_count',
        'transform' :'transform_count'
      };

      for(var i in args){
        if(aim[current_context]['data_download'][args[i]] > 0){
          showMenuItem(i, true);
        } else {
          showMenuItem(i, false);
        }
      }
    }


    var renderWindow = function(){    
      if(!status_show){
        show_scene.css('display','block');
        pane_scene.css('display','block');
      } else {
        show_scene.css('display','none');
        pane_scene.css('display','none');
      }
      status_show = status_show == 0?1:0;
    }


    var initStructure = function(){
      if(aim == undefined) Error( 'The configuration object is not loaded! Check the links!' );
      
      for(var i in aim){
        var frag_length   =   aim[i].fragment.small.length;
        var transform_length= aim[i].transform.small.length;
        var rotate_length   = aim[i].rotate.small.length;

        aim[i]['data_download'] = {
          status_download: false,
          current_load:   '',
          animate: false,
          upload: {},
          fragment:     [],
          transform:    [],
          rotate:     [],
        /*  thumbs:         {
            'fragment':false,
            'transform':false,
            'sphere': false
          },
        */
          thumbs_fragment_count:0,
          thumbs_transform_count:0,
          thumbs_rotate_count:0,

          rotate_qulity_img:0,
          fragment_quality_img:0,
          transform_quality_img:0,

          frag_download:  0,
          transform_download:0,
          rotate_download: 0,
          
          fragment_count:   frag_length,
          transform_count:transform_length,
          rotate_count:   rotate_length,
          total_files:  frag_length + transform_length + rotate_length
        }
      }
    }


    var startDownload = function(){
      show_scene_img.css('visibility', 'hidden');
      $('.menu_3d').css('visibility', 'hidden');
      download_status = true;
    }


    var endDownload = function(){
      show_scene_img.css('visibility', 'visible');
      $('.menu_3d').css('visibility', 'visible');
      download_status = false;
    }


    var contollerProgress = function(cat){
      startDownload();
      dropThumbsTimers();
      container_preview.html('');
      current_context_cat = 0;

      var args = {
        'rotate_download':'rotate_count',
        'frag_download':'fragment_count',
        'transform_download':'transform_count'
      };

      var frag_length   =   aim[cat].fragment.small.length;
      var transform_length= aim[cat].transform.small.length;
      var rotate_length   = aim[cat].rotate.small.length;

      var total_sum = frag_length + transform_length + rotate_length;

      var total_downloaded =0;
      for(var i in args){
        total_downloaded += aim[cat]['data_download'][i];
      }

      var percent = parseInt( 100/total_sum * total_downloaded );
      
      if(percent >= 100){
        progress_bar_spin.css('display', 'none');
        setCurrentCat();
        
        currentW = 0;
        currentH = 0;

        rotate =  false;

        helpStatus = {
          rotate:false,
          transform:false,
          scale:scale
        }

        category_animation.rotate = category_animation.transform  = false;
        category_animation.fragment = true;

        changeMenuContext();
        showContextWindow();

        updateButtonStatus();
        endDownload();

        //checkHelperWindow(true);
      } else {
        progress_bar_spin.css('display', 'block');
      }

      progress_cur.css('width', percent + '%');
      percent_of_progress.html(percent + '%');
    }


    var uploadImageQuality = function(){
      var img = new Image();

      //create route
      assets_path = root.length > 0? ( root + '/' + current_context + '/' + current_context_cat ): current_context_cat;
      
      img.src = 
        assets_path + '/full/' +
        aim[current_context][current_context_cat].full[current_image]; 

        old_context = current_context_cat;
        img_pos     = current_image;
      
      
      img.onload = function(){
        var current_img = current_image;
        var context = current_context;
        var context_subcat = current_context_cat;
        aim[context].data_download[context_subcat][current_img] = this;
        //console.log('current_img :'+ current_img + ' context context' + context_subcat + ' -- ' + context_subcat);
        
        aim[context].data_download[context_subcat][current_img].quality = true;
        
        if(img_pos == current_img && old_context == context_subcat){  
          show_scene_img.attr('src', aim[context].data_download[context_subcat][current_img].src);

          if(!is_desctop){
            var img = aim[current_context].data_download[current_context_cat][0];
            var _w = img.naturalWidth,
              _h = img.naturalHeight;

            var w_width = $(window)[0].innerWidth,
              w_height = $(window)[0].innerHeight;

            var img_height = show_scene_img.height(),
              img_width = show_scene_img.width();
            
            var margin_top = ((w_height - 50) - img_height) / 2;

            show_scene_img.css({'margin-top':margin_top });
          }
        }
      }
    }


    var downloadImage = function(i){
      contollerProgress(i);

      var args = {
        'rotate_download':'rotate_count',
        'frag_download':'fragment_count',
        'transform_download':'transform_count'
      };

      var next = false;
      if(aim[i]['data_download'].status_download == false){
        
        for(var it in args){
          if( aim[i]['data_download'][it] < aim[i]['data_download'][args[it]]){               
            var context_load;

            switch(it){

              case 'frag_download':     
                context_load='fragment'
                break
              case 'transform_download':  
                context_load='transform'
                break
              case 'rotate_download':   
                context_load='rotate'
                break;

              default:
              break

            }

            var img = new Image();            
            var route = root.length > 0?( root + '/' + aim[i].path + '/' ):''; 

            img.src = 
              route + 
              context_load + '/small/' +
              aim[i][context_load].small[ aim[i]['data_download'][it] ]; 

            img.onload = function(){
              var iter = i;
              var sub = it;
              aim[iter]['data_download'][sub]++;
              if(tag == i) {
                downloadImage(i);
              }
            }

            aim[i]['data_download'][context_load].push(img);
            return 0;
          }
        }

        aim[i]['data_download'].status_download = true;
      }
    }


    var scanLnk = function(){
      var data = $('[data-show]');
      if(data.length==0) {
        this.Error('Download image error!');
        return 0;
      }

      count_scripts = data.length;
      var script;

      //check platform
      is_desctop = detectPlatform();
      if(!is_desctop) mode_sceen_open = 1;


      var is_one = true;
      data.each(function(i, v){
        
        if(is_one == true && $(v).attr('data-tag').length > 0){
          assets_path = root.length > 0? ( root + '/' +$(v).attr('data-tag') + '/' ):'';

          var headID = document.getElementsByTagName("head")[0];         
          var cssNode = document.createElement('link');
          cssNode.type = 'text/css';
          cssNode.rel = 'stylesheet';
          cssNode.href = assets_path + 'css/'+'style.css';
          cssNode.media = 'screen';
          headID.appendChild(cssNode);
          is_one = false;
        }

        assets_path = root.length > 0? ( root + '/' +$(v).attr('data-tag') + '/' ):'';
        
        script = document.createElement('script');
        script.src = assets_path + $(v).attr('data-show');
        document.getElementsByTagName('head')[0].appendChild(script);

        script.onload = function(){
          downloadEvent();
        }

        script.onerror = function(){
          Error( 
            'Error loading file with route  "' + this.src + '". Please, check that path is right!' 
            );
        }
      });
    }


    var Error = function(msg){
      console.log(msg);
    }

    root = path;
    assets_path = path + '';

    scanLnk();
  }

