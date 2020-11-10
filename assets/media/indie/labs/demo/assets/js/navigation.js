$(function() {
    function createMore(navlist) {
        var html = '<li class="navbar-more dropdown"><a data-toggle="dropdown" aria-expanded="false">More<span class="caret"></span></a><ul class="dropdown-menu" role="menu"></ul></li>';
        $(navlist).append(html);
    }

    function showMore(more) {
        if($(more).length > 0) {
            $(more).css('display', 'inline-block');
        }
    }

    function hasChildren(item) {
        return $(item).length != 0 && $(item).children().length > 0;
    }

    function add(navlist, morelist) {
        var $child = $(navlist).children(':not(.navbar-more)').last();
        $child.attr('orig-width', $child.outerWidth());
        if($child.hasClass('dropdown')) {
            $child.find('a > span.caret').hide();
            $child.addClass('dropdown-submenu');
            $child.removeClass('dropdown');
        }
        $child.prependTo($(morelist));
    }

    function rem(morelist) {
        var $child = $(morelist).children().first();
        if($child.hasClass('dropdown-submenu')) {
            $child.find('a > span.caret').show();
            $child.removeClass('dropdown-submenu');
            $child.addClass('dropdown');
        }
        $child.insertBefore($(morelist).parent());
    }

    function showElement(element) {
        $(element).css('display', 'inline-block');
    }

    function hideElement(element) {
        $(element).attr('orig-width', $(element).outerWidth());
        $(element).hide();
    }

    function exists(element) {
        return $(element).length;
    }

    function hasHiddenExtras(navbar) {
        var $branding = $('.navbar-brand', $(navbar));
        var $brand = $('.brand', $branding);
        var $icon = $('.ln-icon-logo', $branding);
        var $form = $('.navbar-nav form', $(navbar));

        // if($branding.length && !$branding.is(":visible")) { return true; }
        if($brand.length && !$brand.is(":visible")) { return true; }
        if($icon.length && !$icon.is(":visible")) { return true; }
        if($form.length && !$form.is(":visible")) { return true; }
    }

    function hasVisibleExtras(navbar) {
        var $branding = $('.navbar-brand', $(navbar));
        var $brand = $('.brand', $branding);
        var $icon = $('.ln-icon-logo', $branding);
        var $form = $('form', $(navbar));

        // if($branding.length && $branding.is(":visible")) { return true; }
        if($brand.length && $brand.is(":visible")) { return true; }
        if($icon.length && $icon.is(":visible")) { return true; }
        if($form.length && $form.is(":visible")) { return true; }
    }
  
    function manage_nav() {
        $('.webapp .navbar-app:not(.no-more) .navbar-right').each(function() {
            var $navbar = $(this).parents('.navbar');
            var $right = $(this);
            var $prev = $right.prev();

            var $navlist = $(this).siblings('.navbar-nav');
            if(!exists($navlist)) { return; }

            if(!exists($('.navbar-more', $navlist))) { createMore($navlist); }
            var $more = $('.navbar-more', $navlist);
            var $morelist = $('> .dropdown-menu', $more);

            // Extras
            var $branding = $('.navbar-brand', $navbar);
            var $brand = $('.brand', $branding);
            var $icon = $('.ln-icon-logo', $branding);
            var $form = $(this).siblings('form');

            // check if mobile-friendly navbar is in mobile-view
            if(!$navbar.hasClass('non-responsive')) {
                if($(window).width() <= 767 && hasChildren($morelist)) {
                    while(hasChildren($morelist)) {
                        rem($morelist);
                    }
                    $more.hide();
                    return;
                }
            }

            // check distance between navbar-right and closest navbar element
            if($navlist.children(':not(.navbar-more)').length > 0) {                
                var dist = $right.offset().left - ($prev.offset().left + $prev.outerWidth());                
                if(dist < 20 || $right.offset().top > $navbar.offset().top) { // check if menu is on second row
                    showMore($more);            
                    add($navlist, $morelist);
                    manage_nav()
                }
            }
            else {
                var dist = $right.offset().left - ($prev.offset().left + $prev.outerWidth());
                if((dist < 20 || $right.offset().top > $navbar.offset().top)
                    && (hasVisibleExtras($navbar))) { 

                    if($brand.is(":visible")) { 
                        hideElement($brand); 
                        manage_nav(); 
                    }
                    else if($icon.is(":visible")) { 
                        hideElement($icon); 
                        manage_nav(); 
                    }
                    else if($form.is(":visible")) { 
                        hideElement($form); 
                        manage_nav(); 
                    }
                }
                else {
                    if($form.length && !$form.is(":visible")) {
                        if(dist > parseInt($($form).attr('orig-width'), 10)) {
                            showElement($form);
                            manage_nav();
                        }
                    }
                    else if($icon.length && !$icon.is(":visible")) {
                        if(dist > 41 + parseInt($($icon).attr('orig-width'), 10)) {
                            showElement($icon);
                            manage_nav();
                        }
                    }
                    else if($brand.length && !$brand.is(":visible")) {
                        if(dist > 41 + parseInt($($brand).attr('orig-width'), 10)) {
                            showElement($brand);
                            manage_nav();
                        }
                    }
                }
            }
            // check distance to see if any menu items can be restored from 'navbar-more' list
            if(hasChildren($morelist)) {
                if(hasHiddenExtras($navbar)) { return; }
                var newSpace = parseInt($(':first-child', $morelist).attr('orig-width'), 10);
                var dist = $right.offset().left - ($prev.offset().left + $prev.outerWidth());
                if(dist > 41 + newSpace) {
                    rem($morelist);
                    manage_nav()
                }
                else if($morelist.children().length == 1
                    && dist + $more.outerWidth() > 41 + newSpace) {
                    rem($morelist);
                    $more.hide();
                    manage_nav()
                }
            }
        });
    }
    $(window).resize(function() { manage_nav(); }); 
    $(document).ready(function() { setTimeout(manage_nav, 0); });
});