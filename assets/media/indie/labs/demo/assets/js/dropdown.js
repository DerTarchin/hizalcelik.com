// reposition dropdown if off-screen
$(function() {
  function dropdown_reposition(el) {
    if (el.length) {
      var l = el.offset().left,
          w = el.width();

      if (l + w > $(window).width() - 15) {
        el.css('margin-left', '-' + ((l + w) - $(window).width() + 15) + 'px');
      }
      else if(el.css('display') == 'none') {
        el.css('margin-left', '');
      }
    }
  }
  $('.dropdown, .dropdown-submenu, .dropdown-menu').on('mouseenter mouseleave', function(e) { dropdown_reposition($('ul', this)); });
  $('.dropdown, .dropdown-submenu, .dropdown-menu').on('click', function(e) { 
    var elem = $('ul', this);
    setTimeout( function() { 
      dropdown_reposition(elem);
    }, 1);
  });
});