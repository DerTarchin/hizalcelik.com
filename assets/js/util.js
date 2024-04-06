var project_data_url = "/directory.json",
    p_cache,
    blazy = new Blazy({breakpoints:[{width:767,src:'data-src-s'},{width:1200,src:'data-src-m'}]}),
    document_loaded = false;

var close_tmpl = '<div class="close-container"><div class="nav-btn close"><svg viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="1" y1="11" x2="11" y2="1"/><line x1="1" y1="1" x2="11" y2="11"/></svg></div></div>';

function parseDirectory(file) {
  p_cache = JSON.parse(file);

  // add "id" field to all projects, based on the key
  if((p_cache || {}).work) { 
    var keys = Object.keys(p_cache.work)
    for(var i=0; i<keys.length; i++) {
      // set id
      p_cache.work[keys[i]].id = keys[i];
      // set id for group elements
      if(p_cache.work[keys[i]].group) {
        for(var j=0; j<p_cache.work[keys[i]].group.length; j++) {
          p_cache.work[keys[i]].group[j].group_id = keys[i];
        }
      }
      // set thumb if it doesn't exist
      if(!p_cache.work[keys[i]].thumb) {
        p_cache.work[keys[i]].thumb = keys[i] + '.jpg';
      }
      // set thumb_vid if it needed, and isn't defined
      if([true,1].includes(p_cache.work[keys[i]].thumb_vid)) {
        p_cache.work[keys[i]].thumb_vid = keys[i] + '.mp4';
      }
    }
  }

  // add "id" field to intro objects for gallery
  if((p_cache || {}).intro) {
    for(var i=0; i<p_cache.intro.length; i++) {
      p_cache.intro[i].id = 'intro_' + i;
    }
  }
}

function getFile(url, fn) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      fn(request.responseText, 0);
    } else {
      fn(null, "Server error has occured.");
      setTimeout(request.send, 500);
    }
  };
  request.onerror = function() {
    fn(null, "Server connection error has occured.");
    setTimeout(request.send, 500);
  };
  request.send();
}

function isMobile() {
  return window.screen.width <= 767;
}
if(isMobile()) $('html').addClass('mobile');

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(search, this_len) {
    if (this_len === undefined || this_len > this.length) {
      this_len = this.length;
    }
        return this.substring(this_len - search.length, this_len) === search;
  };
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {
      if (this == null) throw new TypeError('"this" is null or not defined');
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) return false;
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }
      while (k < len) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
}

if (!String.prototype.includes) {
  Object.defineProperty(String.prototype, 'includes', {
    value: function(search, start) {
      if (typeof start !== 'number') {
        start = 0
      }
      
      if (start + search.length > this.length) {
        return false
      } else {
        return this.indexOf(search, start) !== -1
      }
    }
  })
}

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}

function getJsonFromUrl(hashBased) {
  var query;
  if(hashBased) {
    var pos = location.href.indexOf("?");
    if(pos==-1) return [];
    query = location.href.substr(pos+1);
  } else {
    query = location.search.substr(1);
  }
  var result = {};
  query.split("&").forEach(function(part) {
    if(!part) return;
    var eq = part.indexOf("=");
    var key = eq>-1 ? part.substr(0,eq) : part;
    var val = eq>-1 ? decodeURIComponent(part.substr(eq+1)) : "";
    var from = key.indexOf("[");
    if(from==-1) result[decodeURIComponent(key)] = val;
    else {
      var to = key.indexOf("]",from);
      var index = decodeURIComponent(key.substring(from+1,to));
      key = decodeURIComponent(key.substring(0,from));
      if(!result[key]) result[key] = [];
      if(!index) result[key].push(val);
      else result[key][index] = val;
    }
  });
  return result;
}

// https://codepen.io/anon/pen/YXyyMJ
function areClipPathShapesSupported() {
  var base = 'clipPath',
      prefixes = [ 'webkit', 'moz', 'ms', 'o' ],
      properties = [ base ],
      testElement = document.createElement('testelement'),
      attribute = 'polygon(50% 0%, 0% 100%, 100% 100%)';

  for(var i=0; i<prefixes.length; i++) {
    var prefixedProperty = prefixes[i] + base.charAt(0).toUpperCase() + base.slice(1);
    properties.push(prefixedProperty);
  }

  for(var i=0; i < prefixes.length; i++) {
    var property = properties[i];
    if(testElement.style[property] === '') {
      testElement.style[property] = attribute;
      if(testElement.style[property] !== '') return true
    }
  }
  return false;
};
if(areClipPathShapesSupported()) $('html').addClass('clippath');
else $('html').addClass('no-clippath');


/*
* CHECKS FOR VIDEO AUTPLAY SUPPORT
*/
var checkVideoAutplaySupport = function(e) {
  if(e) {
    document.removeEventListener('touchstart', checkVideoAutplaySupport)
    document.removeEventListener('click', checkVideoAutplaySupport)
  }
  var checkVideoObj = function(callback) {
    var v = document.createElement("video");
    v.src = "";
    v.pause()
    var returnFn = function(p) {
      typeof callback === "function" && callback(!v.paused || "Promise" in window && p instanceof Promise);
    }
    var p = "play" in v;
    if(p) {
      var playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.then(function() {
          returnFn(p)
        }).catch(function(error) {
          returnFn(p)
        });
      }
    } else {
      returnFn(p)
    }
  };
  if($('html').hasClass('videoautoplay')) return;
  else $('html').removeClass('no-videoautoplay');
  checkVideoObj(function(supported) {
    if(supported) $('html').addClass('videoautoplay');
    else $('html').addClass('no-videoautoplay');
  });
}
checkVideoAutplaySupport();
// if mobile, use touch event
if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
  // document.addEventListener('touchstart', checkVideoAutplaySupport)
  // temporarily disabled as probs mobile browsers won't permit it, plus it returns true... idk why
} else {
  document.addEventListener('click', checkVideoAutplaySupport)
}

/**
 * Simulate a click event.
 * https://gomakethings.com/how-to-simulate-a-click-event-with-javascript/
 * @param {Element} elem  the element to simulate a click on
 */
var simulateClick = function (elem) {
    // Create our event (with options)
    var evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    // If cancelled, don't dispatch our event
    var canceled = !elem.dispatchEvent(evt);
};

// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('prepend')) {
      return;
    }
    Object.defineProperty(item, 'prepend', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function prepend() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();
        
        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        
        this.insertBefore(docFrag, this.firstChild);
      }
    });
  });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

(function() {
  setInterval(function(){ blazy.revalidate() }, 1500); // sometimes necessary
  window.addEventListener('load', function() { document_loaded = true });
  
  var hasHoverClass = false,
      lastTouchTime = 0;

  function enableHover() {
    if(hasHoverClass || (new Date()-lastTouchTime < 500)) return;
    $('html').addClass('hover');
    $('html').removeClass('no-hover');
    hasHoverClass = true;
  }

  function disableHover() {
  if (!hasHoverClass) return;
    $('html').removeClass('hover');
    $('html').addClass('no-hover');
    hasHoverClass = false;
  }

  function updateLastTouchTime() {
    lastTouchTime = new Date();
  }

  document.addEventListener('touchstart', updateLastTouchTime, true);
  document.addEventListener('touchstart', disableHover, true);
  document.addEventListener('mousemove', enableHover, true);
  enableHover();
})()

function getClosestParent(elem, selector) {
  // Element.matches() polyfill
  if (!Element.prototype.matches) {
      Element.prototype.matches =
          Element.prototype.matchesSelector ||
          Element.prototype.mozMatchesSelector ||
          Element.prototype.msMatchesSelector ||
          Element.prototype.oMatchesSelector ||
          Element.prototype.webkitMatchesSelector ||
          function(s) {
              var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                  i = matches.length;
              while (--i >= 0 && matches.item(i) !== this) {}
              return i > -1;
          };
  }
  // Get the closest matching element
  for ( ; elem && elem !== document; elem = elem.parentNode ) {
    if ( elem.matches( selector ) ) return elem;
  }
  return null;
};
