editing website, run*:
$ von
$ server3 
$ voff

updating CSS/JS assets:
$ ./min



========================

tools:

https://www.minifier.org/
https://www.uglifyjs.net/
https://compressjpeg.com/

to set up venv run:

$ python3 -m venv venv
$ source venv/bin/activate
$ curl https://bootstrap.pypa.io/get-pip.py | python && pip install --upgrade setuptools

to install libs run
$ source venv/bin/activate
$ pip install csscompressor
$ pip install jsmin

to enter venv run*: 
von

to exit venv run*: 
voff

to run minifier:
python3 min.py

* >> alias is specific to device





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

            // image opener trigger
            <a class="ps-trigger" data-target="__IMAGE_NAME__">__TEXT__</a>

            <div style="background: #fec107; color: #654404; padding: 8px 15px; border-radius: 8px; margin-bottom: 35px"><b>Update:</b> As of 2020, an updated documentation for this project is now on my website at <b><a href="http://hizalcelik.com/PROJ_ID" style="color: #654404">hiz.al/PROJ_ID</a></b>.</div>



========================

SIZES
(use JPEGMini and https://compressjpeg.com/)

= GALLERY =
gallery-l       2000    max-longest
gallery-m       1200    max-longest
gallery-s       800     max-longest
gallery-xs      500     max-longest, quality = 10%

= SEARCH =
thumb           500     square
thumb-s         256     square

= INDIE =
full            2000    max-longest
thumb-2x        400     max-height
thumb           200     max-height
thumb-s         100     max-height
thumb-xs        100     max-height, quality = 10%


========================

PACKAGES

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