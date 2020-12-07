(function(){
  var dir = {},
      dir_tags = {},
      dir_tags_hidden = {}, // not to be autocompleted
      ul = $('#index-thumbs'),
      thumb_tmpl = $('#thumb-tmpl').html(),
      tooltip = $('#tooltip'),
      awe, // awesomplete
      blazyTimeout, // blazy timeout
      filterVal = "",
      activeList = [],
      hidden_doodles = [],
      activeTags = [],
      abbrevs = {
        "js": "javascript",
        "ai": "artificial intelligence",
        "ml": "machine learning",
        "hci": "human-computer interaction",
        "hri": "human-robot interaction",
        "cgi": "computationally generated image",
        "rc": "remote controlled",
        "pro.": "professional",
        "misc.": "miscellaneous",
        "sci-fi": "science fiction",
        "ui-ux": "user interface / experience",
        "ui": "user interface",
        "ux": "user experience",
        "science fiction": "sci-fi",
        "ems": "electronic media studio",
        "ems:": "electronic media studio:",
        "datavis": "data visualization",
        "excap": "experimental capture"
      },
      showDoodles = !!$('#doodle').attr('checked'),
      currTooltip;

  function updateCounter() {
    var count = activeList.length - hidden_doodles.length;
    $('#count')[0].innerHTML = count + ' project' + (count === 1 ? '' : 's');
  }

  function hideDoodles() {
    hidden_doodles = [];
    for(var i=0; i<activeList.length; i++) {
      li = activeList[i];
      if(showDoodles) $(li).show();
      else {
        var visible = true;
        for(var j=0; j<Object.keys(dir).length; j++) {
          if(visible && dir[Object.keys(dir)[j]].el === li && (p_cache.work[Object.keys(dir)[j]] || {}).doodle) {
            $(li).hide();
            hidden_doodles.push(li)
            visible = false;
          }
        }
      }
    }
    updateCounter();
  }

  function filter() {
    clearTimeout(blazyTimeout);
    var currVal = awe.input.value.toLowerCase().trim();
    // exit if nothing changed
    if(currVal === filterVal) return hideDoodles(); 
    // show all if no filter
    else if(currVal === "") $('#index-thumbs li').show(); 
    // stricter filter so only apply to currently visible
    else if(currVal.length > 1 && filterVal.length > 1
        && currVal.length > filterVal.length 
        && currVal.startsWith(filterVal)
        && !currVal.includes(',')
        && !currVal.includes('+')) { 
      for(var i=0; i<activeList.length; i++) $(activeList[i]).hide();
      activeList = [];
      var newActiveTags = [];
      for(var i=0; i<activeTags.length; i++) {
        if(activeTags[i].includes(currVal)) {
          for(var j=0; j<dir_tags[activeTags[i]].length; j++) {
            $(dir_tags[activeTags[i]][j]).show();
            if(!activeList.includes(dir_tags[activeTags[i]][j])) {
              activeList.push(dir_tags[activeTags[i]][j]);
            }
          }
          newActiveTags.push(activeTags[i]);
        }
      }
      activeTags = newActiveTags;
    }
    else { // complete new filter search, or compound search
      activeTags = [];
      activeList = [];
      $('#index-thumbs li').hide();
      // search for single queries
      for(tag in dir_tags) {
        // check if tag includes anything from CSVs:
        var includes = false, csv = currVal.split(',');
        for(var k=0; k<csv.length; k++) {
          var clean = csv[k].trim();
          if(!clean.length) continue;
          // check for compound searches
          var split = clean.split('+').filter(function(j) { return j.trim() });
          if(split.length !== 1) continue;
          clean = split[0].trim();
          if(!clean) continue;
          // check for exact matches (uses "quotes")
          if(clean.includes("\"")) {
            if(tag === clean.substring(1, clean.length - 1)) includes = true
          }
          // check if tag contains query
          else if(tag.includes(clean)) includes = true;
        }
        if(includes) {
          for(var i=0; i<dir_tags[tag].length; i++) {
            $(dir_tags[tag][i]).show();
            if(!activeList.includes(dir_tags[tag][i])) {
              activeList.push(dir_tags[tag][i]);
            }
          }
          activeTags.push(tag);
        }
      }
      // search for compound queries
      if(currVal.includes('+')) {
        var csv = currVal.split(',').filter(function(k){ return k.includes('+') });
        for(var k=0; k<csv.length; k++) {
          var split = csv[k].split('+').filter(function(j) { return j.trim() });
          if(split.length < 2) continue;
          Object.keys(dir).filter(function(id){
            var hasAll = true;
            for(var q=0; q<split.length; q++) { 
              if(!hasAll) break;
              var hasQuery = false;
              for(var ti=0; ti<dir[id].tags.length; ti++) {
                var clean = split[q].trim();
                // check for exact matches (uses "quotes")
                if(clean.includes("\"")) {
                  if(dir[id].tags[ti] === clean.substring(1, clean.length - 1)) {
                    hasQuery = true;
                    break;
                  }
                }
                // check if tag contains query
                else if(dir[id].tags[ti].includes(clean)) {
                  hasQuery = true;
                  break;
                }
              }
              if(!hasQuery) hasAll = false;
            }
            if(hasAll) {
              $(dir[id].el).show();
              if(!activeList.includes(dir[id].el))
              activeList.push(dir[id].el);
            }
          })
        }
      }
    }
    filterVal = currVal;
    hideDoodles();

    blazyTimeout = setTimeout(function(){ 
      blazy.revalidate();
      setTimeout(function(){ blazy.revalidate() }, 1500);
    }, 500);
  }

  function initDirectory() {
    var frag = document.createDocumentFragment();

    function processTmpl(data, tags) {
      var li = document.createElement("li");
      activeList.push(li);
      if(data.id) li.id = data.id;
      li.setAttribute('data-title', data.title);
      li.setAttribute('data-year', data.year);
      if(!data.info && data.group_id) {
        li.setAttribute('data-info', p_cache.work[data.group_id].info)
      } else {
        li.setAttribute('data-info', data.info);
      }
      li.setAttribute('data-thumb', data.thumb);
      function addTag(tag) {
        if(!dir_tags[tag]) dir_tags[tag] = [li];
        else dir_tags[tag].push(li);
        var id = data.group_id ? data.title : data.id;
        if(!dir[id]) dir[id] = {
          el: li,
          tags: [id]
        };
        if(!dir[id].tags.includes(tag+'')) dir[id].tags.push(tag+'');
      }
      function addHiddenTag(tag) {
        if(!(tag in dir_tags_hidden)) dir_tags_hidden[tag] = [li];
        else dir_tags_hidden[tag].push(li);
      }
      // if videos supported, and video exists, use video template
      li.innerHTML = tmpl(thumb_tmpl, data);
      // append child
      frag.appendChild(li);
      // add element to tags in map
      
      // add title
      addTag(data.title.toLowerCase());

      // add shortcut-corrected title
      var shortcut_title = data.title.toLowerCase().split(' ');
      for(var i=0; i<shortcut_title.length; i++) {
        if(shortcut_title[i] in abbrevs) shortcut_title[i] = abbrevs[shortcut_title[i]]
      }
      shortcut_title = shortcut_title.join(' ');
      if(shortcut_title !== data.title.toLowerCase()) addTag(shortcut_title)
      
      // add years (parse text like "2015-17,2019")
      var years = typeof data.year === 'string' ? data.year.split(/[/s ,]+/) : [data.year];
      // add range (such as "2015-18" > 2015,2016,2017,2018)
      for(var i=0, l=years.length; i<l; i++) {
        if(typeof years[i] === 'string' && years[i].includes('-')) {
          var range = years[i].split('-');
          // e.g. convert 18 > 2018
          if(parseInt(range[1], 10) < 100) range[1] = parseInt(range[1], 10) + 2000;
          years[i] = range[0];
          var currYear = parseInt(range[0],10);
          while(currYear !== range[1]) {
            currYear++;
            years.push(currYear);
          }
        }
      }
      for(var i=0; i<years.length; i++) {
        // e.g. convert 18 >> 2018
        if(parseInt(years[i], 10) < 100) years[i] = parseInt(years[i], 10) + 2000;
        else years[i] = parseInt(years[i], 10);
        addHiddenTag(years[i]);
      }
      
      // add shortcut tags
      for(var i=0; i<tags.length; i++) {
        var tag = tags[i].toLowerCase().split(' ');
        for(var j=0; j<tag.length; j++) if(tag[j] in abbrevs) tag[j] = abbrevs[tag[j]];
        tag = tag.join(' ');
        if(tag !== tags[i].toLowerCase()) tags.push(tag);
      }

      // add included tags
      for(var i=0; i<tags.length; i++) addTag(tags[i].toLowerCase())

      // add ID to hidden tags
      var id = (data.group_id || data.id).toLowerCase();
      addHiddenTag(id);

      // add "doodle" status to hidden tags
      if("doodle" in data) {
        addHiddenTag("doodle");
        addHiddenTag("creative experiment");
      }
      
      // add gallery categories
      var cats = Object.keys(p_cache.gallery);
      for(var i=0; i<cats.length; i++) {
        for(var j=0; j<p_cache.gallery[cats[i]].split(", ").length; j++) {
          if(p_cache.gallery[cats[i]].split(", ")[j].includes(id) && "group_id" in data) addTag(p_cache.work[id].title.toLowerCase())
        }
      }
    }

    for(var w in p_cache.work) { // iterate through projects
      var work = p_cache.work[w]; // current work
      if("dirignore" in work) continue; // skip directory-ignored items
      var tags = "tags" in work ? work.tags.split(', ') : [];
      if("meta" in work) {
        var meta = work.meta.split(', ');
        for(var m=0; m<meta.length; m++) tags.push(meta[m]);
      }
      if("group" in p_cache.work[w]) {
        for(var j=0; j<p_cache.work[w]['group'].length; j++)
          processTmpl(p_cache.work[w]['group'][j], tags);
      }
      else processTmpl(p_cache.work[w], tags);
    }

    ul[0].appendChild(frag);
    awe.list = Object.keys(dir_tags).sort();
    for(key in dir_tags_hidden) dir_tags[key] = dir_tags_hidden[key]
    filter();
  }

  // Process current URL, set value of searchbox
  var params = getJsonFromUrl();
  if("k" in params) {
    $('#filter')[0].value = params.k.split('/')[0];
  }

  // deferred scripts until page load
  function deferred() {
    // start Awesomplete
    awe = new Awesomplete($("#filter")[0], { minChars: 1 });

    // get data if not got yet
    // init the directory
    function getProjectData(res, err) {
      if(err) return
      parseDirectory(res);
      initDirectory();
    }
    if(!p_cache) getFile(project_data_url, getProjectData);
    else initDirectory();

    setTimeout(function() { blazy.revalidate() }, 50); // avoid non-trigger glitch
    setTimeout(function() { blazy.revalidate() }, 1000); // just in case?

    function filterAndURL() {
      setTimeout(function(){
        filter();
        var url_addition = filterVal === "" ? "" : "?k=" + filterVal + "/";
        var new_url = window.location.href.split('?')[0] + url_addition;
        history.replaceState(null, null, new_url);
        var ga_page = "/search/" + url_addition;
        ga('set', 'page', ga_page);
        ga('send', 'pageview');
      },0);
    }

    function doodleAndFilter(e) {
      setTimeout(function(){
        showDoodles = e.target.checked;
        filter();
      },0);
    }

    $('#filter').on('keyup', filter);
    $('#filter').on('change', filterAndURL);
    $('#filter').on('awesomplete-select', filterAndURL);
    $('#doodle').on('change', doodleAndFilter);

    // desktop only features
    if(!isMobile()) {
      // auto focus on input if on desktop
      $("#filter")[0].focus();

      // track mouse movements for tooltip effect
      var tooltipTitle = tooltip[0].querySelector('#tooltip_title');
      var tooltipInfo = tooltip[0].querySelector('#tooltip_info');
      var tooltipYear = tooltip[0].querySelector('#tooltip_year');
      var tooltipImg = tooltip[0].querySelector('#tooltip_img');
      function showTooltip(e) {
        var li = getClosestParent(e.target, 'li');
        if(li) {
          var thumb = li.getAttribute('data-thumb');
          if(thumb === currTooltip) return;
          tooltip.addClass('show');
          currTooltip = thumb;
          tooltipTitle.innerHTML = li.getAttribute('data-title');
          tooltipYear.innerHTML = li.getAttribute('data-year');
          tooltipInfo.innerHTML = li.getAttribute('data-info');
          tooltipImg.style.backgroundImage = 'url(/assets/media/thumb/' + li.getAttribute('data-thumb') + ')';
        }
      }
      function hideTooltip(e) {
        tooltip.removeClass('show');
      }
      ul.on('mousemove', showTooltip);
      ul.on('mouseleave', hideTooltip);
    }
  }
  if(document_loaded) deferred();
  window.addEventListener('load', deferred);
})();