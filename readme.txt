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

// gallery
<blockquote class="col">
    <div class="card-gallery"><div class="ps-img img-grid"></div></div>
    <div class="text">
        <h3>TITLE</h3>
        <p>TEXT</a>.
    </div>
</blockquote>

// image-text combo
<blockquote>
    <div class="card-img ps-img"></div>
    <div class="text">
        <h3>TITLE</h3>
        <p>TEXT</p>
    </div>
</blockquote>

// vimeo
<div class="responsive-embed spaced">
    <iframe class="b-lazy" data-src="https://player.vimeo.com/video/VID_ID_HERE?color=ffffff&title=0&byline=0&portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>

// youtube (autoplay, muted)
<div class="spaced responsive-embed">
    <iframe class="b-lazy" src="https://www.youtube.com/embed/VID_ID_HERE?rel=0&amp;showinfo=0&autoplay=1&mute=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

// subtitle, right-aligned
<p class="sub ta-right">Attempts to demonstrate the game, but unfortunately it is difficult to keep the controller in place when only using one, non-dominant hand, while filming with the other.</p>

<blockquote class="col">
    <div class="code-window">
        <pre>
            <code>
CODE_HERE
            </code>
            <div class="srclink">
                FILE_NAME.FILE_TYPE (<a target="_blank" href="LINK_TO_SOURCE">source</a>)
            </div>
        </pre>
    </div>
    <div class="text">
        <h4 style="display: inline-block; margin-right: 10px">TITLE</h4>
        <em>SUBTITLE</em>
    </div>
</blockquote>

// source code link
<blockquote class="source">
    <div class="card-img-static"><a target="_blank" href="LINK"><img src="/assets/media/source.jpg"></a></div>
    <a target="_blank" href="LINK" class="text">
        <h3>View the source code</h3>
    </a>
</blockquote>

// image opener trigger
<a class="ps-trigger" data-target="IMAGE_NAME">TEXT</a>