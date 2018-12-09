(function(){
  var dir = {},
      dir_tags = {},
      dir_tags_hidden = {}, // not to be autocompleted
      ul = $('#index-thumbs'),
      thumb_tmpl = $('#thumb-tmpl').html(),
      awe, // awesomplete
      blazyTimeout, // blazy timeout
      filterVal = "",
      activeList = [],
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
        "datavis": "data visualization"
      }

  function filter() {
    clearTimeout(blazyTimeout);
    var currVal = awe.input.value.toLowerCase().trim();
    // exit if nothing changed
    if(currVal === filterVal) return; 
    // show all if no filter
    else if(currVal === "") $('#index-thumbs li').show(); 
    // stricter filter so only apply to currently vis
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
            activeList.push(dir_tags[activeTags[i]][j]);
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
          clean = split[0].trim();
          if(split.length !== 1) continue;
          if(clean && tag.includes(clean)) includes = true;
        }
        if(includes) {
          for(var i=0; i<dir_tags[tag].length; i++) {
            $(dir_tags[tag][i]).show();
            activeList.push(dir_tags[tag][i]);
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
                if(dir[id].tags[ti].includes(split[q].trim())) {
                  hasQuery = true;
                  break;
                }
              }
              if(!hasQuery) hasAll = false;
            }
            if(hasAll) {
              $(dir[id].el).show();
              activeList.push(dir[id].el);
            }
          })
        }
      }
    }
    filterVal = currVal;
    blazyTimeout = setTimeout(function(){ 
      blazy.revalidate();
      setTimeout(function(){ blazy.revalidate() }, 1500);
    }, 500);
  }

  function initDirectory() {
    var frag = document.createDocumentFragment();

    function processTmpl(data, tags) {
      var li = document.createElement("li");
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
        // e.g. convert 18 > 2018
        if(parseInt(years[i], 10) < 100) years[i] = parseInt(years[i], 10) + 2000;
        else years[i] = parseInt(years[i], 10);
        addTag(years[i]);
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

      var id = (data.group_id || data.id).toLowerCase();
      if(!(id in dir_tags_hidden)) dir_tags_hidden[id] = [li];
      else dir_tags_hidden[id].push(li);
      
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
    awe = new Awesomplete($("#filter")[0], {
      minChars: 1
    });
    // get data if not got yet
    // init the directory
    function getProjectData(res, err) {
      if(err) return
      p_cache = JSON.parse(res);
      initDirectory();
    }
    if(typeof p_cache === "undefined") getFile(project_data_url, getProjectData);
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

    $('#filter').on('keyup', filter);
    $('#filter').on('change', filterAndURL);
    $('#filter').on('awesomplete-select', filterAndURL);
  }
  if(document_loaded) deferred();
  window.addEventListener('load', deferred);
})();