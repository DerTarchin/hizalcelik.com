var $pane = $('.ln-pane');
var sizes = {'default': 'm', 'xs': 150, 's': 250, 'm': 350, 'l': 500, 'xl': 750, 'max': '100%'};

// returns -1 if invalid
function getValidSize(size) {
  if (size in sizes) { return getValidSize(sizes[size]); }
  if ($.isNumeric(size)) { return size; }
  if (size.match(/px$/) && $.isNumeric(size.slice(0,-2))) { return size; }
  if (size.match(/%$/) && $.isNumeric(size.slice(0,-1))) { return size; }
  console.log('Invalid Size\nMust be an integer, a percentage or in {"default", "xs", "s", "m", "l", "xl", "max"}');
  return -1;
}

function configLNPane(size) {
  var new_size = getValidSize(size);
  if(new_size < 0) { return; }
  $pane.attr('pane-size', new_size);
  if($pane.height() > 0) { $pane.css('height',new_size); }
}

function hideLNPane() {
  if($pane[0].hasAttribute('pane-size')) { $pane.css('height', 0); }
  else { console.log("LN-Pane has not been configured"); }
}

function showLNPane() {
  if($pane[0].hasAttribute('pane-size')) {
    var new_size = getValidSize($pane.attr('pane-size'));
    if(new_size < 0) { return; }
    $pane.css('height', new_size);
  }
  else { console.log("LN-Pane has not been configured"); }
}

$('.ln-pane').on('click', '.close', function() {
  hideLNPane();
});