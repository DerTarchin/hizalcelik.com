updating website, run:
$ von
$ server3 
$ python3 minifier.py
$ voff

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

to enter venv run: 
von

to exit venv run: 
voff

to run minifier:
python3 minifier.py