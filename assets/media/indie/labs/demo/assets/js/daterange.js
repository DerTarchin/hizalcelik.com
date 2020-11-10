// 110px wide
$(document).ready(function() {
	var min_width = 110;
	function daterange_resize() {
		$('.daterange').each(function() {
			if($('input', this).outerWidth() <= min_width) {
				$(this).attr('orig-width', $(this).outerWidth());
				$(this).addClass('dr-sm');
			}
			else if($(this).hasClass('dr-sm') && $(this).outerWidth() > $(this).attr('orig-width')) {
				$(this).removeClass('dr-sm');
				$(this).removeAttr('orig-width');
			}
		});
	}
	$(window).resize(function() { daterange_resize(); });
	daterange_resize();
});