$(document).ready(function() {
    var $grid = $('.panel-group').packery({
		itemSelector: '.panel-container',
		// gutter: '.gutter-sizer',
		columnWidth: '.panel-sizer',
		percentPosition: true,
	});
});