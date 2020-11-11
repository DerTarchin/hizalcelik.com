jQuery(function($) {
  $(document).ready(function() {

    $('.js-fadein').hide();
    $('.js-fadein').fadeIn(350, "easeOutExpo");

    /* -------------------------------- *
     * Initialize filters with isotope
     * -------------------------------- */
    var $win = $(window),
      $con = $('.filter-item-container'),
      $default_filter = $('.filters ul li.active').attr('data-filter');
      console.log($default_filter)

    $con.isotope({
      itemSelector: '.filter-item',
      layoutMode: 'fitRows',
      filter: $default_filter
    });

    $con.on('layoutComplete', function() {
      $win.trigger("scroll");
    });

    // hash of functions that match data-filter values
    var filterFns = {};

    // filter based on clicked link
    $('.filters').on('click', 'ul li:not(.ignore)', function() {
      var filterValue = $(this).attr('data-filter');
      // use filter function if value matches
      filterValue = filterFns[filterValue] || filterValue;
      $con.isotope({
        filter: filterValue
      });
    });

    // change is-checked class on buttons
    $('.filters').each(function(i, filters) {
      var $filterGroup = $(filters);
      $filterGroup.on('click', 'ul li:not(.ignore)', function() {
        $filterGroup.find('.active').removeClass('active');
        $(this).addClass('active');
      });
    });

    /* -------------------------------- *
     * Load imgages with lazyload
     * -------------------------------- */
    $(function() {
      $("img.lazy").lazyload({
        effect: "fadeIn",
        failure_limit: Math.max($("img.lazy").length - 1, 0),
        effectspeed: 500,
        threshold: 100
      });
    });
    window.addEventListener("load", function() {
      for (var i = 0; i < 500; i += 50)
        setTimeout(triggerScroll, i);
      setTimeout(triggerScroll, 10000);
    }, false);
    triggerScroll = function() {
      $win.trigger("scroll");
    }

    /* -------------------------------- *
     * Define smoothstate.js behavior
     * -------------------------------- */
    var loading_html = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 50 50" xml:space="preserve" class="loading-icon"><path d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"></path></svg>';
    $(function() {
      'use strict';
      var $page = $('#main'),
        options = {
          debug: true,
          prefetch: true,
          cacheLength: 0,
          onStart: {
            duration: 350,
            render: function($container) {
                $container.addClass('is-exiting');
                $('.list-panel').animate({width:'hide'},100)
                smoothState.restartCSSAnimations();
                $('.js-fadein').fadeOut(350, "easeOutExpo");
            }
          },
          onReady: {
            duration: 0,
            render: function($container, $newContent) {
                $container.removeClass('is-exiting');
                $container.html($newContent);
                for (var i = 0; i < 500; i += 50)
                    setTimeout(triggerScroll, i);
                setTimeout(triggerScroll, 10000);
            }
          }
        },
        smoothState = $page.smoothState(options).data('smoothState');
    });

});});
