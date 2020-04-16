var initPhotoSwipeFromDOM = function(gallerySelector) {
  // parse slide data (url, title, size ...) from DOM elements 
  // (children of gallerySelector)
  var parseThumbnailElements = function(grid) {
    var thumbElements = grid.childNodes,
        items = [];
    for(var i = 0; i < thumbElements.length; i++) {
      var link = $(thumbElements[i]); // <a> element
      if(link[0].nodeType !== 1) continue; // include only element nodes 
      var size = link.attr('data-size').split('x');
      var img = $(link[0].children[0]);
      var item = {
        msrc: img.attr('src'),
        src: link.attr('href'),
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10),
        el: link[0],
        title: '<strong>'+img.attr('alt')+'</strong> <em>'+img.attr('data-caption')+'</em>'
      };
      items.push(item);
    }
    return items;
  };

  // find nearest parent element
  function closest(el, fn) { return el && (fn(el) ? el : closest(el.parentNode, fn)) };

  // triggers when user clicks on thumbnail
  var onThumbnailsClick = function(e) {
    e = e || window.event;
    $.stop(e);
    var eTarget = e.target || e.srcElement;
    // find root element of slide
    var clickedListItem = closest(eTarget, function(el) {
      return (el.tagName && el.tagName.toLowerCase() === 'a');
    });
    if(!clickedListItem) return;
    // find index of clicked item by looping through all child nodes
    var clickedGallery = clickedListItem.parentNode,
        childNodes = clickedListItem.parentNode.childNodes,
        numChildNodes = childNodes.length,
        nodeIndex = 0,
        index;
    for (var i = 0; i < numChildNodes; i++) {
      if(childNodes[i].nodeType !== 1) continue;
      if(childNodes[i] === clickedListItem) {
        index = nodeIndex;
        break;
      }
      nodeIndex++;
    }
    if(index >= 0) {
      var img = clickedListItem.parentNode.querySelector('img');
      if($(clickedListItem.parentNode).hasClass('card-img') && !$(img).hasClass('zoom-out')) {
        $(img).addClass('zoom-out');
        animCardImg("out", img);
        setTimeout(function(){ openPhotoSwipe(index, clickedGallery); }, 150);
      }
      else openPhotoSwipe(index, clickedGallery);
    }
    return false;
  };

  // parse picture index and gallery index from URL (#&pid=1&gid=2)
  var photoswipeParseHash = function() {
    var hash = window.location.hash.substring(1),
    params = {};
    if(hash.length < 5) return params;
    var vars = hash.split('&');
    for (var i = 0; i < vars.length; i++) {
      if(!vars[i]) continue;
      var pair = vars[i].split('=');  
      if(pair.length < 2) continue;
      params[pair[0]] = pair[1];
    }
    if(params.gid) params.gid = parseInt(params.gid, 10);
    return params;
  };

  var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
    var pswpElement = document.querySelectorAll('.pswp')[0],
        gallery,
        options,
        items;
    items = parseThumbnailElements(galleryElement);
    // define options (if needed)
    options = {
      // define gallery index (for URL)
      // galleryUID: galleryElement.getAttribute('data-pswp-uid'),
      history: false,
      closeOnScroll: false,
      getThumbBoundsFn: function(index) {
        var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
            rect = thumbnail.getBoundingClientRect(); 
        return { x:rect.left, y:rect.top + pageYScroll, w:rect.width };
      }
    };

    if(fromURL) { // PhotoSwipe opened from URL
      if(options.galleryPIDs) {
        // parse real index when custom PIDs are used 
        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
        for(var j = 0; j < items.length; j++) {
          if(items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } 
      else options.index = parseInt(index, 10) - 1; // in URL indexes start from 1
    } 
    else options.index = parseInt(index, 10);

    // exit if index not found
    if( isNaN(options.index) ) return;
    if(disableAnimation) options.showAnimationDuration = 0;

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
    gallery.listen('initialZoomOut', function() { 
      var a = gallery.currItem.el;
      var img = a.querySelector('img');
      if($(a.parentNode).hasClass('card-img')) {
        $(a.parentNode).removeClass('freeze');
        $(img).removeClass('zoom-out');
        img.src = a.href;
        setTimeout(function(){ animCardImg("in", img);}, gallery.options.showAnimationDuration);
      }
    });
  };

  // loop through all gallery elements and bind events
  var galleryElements = document.querySelectorAll(gallerySelector);

  for(var i = 0, l = galleryElements.length; i < l; i++) {
    $(galleryElements[i]).attr('data-pswp-uid', i+1);
    galleryElements[i].onclick = onThumbnailsClick;
  }

  // Parse URL and open gallery if it contains #&pid=3&gid=1
  var hashData = photoswipeParseHash();
  if(hashData.pid && hashData.gid) {
    openPhotoSwipe(hashData.pid, galleryElements[hashData.gid-1], true, true);
  }
};

var initTabs = function() {
  $('.tabs-menu a, .tabs-link').on('click', function(e){
    $.stop(e);
    $('.tabs-menu .active').removeClass('active');
    $(this).addClass('active');
    $('.tabs-menu a[href="'+$(this).attr('href')+'"]').addClass('active');
    $('.tabs > .active').removeClass('active');
    $($(this).attr('href')).addClass('active');
  });
}

// calculates the various state sizes of card images
function getCardImgSizes(img) {
  var s = {};
  var img_size = $(img.parentNode).attr('data-size') ? $(img.parentNode).attr('data-size').split('x') : null;
  s.w = img.offsetWidth ? img.offsetWidth : parseInt(img_size[0], 10);
  s.h = img.offsetHeight ? img.offsetHeight : parseInt(img_size[1], 10);
  s.nat_w = img_size ? parseInt(img_size[0], 10) : img.naturalWidth;
  s.nat_h = img_size ? parseInt(img_size[1], 10) : img.naturalHeight;
  s.div_w = img.parentNode.offsetWidth;
  s.div_h = img.parentNode.offsetHeight;

  // check aspect ratios to see if 100% side should flip to fit wide/tall containers
  s.flip = (s.nat_w > s.nat_h && s.nat_w/s.nat_h < s.div_w/s.div_h) 
        || (s.nat_w < s.nat_h && s.nat_w/s.nat_h > s.div_w/s.div_h);

  if( (s.nat_w > s.nat_h && !s.flip)
    || (s.nat_w < s.nat_h && s.flip) 
    || (s.nat_w === s.nat_h && s.div_w <= s.div_h) ) {
    s.zin_w = s.nat_w*s.div_h/s.nat_h;
    s.zin_h = s.div_h;
    s.zout_w = s.div_w;
    s.zout_h = s.nat_h*s.zout_w/s.nat_w;
    s.side = 'h';
  }
  else {
    s.zin_h = s.nat_h*s.div_w/s.nat_w;
    s.zin_w = s.div_w;
    s.zout_h = s.div_h;
    s.zout_w = s.nat_w*s.zout_h/s.nat_h;
    s.side = 'w';
  }
  return s;
}

var cardAnims = {};

function animCardImg(zoom, target) {
  if(target in cardAnims && !cardAnims[target].anime.completed) {
    cardAnims[target].anime.play();
    cardAnims[target].anime.reverse();
    return;
  }

  var s = getCardImgSizes(target)

  function setAttr(target, complete) {
    if(complete) {
      target.style.width = '';
      target.style.height = '';
      if($(target).hasClass('zoom-out')) {
        target.style.maxWidth = '100%';
        target.style.maxHeight = '100%';
      }
      else {
        target.style.maxWidth = 'none';
        target.style.maxHeight = 'none';

        // check orientation for 100% side
        var w = target.offsetWidth,
            h = target.offsetHeight,
            pw = target.parentNode.offsetWidth,
            ph = target.parentNode.offsetHeight;
        var flip = (w > h && w/h < pw/ph) || (w < h && w/h > pw/ph);
        if( (w > h && !flip) || (w < h && flip) || (w === h && pw < ph) ) target.style.height = '100%';
        else target.style.width = '100%';
      }
    }
    else {
      target.style.width = target.offsetWidth;
      target.style.height = target.offsetHeight;
      target.style.maxWidth = 'none';
      target.style.maxHeight = 'none';
    }
  }

  cardAnims[target] = { anime: anime({
    targets: target,
    width: zoom === "out" ? [s.w+"px", s.zout_w+"px"] : [s.w+"px", s.zin_w+"px"],
    height: zoom === "out" ? [s.h+"px", s.zout_h+"px"] : [s.h+"px", s.zin_h+"px"],
    duration: 100,
    easing: 'easeInCubic',
    begin: function(anim) { setAttr(anim.animatables[0].target, false); },
    complete: function(anim) { setAttr(anim.animatables[0].target, true); }
  })};
}

// PhotoSwipe image galleries (fill blazy images here)
var data_folder = '/assets/media/indie/';
var p = {
  'xs':'thumb-xs/', 
  's': 'thumb/', 
  'm': 'thumb/', 
  'l': 'thumb-2x/', 
  'f': 'full/'
};
function fillImgContainers(img_data, folder) {
  var img_path = data_folder + folder + '/';
  var containers = $('.ps-img:not(.prefilled)');
  for(var g=0; g<containers.length; g++) {
    var isFull = $(containers[g]).hasClass('full');
    var thumbs = document.createDocumentFragment();
    for(var i=0; i<img_data[g].length; i++) {
      var a = $(document.createElement('a'));
      var data = img_data[g][i];
      var isGif = data.img.includes('.gif');
      a.attr('href', img_path + (isGif ? '' : p.f) + data.img);
      a.attr('data-size', data.size);
      a.attr('id', data.img.split('.').slice(0,-1).join('.'));
      var img = $(document.createElement('img'));
      img.addClass('b-lazy');
      if(isFull) {
        img.addClass('img-single');
        img.attr('data-src', img_path + (isGif ? '' : p.f) + data.img);
      } else if(isGif) {
        img.attr('data-src', img_path + data.img);
      } else {
        img.attr('data-src-s', img_path + p.s + data.img);
        img.attr('data-src', img_path + p.m + data.img + '|' + img_path + p.l + data.img);
      }
      img.attr('src', img_path + (isFull ? p.s : p.xs) + data.img.replace('.gif', '.jpg'));
      img.attr('alt', data.title || '');
      img.attr('data-caption', data.cap || '');

      a[0].appendChild(img[0]);

      thumbs.appendChild(a[0]);
    }
    containers[g].appendChild(thumbs);
  }
}

function addTags() {
  var work = $('[data-page]').attr('data-page');
  if(work === 'gallery') work = $('.fullpage').attr('id');
  var tags = p_cache.work[work].tags.split(', ');
  for(var i=0; i<tags.length; i++) {
    var a = $(document.createElement('a'));
    a.attr('href', '/search/?k=' + tags[i].toLowerCase() + "/");
    a.text(tags[i]);
    $('.footer-tags')[0].appendChild(a[0]);
  }
}

function cardImgPrep() {
  $('.card-img img').each(function(el) {
    var s = getCardImgSizes(el); // sizes
    if(s.side === 'h') el.style.height = '100%';
    else el.style.width = '100%';
  });
  $('.card-img').on('click', function() {
    $(this).addClass('freeze');
  });
  $('.card-img').on('mouseenter', function() {
    if($('html').hasClass('no-hover')) return;
    var t = this;
    setTimeout(function() {
      if($(t).hasClass('freeze')) return; 
      var img = t.querySelector('img');
      $(img).addClass('zoom-out');
      animCardImg("out", img);
    },5);
  });
  $('.card-img').on('mouseleave', function() { 
    if($('html').hasClass('no-hover')) return;
    var t = this;
    setTimeout(function() {
      if($(t).hasClass('freeze')) return; 
      var img = t.querySelector('img');
      $(img).removeClass('zoom-out');
      animCardImg("in", img); 
    },5);
  });
}

function initIndiePage(img_data, page) {
  // fill photoswipe image galleries
  fillImgContainers(img_data, page);

  // add external gallery triggers
  $('.ps-trigger').on('click', function(e){
    $.stop(e);
    simulateClick($('#'+$(this).attr('data-target'))[0]);
  })

  // init thumbnails
  blazy.revalidate();
  initPhotoSwipeFromDOM('.ps-img');

  // add footer tags
  if(!p_cache) p_cache_callbacks.push(addTags);
  else addTags();

  // prep card-img hover behaviors
  cardImgPrep();

  // init some functions that require the page to fully render first:
  setTimeout(function() { 
    // reinit blazy
    blazy.revalidate();
  }, 50);
}


/* GLOBAL VARS */
var p_cache_callbacks = [], p_cache; // project cache, API callbacks

(function(){
  function getProjectData(res, err) {
    if(err) return alert(err);
    p_cache = JSON.parse(res);
    for(var i=0; i<p_cache_callbacks.length; i++) p_cache_callbacks[i]();
  }
  if(typeof p_cache === "undefined") getFile(project_data_url, getProjectData);
})();