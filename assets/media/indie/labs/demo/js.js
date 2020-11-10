function map(value, istart, istop, ostart, ostop) {
      return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

var ipad_start;

move = function() {
    var scroll = $(window).scrollTop();
    var depth = 0.3;

    $('.bgimg').each(function() {
        var top = this.getBoundingClientRect().top;
        if(top - $(window).height() < 0) {
            $(this).css('background-positionY', top * depth + 'px');
        }
    });

    if(ipad_start == null) ipad_start = parseFloat($("#ipad").css('bottom').replace('px',''));
    
    $("#ipad").css('bottom', (ipad_start - scroll * depth * 2) + "px");

    $('[class*="ipad-lvl"]').each(function() {
        var lvl = parseInt(this.classList[0].replace('ipad-lvl',''));
        change = scroll * -1 * depth * lvl;
        $(this).css('top', change + "px");
    });

    $("#darken").css('opacity', map(scroll, 0, $(window).height(), 0, 1));
    fixnav();
}

fixnav = function() {
    var $nav = $("#intro");
    var top = $nav[0].getBoundingClientRect().top;
    if(top == parseInt($nav.css('top').replace('px',''))) {
        $nav.addClass('transp');
    }
    else if($nav.hasClass('transp')) {
        $nav.removeClass('transp');
    }
}

// Parallaxing + add class active on scroll
$(document).scroll(move);

$(window).resize(move);

move();

$('#cube').on('click', function() { 
    $(this).toggleClass('mail'); 
    $(this).find('input').focus();
});

$('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(event) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && 
      location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 500, function() {
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) {
            return false;
          } else {
            $target.attr('tabindex','-1'); 
            $target.focus();
          };
        });
      }
    }
});

modal = function(e) {
    $lb = $('.lightbox');
    if(!$lb.hasClass('view')) {
        $lb.addClass('view');
        return;
    }
    if($(this).is($(e.target).parent())) $lb.removeClass('view');
}
$('#modaldemo, .lightbox').on('click', modal);


function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth*ratio, height: srcHeight*ratio };
}

function Carousel3D ( el ) {
  this.element = el;
  this.rotation = 0;
  this.panelCount = $(el).children().length;
  this.theta = 0;
  this.isHorizontal = false;
  this.activePanel = 0;
}

Carousel3D.prototype.modify = function() {
  var panel, angle, i;
  this.panelSize = this.element[ this.isHorizontal ? 'offsetWidth' : 'offsetHeight' ];
  this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
  this.theta = 360 / this.panelCount;
  this.radius = Math.round( ( this.panelSize / 1.9) / Math.tan( Math.PI / this.panelCount ) );
  for ( i = 0; i < this.panelCount; i++ ) {
    panel = this.element.children[i];
    angle = this.theta * i;
    panel.style.opacity = 1;
    panel.style["transform"] = this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
  }
  this.transform();
};

Carousel3D.prototype.transform = function() {
  this.element.style["transform"] = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)';
  var active = (this.rotation/this.panelCount/10)%this.panelCount*-1;
  this.activePanel = active < 0 ? this.panelCount + active : Math.abs(active);
  $(this.element).children('.active').removeClass('active');
  $($(this.element).children()[this.activePanel]).addClass('active');
};

var caro;

//resize app
function resizeApp() {
  var page_w = $(window).width()*.8;
  var page_h = $(window).height()*.8;
  var max_w = 16000;
  var max_h = 9000;
  var app_w;
  var app_h;

  if(page_w > max_w && page_h > max_h) {
    app_w = max_w;
    app_h = max_h;
  }
  else {
    var result = calculateAspectRatioFit(max_w, max_h, page_w, page_h);
    app_w = result.width;
    app_h = result.height;
  }
  $("#carousel-container").css('width', app_w);
  $("#carousel-container").css('height', app_h);
  caro.modify();
}

var init = function() {
  caro = new Carousel3D($('#carousel')[0]);
  $(caro.element).on('mouseenter', ':not(.active)', function(){
    var param = "transform: ";
    var style = $(this).attr('style');
    var val = style.substring(style.indexOf(param)+param.length).split(';')[0];
    $(this).attr('prevstyle', val);
    $(this).css('transform', val+" scale(1.05)");
  });
  $(caro.element).on('mouseleave', ':not(.active)', function(){
    $(this).css('transform', $(this).attr('prevstyle'));
  });
  $(caro.element).on('click', 'figure', function(){
    var i = $(this).index();
    var down = (i+1)%caro.panelCount;
    var up = i == 0 ? caro.panelCount-1 : (i-1)%caro.panelCount;
    console.log($(this).index());
    console.log(caro.activePanel);

    if(down == caro.activePanel) caro.rotation += caro.theta;
    if(up == caro.activePanel) caro.rotation += caro.theta * -1;
    caro.modify();
  });
  caro.panelCount = $('#carousel').children().length;
  caro.modify();
  resizeApp();
  setTimeout( function(){ $('body').addClass('ready') }, 0);
};
$(document).ready(init);
$(window).resize(resizeApp);

$('body').on('keydown', function(key) {
    if($('.lightbox.view').length) {
        if(key.key === 'd') $('#carousel').toggleClass('debug')
        if(key.key === 'ArrowDown' || key.key === 'ArrowRight') caro.rotation += caro.theta;
        else if(key.key === 'ArrowUp' || key.key === 'ArrowLeft') caro.rotation += caro.theta * -1;
        else if(key.key === ' ') caro.rotation += caro.theta * caro.panelCount/3;
        if($.inArray(key.key, [' ', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight']) > -1) {
            key.preventDefault();
            caro.modify();
        }
    }
});
var lastscroll = parseInt($(window).scrollTop()/100);
$(window).on('scroll', function(e) {
    var scroll = parseInt($(window).scrollTop()/100);
    if($('.lightbox.view').length && lastscroll != scroll) {
        if(lastscroll < scroll) caro.rotation += caro.theta;
        else caro.rotation += caro.theta * -1;
        lastscroll = scroll;
        caro.modify();
    }
});