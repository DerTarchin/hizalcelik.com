var activeCategory = "", activeWork = "", galleryCallback;

(function(){
  var sidenav = document.createElement("section");
  sidenav.setAttribute('id', "sidenav");
  sidenav.className = "sidenav";

  var ul = document.createElement("ul");
  ul.innerHTML += "<li id='sidenav-search'><a class='direct' href='/search'>All Works</a></li>" 
                + "<li id='sidenav-about'><a class='direct' href='/about'>About Me</a></li>"
                // + "<li id='sidenav-dump'><a class='direct' href='/dump'>Creative Dump</a></li>"
                + "<li class='divider'></li>";
  $('#nav li:not(#nav-more) a').each(function(el) {
    var t = $(el).text();
    ul.innerHTML += "<li id='sidenav-" + t.toLowerCase() + "'><a href='/?c=" 
                  + t.toLowerCase() + "'>" + t + "</a></li>";
  });
  ul.innerHTML += close_tmpl;
  sidenav.appendChild(ul);

  $('body').append($(sidenav));

  function checkForActiveLinks() {
    activeCategory = "";
    activeWork = "";
    // check for active page
    $('#nav li.active, #sidenav li.active').removeClass("active");
    var page_info = $('html').attr('data-page');
    if(page_info === "about") $('#sidenav-about').addClass("active");
    else if(page_info === "dump") $('#sidenav-dump').addClass("active");
    else if(page_info === "search") {
      $('#sidenav-search').addClass("active");
      $('#nav-more').addClass("active");
    }
    else if(page_info !== "gallery" && !window.location.href.includes('/'+page_info)) window.location.reload(); 
    else if(page_info === "gallery") {
      var params = getJsonFromUrl();
      if("c" in params) {
        activeCategory = params.c.split("/")[0];
        $('#nav-'+activeCategory).addClass('active');
        $('#sidenav-'+activeCategory).addClass('active');
      }
      if("w" in params) activeWork = params.w.split("/")[0];
      if(typeof galleryCallback !== 'undefined') galleryCallback();
    }
  }
  checkForActiveLinks();

  // $('#nav-more, #nav-mobile').on('click', function(){ $("#sidenav").addClass('vis') });
  $('#nav-mobile').on('click', function(){ $("#sidenav").addClass('vis') });
  $('#sidenav').on('click', function(){ $("#sidenav").removeClass('vis') });
  $('html[data-page="gallery"] #nav, html[data-page="gallery"] #sidenav').on('click', function(e) {
    var el = $(e.target);
    if(el.attr('id') === "home") return; // temporary, until about me page link is restored
    if(el.parent().attr('id') === "nav-more") return;
    if(el.is("a") && !el.hasClass('direct')) { // el[0] != e.currentTarget
      $.stop(e);
      // hide sidenav
      if($(this).attr('id') === "sidenav") $(this).removeClass('vis');
      // change active classes
      var li = el.parent();
      activeCategory = el.text().toLowerCase();
      if(el.attr('id') === "home") activeCategory = "";
      if(li.hasClass('active') || li.attr('id') === "more") return;
      $('#nav li.active, #sidenav li.active').removeClass('active');
      $('#nav-'+activeCategory).addClass('active');
      $('#sidenav-'+activeCategory).addClass('active');
      // update URL and browser history
      var params = activeCategory !== "" ? "?c=" + activeCategory.toLowerCase() : ""
      history.pushState(null, null, window.location.href.split("?")[0] + params);
      // homepage
      if(params === "") { 
        var ga_page = "/";
        ga('set', 'page', ga_page);
        ga('send', 'pageview');
      }
      if(typeof galleryCallback !== 'undefined') galleryCallback();
    }
    e.stopPropagation();
  });
  window.addEventListener('popstate', checkForActiveLinks);

  function sidebarKeyShortcut(e) {
    if(e.target.nodeName === 'INPUT') return;
    var modded = false;
    if(e.key === '/' || e.which === 191 || e.code === 'Slash') {
      modded = true;
      $("#sidenav").addClass('vis');
    }
    if($("#sidenav").hasClass('vis')) {
      if((e.key || e.code) === 'Escape' || e.which === 27) {
        modded = true;
        $("#sidenav").removeClass('vis');
      }
      if(e.key === 's' || e.which === 83 || e.code === 'KeyS') {
        $("#sidenav #sidenav-search a")[0].click();
      }
    }
    if(modded) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  document.addEventListener('keydown', sidebarKeyShortcut)
})();