from csscompressor import compress
from jsmin import jsmin
import re

assets = {
    "js": {
        "main": [
            "modernizr.min.js", 
            "ki.min.js",
            "anime.min.js",
            "tmpl.min.js",
            "revealer.min.js",
            "blazy.min.js",
            "util.js",
            "nav.js"
        ],
        "indie": [
            "awesomplete.min.js",
            "photoswipe.min.js",
            "indie.js"
        ]
    },
    "css": {
        "main": [
            "normalize.min.css",
            "photoswipe.min.css",
            "animations.css",
            "main.css",
            "indie.css"
        ],
    }
}
asset_path = "assets/"

def removeAllComments(string):
    pattern = r"(\".*?(?<!\\)\"|\'.*?(?<!\\)\')|(/\*.*?\*/|//[^\r\n]*$)"
    # first group captures quoted strings (double or single)
    # second group captures comments (//single-line or /* multi-line */)
    regex = re.compile(pattern, re.MULTILINE|re.DOTALL)
    def _replacer(match):
        # if the 2nd group (capturing comments) is not None,
        # it means we have captured a non-quoted (real) comment string.
        if match.group(2) is not None:
            return "" # so we will return empty to remove the comment
        else: # otherwise, we will return the 1st group
            return match.group(1) # captured quoted-string
    return regex.sub(_replacer, string)

def removeMultilineComments(string):
    string = re.sub(re.compile("/\*.*?\*/",re.DOTALL ) ,"" ,string) # remove all occurrences streamed comments (/*COMMENT */) from string
    # string = re.sub(re.compile("//.*?\n" ) ,"" ,string) # remove all occurrence single-line comments (//COMMENT\n ) from string
    return string

for asset_type in ["js","css"]:
    for pkgd in list(assets[asset_type].keys()):
        asset_filename = asset_path + asset_type + "/" + pkgd + ".pkgd.min." + asset_type
        print (asset_filename)
        with open(asset_filename, "w") as pkgd_file:
            for asset in assets[asset_type][pkgd]:
                with open(asset_path + asset_type + "/" + asset) as infile:
                    for line in infile:
                        pkgd_file.write(line)
                    pkgd_file.write("\n\n\n")
        pkgd_file = open(asset_filename, "r")
        code = pkgd_file.read()
        if asset_type == "js":
            code = removeAllComments(removeMultilineComments(code))
            code = jsmin(code)
        else:
            code = compress(code)
        pkgd_file.close()
        pkgd_file = open(asset_filename, "w")
        pkgd_file.write(code)
        pkgd_file.close()
