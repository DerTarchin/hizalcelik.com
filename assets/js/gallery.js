(function(){
  // ============================ INIT / TEMPLATING =========================== //
  var activeGalleryTransition = false,
      activeInfoModule = false,
      activeMenuModule = false,
      hideInfoModule, // function
      showInfoModule, // function
      showModule, // revealer animation
      hideModule, // revealer animation,
      checkFullpage, // check if URL matches loaded fullpage
      addFullpage, // adds fullpage
      img_cache = {}, // for preloading images
      preload_category, // base category for preloading images
      g = $('#gallery')[0], // gallery
      g_index = 0, // current project index
      g_info = $('#gallery-info')[0], // gallery info
      g_overlay = $('#overlay')[0], // overlay
      g_btn = $('#overlay-btn')[0], // gallery button
      g_btn_txt = $('#overlay-btn-txt')[0], // gallery button text
      g_map = {}, // record of previously added gallery HTML
      g_ftmpl = $('#gallery-tmpl').html(); // gallery frame template (here to prevent MSEdge glitch)

  function updateState() {
    if(!activeCategory) return;
    var params  = "?c=" + activeCategory.toLowerCase() + "&w=" 
                + p_cache.gallery[activeCategory].split(", ")[g_index].toLowerCase() + "/";
    var curr_path = window.location.href.split("?")[1];
    if(curr_path) curr_path = curr_path.endsWith("/") ? curr_path : curr_path + "/";
    if(params.split("?")[1] === curr_path) return;
    var new_url = window.location.href.split('?')[0] + params;
    history.replaceState(null, null, new_url);
    var ga_page = "/" + params;
    ga('set', 'page', ga_page);
    ga('send', 'pageview');
    // console.log("Set Google Analytics page to " + ga_page);
    $('body').removeClass('isHome');
  }

  function getWorkData() {
    return p_cache.work[ p_cache.gallery[activeCategory].split(", ")[g_index] ];
  }

  function addView() {
    g.insertAdjacentHTML('beforeend', tmpl(g_ftmpl, getWorkData()));
    $('#frame-'+getWorkData().id).hide();
  }

  function addTags() {
    if(!("tags" in getWorkData())) { $('#overlay-tags')[0].innerHTML = ""; return; }
    var tags_html = "",
        tags = getWorkData().tags.split(', '),
        cats = Object.keys(p_cache.gallery);
    for(var i=0; i<tags.length; i++) {
      if(cats.indexOf(tags[i]) < 0) tags_html += '<li><a url="/search/?k=' 
                                                + tags[i].toLowerCase() + '">' + tags[i] 
                                                + '</a></li>';
    }
    $('#overlay-tags')[0].innerHTML = tags_html;
  }

  /* 
  * preloads all current category images (xs size)
  * in outward spiral from current index
  * then loads first index images of all other categories
  */
  function preloadGalleryImages() {
    var filepath = "/assets/media/gallery-xs/",
        fullsize = window.screen.width <= 1200 ? isMobile() ? '-s' : '-m' : '-l',
        activeCategoryList = p_cache.gallery[preload_category].split(', '),
        preloadOrder = [],
        spread = 1;

    function preloadImages(work, loadFullSize, delay) {
      setTimeout(function(){
        if(!loadFullSize && (work in img_cache)) return;
        else if(!loadFullSize) img_cache[work] = [];
        if(loadFullSize && (work+"--fullsize" in img_cache)) return;
        else if(loadFullSize) img_cache[work+"--fullsize"] = [];
        // console.log("prelaoding: " + work + " " + loadFullSize)
        var fpath = loadFullSize ? filepath.replace('-xs', fullsize) : filepath;

        for(var i=0; i<p_cache.work[work].img.length; i++) {
          var img = new Image();
          img.src = fpath + p_cache.work[work].img[i];
          // img.onload = function(){ console.log(this.src) };
          img_cache[loadFullSize ? work + "--fullsize" : work].push(img);
        }
      }, delay);
    }

    // add current category index to cache
    if(!(activeCategoryList[g_index] in img_cache)) preloadImages(activeCategoryList[g_index], false, 0);

    // add other indexes of current category, spiraling outward
    while(g_index+spread < activeCategoryList.length || g_index-spread >= 0) {
      // check if within bounds and xs not loaded
      if(g_index+spread < activeCategoryList.length 
        && !(activeCategoryList[g_index+spread] in img_cache)) 
        preloadImages(activeCategoryList[g_index+spread], false, spread * 500);
      // check if within bounds, spread === 1 and fullsize not loaded
      var next_index = g_index+spread === activeCategoryList.length ? 0 : g_index+spread;
      if(g_index+spread <= activeCategoryList.length && spread === 1 
        && !(activeCategoryList[next_index]+"--fullsize" in img_cache))
        preloadImages(activeCategoryList[next_index], true, spread * 500);

      // check if within bounds and xs not loaded
      if(g_index-spread >= 0 
        && !(activeCategoryList[g_index-spread] in img_cache)) 
        preloadImages(activeCategoryList[g_index-spread], false, spread * 500);
      // check if within bounds, spread === 1 and fullsize not loaded
      var prev_index = g_index-spread === -1 ? activeCategoryList.length-1 : g_index-spread;
      if(g_index-spread > -2 && spread === 1 
        && !(activeCategoryList[prev_index]+"--fullsize" in img_cache))
        preloadImages(activeCategoryList[prev_index], true, spread * 500);
      spread++;
    }

    // add first index of other categories
    for(cat in p_cache.gallery) { 
      var work = p_cache.gallery[cat].split(', ')[0];
      if(!(work in img_cache)) preloadImages(work, false, spread * 500);
    }
  }
    
  var dur = 500, // transition duration
      del = dur/5, // shard delay
      off = dur*.7, // offset for next view
      ei = "easeInQuad", // easeIn function
      eo = "easeOutCubic"; // easeOut function

  function hideOverlay() {

  }
  function showOverlay() {

  }

  function setInfo() {
    g_info.style.opacity = 0;
    var gitmpl = $('#info-tmpl').html();
    g_info.innerHTML = tmpl(gitmpl, getWorkData());
    g_btn_txt.innerHTML = getWorkData().btn;
    var work = p_cache.work[p_cache.gallery[activeCategory].split(", ")[g_index]];
    if("url" in work) $(g_btn).attr('href', work.url);
    else $(g_btn).attr('url', "/" + work.id + "/");
    addTags();
    // prep text for animation
    $('#gallery-info .title, #gallery-info .description').each(function(el){
      $(el).html($(el).text().replace(/([^\x\s]|\w)/g, "<span class='letter'>$&</span>"));
    });
  }

  function hideInfo() {
    $(g_btn).removeAttr('url');
    $(g_btn).removeAttr('href');
    anime({
      targets: g_info,
      duration: dur*.65,
      opacity: 0,
      easing: ei,
      complete: function(){ setInfo(); }
    })
  }

  function showInfo() {
    anime({
      targets: '#gallery-info .letter',
      translateY: [-100,0],
      easing: "easeOutExpo",
      duration: 1400,
      delay: function(el, i) { return 30 * i },
      begin: function() { g_info.style.opacity = 1 }
    });
    anime({
      targets: '#gallery-info .year',
      duration: dur*.65,
      opacity: [0,1],
      easing: ei,
    });
  }

  var ani = anime(); // current anime for gallery

  function initGallery() {
    $('body').removeClass('isHome');
    addView();
    setInfo();
    preload_category = activeCategory;
    ani.pause();
    ani = anime.timeline()
      .add({
        targets: '.frame .shard',
        opacity: [0,1],
        duration: 1000,
        delay: function(el, i, l) {
              return i * 200 + 500;
            },
        easing: "easeInQuad",
        begin: function() {
          $('.frame').show();
          $('body').addClass('galleryTransitioning');
          activeGalleryTransition = true;
          blazy.revalidate();
          updateState();
        },
        complete: function() {
          blazy.revalidate();
          showInfo();
        }
      })
      .add({
        targets: '.nav-arrow-container',
        opacity: 1, // [0,1]
        duration: 1000,
        delay: function(el, i, l) {
              return i * 500;
            },
        easing: "easeInQuad",
        offset: '-=1000',
        begin: preloadGalleryImages,
        complete: function() {
          $('body').removeClass('galleryTransitioning');
          activeGalleryTransition = false;
        }
      });
  }

  function initHomeSlideshow() {
    $('body').addClass('isHome');
    $('body').removeClass('galleryTransitioning');
    activeGalleryTransition = false;
    g.innerHTML = "";

    ani.pause();
    ani = anime.timeline({ loop:true });
    var slideshow_dur = dur*1.5,
        slideshow_del = slideshow_dur/5;

    for(var i=0; i<p_cache.intro.length; i++) {
      var prev = i > 0 ? p_cache.intro[i-1] : null,
          curr = p_cache.intro[i];
      if(i!==0) {
        ani.add({
          targets: '#frame-' + prev.id + ' .shard',
          translateZ: [0, -50],
          opacity: [1,0],
          duration: slideshow_dur,
          delay: function(el, i, l) {
            return i * slideshow_del;
          },
          easing: ei,
        });
      }

      curr.style = 5;
      g.insertAdjacentHTML('beforeend', tmpl(g_ftmpl, curr));
      var f = $('#frame-' + curr.id);
      var text = document.createElement('div');
      $(text).addClass('overlay-title');
      text.innerHTML = curr.text;
      f[0].prepend(text);

      ani.add({
        targets: '#frame-' + curr.id + ' .overlay-title',
        translateZ: [50, 0],
        opacity: [0,1],
        duration: slideshow_dur,
        delay: function(el, i, l) {
          return i * slideshow_del;
        },
        easing: eo,
        offset: i!==0 ? '-='+(slideshow_dur/5) : '-=0',
      })
      .add({
        targets: '#frame-' + curr.id + ' .overlay-title',
        translateZ: [0, -50],
        opacity: [1,0],
        duration: slideshow_dur,
        delay: function(el, i, l) {
          return i * slideshow_del;
        },
        easing: ei,
      })
      .add({
        targets: '#frame-' + curr.id + ' .shard',
        translateZ: [50, 0],
        opacity: [0,1],
        duration: slideshow_dur,
        delay: function(el, i, l) {
          return i * slideshow_del;
        },
        easing: eo,
        offset: '-='+(dur/2),
      });
      
      if(i===p_cache.intro.length-1) {
        ani.add({
          targets: '#frame-' + curr.id + ' .shard',
          translateZ: [0, -50],
          opacity: [1,0],
          duration: slideshow_dur,
          delay: function(el, i, l) {
            return i * slideshow_del;
          },
          easing: ei,
        });
      }
    }
  }

  function getProjectData(res, err) {
    if(err) {
      alert(err);
      return;
    }
    p_cache = JSON.parse(res);
    galleryCallback();
  }

  var nextArrowPoly = $('#next polygon')[0],
      prevArrowPoly = $('#prev polygon')[0],
      dormantPoints = '25 5 50 45 25 45 0 45',
      activePoints = '25 5 50 45 25 30 0 45';

  function animArrow(points, target) {
    if(isMobile()) return;
    anime.remove(target);
    anime({
      targets: target,
      points: points,
      duration: 700,
      elasticity: 600
    });
  }

  $('.nav-arrow-container-next').on('mouseenter', function(){ animArrow(activePoints, nextArrowPoly) });
  $('.nav-arrow-container-prev').on('mouseenter', function(){ animArrow(activePoints, prevArrowPoly) });
  $('.nav-arrow-container-next').on('mouseleave', function(){ animArrow(dormantPoints, nextArrowPoly) });
  $('.nav-arrow-container-prev').on('mouseleave', function(){ animArrow(dormantPoints, prevArrowPoly) });

  // ============================ Project Info Module =========================== //

  showInfoModule = function(id) {
    if(activeInfoModule) return;
    if(showModule) { showModule.destroy(); }
    showModule = new Revealer({
      nmbLayers : 2,
      bgcolor : ['#202023', '#a3a3a3'],
      onStart : function(direction) {
        $("#"+id).addClass('module--animate-' + direction);
        $('#'+id).show();
        $('body').addClass('moduleActive');
        activeInfoModule = true;
      },
      onEnd : function(direction) {
        $("#"+id).removeClass('module--animate-' + direction);
      }
    });
    showModule.reveal('cornertopright', 750, function() {
      $('#gallery-view').hide();
      $('#'+id).addClass('vis');
    });
  }

  hideInfoModule = function(id) {
    if(!id) id = $('.fullpage.vis').attr('id');
    if(hideModule) hideModule.destroy();
    hideModule = new Revealer({
      nmbLayers : 2,
      bgcolor : ['#202023', '#a3a3a3'],
      onStart : function(direction) {
        $("#gallery-view").addClass('module--animate-' + direction);
      },
      onEnd : function(direction) {
        $("#gallery-view").removeClass('module--animate-' + direction);
      }
    });
    hideModule.reveal('cornerbottomleft', 750, function() {
      $('#gallery-view').show();
      $('#'+id).removeClass('vis');
      $('#'+id).remove();
      $('body').removeClass('moduleActive');
      activeInfoModule = false;
    });
  }

  // ============ LOADING DYNAMIC FULLPAGE CONTENT ============ //

  var next_url,
      page_id;

  function insertFullpage(str) {
    var frag = document.createElement("div");
    frag.innerHTML = str;
    var html = frag.querySelector(".fullpage[data-dynamic='html']");
    var css_group = frag.querySelectorAll("[data-dynamic='css']");
    var js_group = frag.querySelectorAll("[data-dynamic='js']");
    var template_group = frag.querySelectorAll("[data-dynamic='template']");

    $(html).removeClass("vis");
    $(html).attr('id', page_id);
    $(html).attr('close-url', window.location.href);
    for(var i=0; i<css_group.length; i++) $(html).append($(css_group[i]));
    for(var i=0; i<template_group.length; i++) $(html).append($(template_group[i]));

    for(var i=0; i<js_group.length; i++) {
      var js = document.createElement("script");
      if($(js_group[i]).hasAttr("src")) js.src = js_group[i].src;
      else js.innerHTML = js_group[i].innerHTML;
      $(html).append($(js))
    }

    html.querySelector(".fullpage-content").insertAdjacentHTML('beforeend', close_tmpl);
    $(html.querySelector(".close")).on('click', function(){ 
      hideInfoModule(null);
      history.replaceState(null, null, $(html).attr('close-url'));
    });
    $('body').append($(html));

    showInfoModule($(html).attr('id'));

    if(window.location.href !== next_url) {
      history.pushState(null, null, window.location.href);
      history.replaceState(null, null, next_url);
      ga('set', 'page', next_url);
      ga('send', 'pageview');
      // console.log("Set Google Analytics page to " + next_url);
    }
  }

  function loadFullpage(res, err) {
    if(err) alert(err);
    else {
      g_map[page_id] = res;
      insertFullpage(g_map[page_id]);
    }
    next_url = null;
    page_id = null;
  }

  isPrevFullpage = function(href) {
    url = href.split("?")[0];
    if(!url.endsWith("/")) url += "/";
    page_id = url.split("/")[url.split("/").length-2];
    return (page_id in g_map);
  }


  isIndiePage = function(href) {
    var url_bits = href.split('/'),
        url_bit = url_bits.pop();
    while(url_bits.length > 0) {
      if(url_bit.length > 0 && url_bit in p_cache.work) return true;
      url_bit = url_bits.pop();
    }
    return isPrevFullpage(href);
  }

  addFullpage = function(href) {
    next_url = href;
    file_url = next_url.split("?")[0];
    if(!file_url.endsWith("/")) file_url += "/";
    page_id = file_url.split("/")[file_url.split("/").length-2];
    // refer to saved data or load new file
    if(page_id in g_map) insertFullpage(g_map[page_id]);
    else getFile(file_url+"index.html", loadFullpage);
  }

  galleryCallback = function() {
    if(activeInfoModule) return hideInfoModule(null); // hide indie page
    else if(isIndiePage(window.location.href)) return addFullpage(window.location.href); // show indie page
    else if(!activeCategory) history.replaceState(null, null, "/"); // homepage
    else if(!activeWork) g_index = 0; // new category, first work
    else {
      g_index = p_cache.gallery[activeCategory].split(", ").indexOf(activeWork);
      if(g_index<0) g_index = 0;
    }
    anime({
      targets: "#gallery-view, .nav-arrow-container",
      duration: 250,
      opacity: 0, // [1,0]
      easing: "linear",
      begin: function() {
        $('body').addClass('galleryTransitioning');
        activeGalleryTransition = true;
      },
      complete: function() {
        g.innerHTML = "";
        g_info.innerHTML = "";
        $(g_btn).removeAttr('url');
        $(g_btn).removeAttr('href');
        $("#gallery-view")[0].style.opacity = "1";
        if(activeCategory) initGallery();
        else initHomeSlideshow(); 
      }
    });
  }

  window.addEventListener('load', function() {
    if(p_cache) galleryCallback();
    else getFile(project_data_url, getProjectData);

    function transition(direction) {
      $('body').addClass('galleryTransitioning');
      activeGalleryTransition = true;

      // add next view
      var currProjID = getWorkData().id;
      $('.frame:not(#frame-'+currProjID+')').addClass('out');
      addView();
      $('#frame-'+currProjID).removeClass('out'); // fix MSEdge glitch that adds out
      $('#frame-'+currProjID).addClass('in');

      var nextOut = '.frame.out .shard', 
          nextIn = '.frame.in .shard';
      if(direction === "next") {
        nextOut = [].slice.call(document.querySelectorAll('.frame.out .shard')).reverse();
        nextIn = [].slice.call(document.querySelectorAll('.frame.in .shard')).reverse();
      }

      // animate transition
      anime.timeline()
      .add({
        targets: nextOut,
        translateZ: [0, -50],
        opacity: [1,0],
        duration: dur,
        delay: function(el, i, l) {
          return i * del;
        },
        easing: ei,
        begin: function() {
          preload_category = activeCategory;
          preloadGalleryImages();
          hideInfo();
        },
        complete: function() {
          $('.frame.out').remove();
          showInfo();
        }
      })
      .add({
        targets: nextIn,
        translateZ: [50, 0],
        opacity: [0,1],
        duration: dur,
        delay: function(el, i, l) {
          return i * del;
        },
        easing: eo,
        offset: $('.frame.out .shard-6').length > 0 ? off*1.33 : off,
        begin: function() {
          $('.frame.in').show();
          blazy.revalidate();
          updateState();
        },
        complete: function() {
          $('body').removeClass('galleryTransitioning');
          activeGalleryTransition = false;
          // recalc page to fix mobile glitch preventing CSS animations
          var imgs = $('.frame .img');
          for(var i=0; i<imgs.length; i++) {
            imgs[i].classList.remove('img');
            void imgs[i].offsetWidth;
            imgs[i].classList.add('img');
          }
          $('.frame.in').removeClass('in');
        }
      });
    }

    function showPrev() {
      if(!activeCategory || p_cache.gallery[activeCategory].split(", ").length === 1 || activeGalleryTransition) return;
      // update index
      g_index-=1;
      if(g_index < 0) g_index = p_cache.gallery[activeCategory].split(", ").length-1;
      // initiate transition
      transition("prev");
    }

    function showNext() {
      // update index
      if(!activeCategory || p_cache.gallery[activeCategory].length === 1 || activeGalleryTransition) return;
      g_index = (g_index + 1) % p_cache.gallery[activeCategory].split(", ").length;
      // initiate transition
      transition("next");
    }

    // prev/next on click
    $('.nav-arrow-container-prev').on('click', showPrev);
    $('.nav-arrow-container-next').on('click', showNext);

    // prev/next on arrow key
    $(document).on('keydown', function(e){
      if(e.keyCode == 37) showPrev();
      if(e.keyCode == 39) showNext();
    });

    // prev/next on swipe
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);
    var xDown = null, yDown = null;                                                        
    function handleTouchStart(evt) {                                         
        xDown = evt.touches[0].clientX;                                      
        yDown = evt.touches[0].clientY;                                    
    };                                                
    function handleTouchMove(evt) {
        if(!xDown || !yDown) return;
        if(activeGalleryTransition || activeInfoModule || activeMenuModule) return;

        var xDiff = xDown - evt.touches[0].clientX;
        var yDiff = yDown - evt.touches[0].clientY;

        if(Math.abs(xDiff) > Math.abs(yDiff) && yDiff < Math.abs(100)) {
            if (xDiff > 0) showNext();
            else showPrev();         
        } else {
            if (yDiff > 0) return; // swip up
            else return; //$('#overlay-btn')[0].click(); // swipe down
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };

    $('#gallery-view').on('click', function(e) {
      var el = $(e.target);
      var a = el.is("a") ? el : el.parent().is("a") ? el.parent() : null;
      if(a != null && !(a.hasClass('direct') || a.hasAttr("href"))) {
        $.stop(e);
        e.stopPropagation();
        if(activeInfoModule || activeGalleryTransition) return;
        addFullpage(a.attr('url'));
      }
    });
  });
})();