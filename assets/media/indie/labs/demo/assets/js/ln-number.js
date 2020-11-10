$(document).ready(function() {
	$(function() {
		$('.ln-number').each(function() {
			var button_plus = '<button type="button" class="ln-number-increase">+</button>';
			var button_minus = '<button type="button" class="ln-number-decrease">-</button>';
			$(this).append('<div class="input-group-addon">'+button_plus+button_minus+'</div>');
			$('input[type=number][readonly]', this).addClass('ln-number-max ln-number-min');
		});

		function checkLimits(el) {
			var $input = $(el);
			if($input[0].hasAttribute('max')) {
				var max = $input.attr('max');
				if($input.val() >= max) {
					$input.addClass('ln-number-max');
					$input.val(max);
				}
				else if($input.hasClass('ln-number-max')) {
					$input.removeClass('ln-number-max');
				}
			}
			if($input[0].hasAttribute('min')) {
				var min = $input.attr('min');
				if($input.val() <= min) {
					$input.addClass('ln-number-min');
					$input.val(min);
				}
				else if($input.hasClass('ln-number-min')) {
					$input.removeClass('ln-number-min');
				}
			}
		}

		$('.ln-number').on('change', 'input[type=number]', function() {
			checkLimits($(this));
		});

		var selector = 'input[type=number]:not([readonly]) ~ .input-group-addon ';

		$('.ln-number').on('click', selector + '.ln-number-increase', function() {
			var $input = $(this).parent().siblings('input[type=number]');
			$input[0].stepUp();
			checkLimits($input);
		});

		$('.ln-number').on('click', selector + '.ln-number-decrease', function() {
			var $input = $(this).parent().siblings('input[type=number]');
			$input[0].stepDown();
			checkLimits($input);
		});
	});
});