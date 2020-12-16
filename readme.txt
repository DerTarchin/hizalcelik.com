editing website, run*:
$ von
$ server3 
$ voff

updating CSS/JS assets:
$ ./min


========================


>> TOOLS:
https://www.minifier.org/
https://www.uglifyjs.net/
https://compressjpeg.com/
https://compresspng.com/
https://autoprefixer.github.io/
https://ezgif.com/

>> VENV SETUP:
$ python3 -m venv venv
$ source venv/bin/activate
$ curl https://bootstrap.pypa.io/get-pip.py | python && pip install --upgrade setuptools

>> INSTALL LIBS
$ source venv/bin/activate
$ pip install csscompressor
$ pip install jsmin

>> START VENV*: 
von

>> EXIT VENV*: 
voff

>> RUN MINIFIER:
python3 min.py

* -> alias is specific to device


========================


            // main pic
            <div class="spaced ps-img full"></div>

            // double main pic (use class "with-gap" to add 5px space between images)
            <div class="ps-img spaced full img-double"></div>

            // gallery
            <blockquote class="col">
                <div class="card-gallery"><div class="ps-img img-grid"></div></div>
                <div class="text">
                    <h3>__TITLE__</h3>
                    <p>__TEXT__</p>
                </div>
            </blockquote>

            // image-text combo
            <blockquote>
                <div class="card-img ps-img"></div>
                <div class="text">
                    <h3>__TITLE__</h3>
                    <p>__TEXT__</p>
                </div>
            </blockquote>

            // prefilled card image (for GIFs) 
            <div class="card-img ps-img prefilled">
                <a href="/assets/media/indie/__PAGE__/__FILE__" data-size="__SIZE__" id="__ID__">
                    <img class="b-lazy" data-src="/assets/media/indie/__PAGE__/__FILE__" src="/assets/media/indie/__PAGE__/__FILE__" alt="__TITLE__" data-caption="__CAPTION__">
                </a>
            </div>

            // vimeo
            <div class="responsive-embed spaced">
                <iframe class="b-lazy" data-src="https://player.vimeo.com/video/__VID_ID__?color=ffffff&title=0&byline=0&portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
            </div>
            muted: autoplay=1&loop=1&color=ffffff&title=0&byline=0&portrait=0&muted=1

            // youtube (autoplay, muted)
            <div class="spaced responsive-embed">
                <iframe class="b-lazy" src="https://www.youtube.com/embed/__VID_ID__?rel=0&showinfo=0&autoplay=1&mute=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>

            // subtitle, right-aligned
            <p class="sub ta-right">TEXT</p>

            <blockquote class="col">
                <div class="code-window">
                    <pre>
                        <code>
__CODE__
                        </code>
                        <div class="srclink">
                            __FILE__ (<a target="_blank" href="__LINK__">source</a>)
                        </div>
                    </pre>
                </div>
                <div class="text">
                    <h4 style="display: inline-block; margin-right: 10px">__TITLE__</h4>
                    <em>__SUBTITLE__</em>
                </div>
            </blockquote>

            for < symbol in code:
            &#x3008;

            // source code link
            <blockquote class="source">
                <div class="card-img-static"><a target="_blank" href="__LINK__"><img src="/assets/media/source.jpg"></a></div>
                <a target="_blank" href="__LINK__" class="text">
                    <h3>View the source code</h3>
                </a>
            </blockquote>

            // doc link
            <blockquote class="source">
                <div class="card-img-static"><a target="_blank" href="__LINK__"><img src="/assets/media/doc.jpg"></a></div>
                <a target="_blank" href="__LINK__" class="text">
                    <h3>View the document</h3>
                </a>
            </blockquote>

            // media link
            <blockquote class="source">
                <div class="card-img-static"><a target="_blank" href="__LINK__"><img src="/assets/media/media.jpg"></a></div>
                <a target="_blank" href="__LINK__" class="text">
                    <h3>View the file</h3>
                </a>
            </blockquote>

            // image opener trigger
            <a class="ps-trigger" data-target="__IMAGE_NAME__">__TEXT__</a>

            <div style="background: #fec107; color: #654404; padding: 8px 15px; border-radius: 8px; margin-bottom: 35px"><b>Update:</b> As of 2020, an updated documentation for this project is now on my website at <b><a href="http://hizalcelik.com/PROJ_ID" style="color: #654404">hiz.al/PROJ_ID</a></b>.</div>


========================


>> SIZES
images >> use JPEGMini and https://compressjpeg.com/ or https://compresspng.com/
gifs >> use https://ezgif.com/
videos >> use https://cloudconvert.com/

= GALLERY =
gallery-l       2000    max-longest
gallery-m       1200    max-longest
gallery-s       800     max-longest
gallery-xs      500     max-longest, quality = 10%

= SEARCH =
thumb           500     square
thumb-s         256     square
thumb (vid)     500     sqaure (use cloudconvert.com to convert to .mp4 of quality 30-40, no audio)

= INDIE =
full            2000    max-longest
thumb-2x        400     max-height
thumb           200     max-height
thumb-s         100     max-height
thumb-xs        100     max-height, quality = 10%      
thumb-xs (gif)  25      max-height (with ideal size: 1-30kb)
                        ^ can also cut framerate (slower speed), max frames to 25,50


========================


>> PACKAGES

> main.pkgd.js
  modernizr.min.js
  ki.min.js
  anime.min.js
  tmpl.min.js
  revealer.min.js
  blazy.min.js
  util.js
  nav.js

> indie.pkdg.js
  awesomplete.min.js
  photoswipe.min.js
  indie.js

> main.pkgd.css
  normalize.min.css
  animations.css
  photoswipe.min.css
  main.css
  indie.css


========================


>> TO USE DIRECTORY / GALLERY:
- "thumb": leave null for default `${id}.jpg`, or filename to override
- "thumb_vid": use "true" to default to `${id}.mp4` or filename to override
- "tags" are searchable tags, visible in project page footers and gallery projects
- "meta" are searchable tags, visible in project page footers only
- "url" used by All Works page to link the tile to a URL rather than project page
- "info" is used for subtitle in gallery page and tooltip for All Works page
== GALLERY ITEMS
- "img" is used for gallery page shards
- "style" defines the gallery page shart style (1-5)
- "btn" is text in the gallery page "view project" button


========================


>> NEW PAGE CHECKLIST
1)  ids, refs, descriptions correct in .js, .html
2)  directory updated with correct tags, meta, etc
3)  page category, tech, year and course/client is updated
4)  all asset images compressed
5)  search index thumbs created
6)  to_add updated
8)  if golan project, original link added to HTML and "edited" badge added to original documentaion
9)  if it is a doodle, mark as such in directory
7)  run "shorturl -sync" in terminal once pushed up
10) if a video was linked, video has the following text:

__DESCRIPTION__

You can learn more about this project at http://hiz.al/__LINK__