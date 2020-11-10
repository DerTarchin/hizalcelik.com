window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

// add custom dropdown functionality to input type: select
$(function() {
  if(!window.mobilecheck()) {
    // finds related select input
    function getSelect(dropdown) {
      return $(dropdown).prev('select');
    }
    // finds related dropdown
    function getDropdown(select) {
      return $('select + ul.dropdown-menu', $(select).parent());
    }
    // repositions the dropdown to fit in view
    function repositionDropdown(dropdown) {
      $dd = $(dropdown);
      $dd.parent('.dropdown').addClass('open');

      var top = $dd.offset().top;
      var height = $dd.height();
      var buffer = $('.ln-footer').offset().top - 15;
      if(top + height > buffer) {
        var excess = (buffer - top) - height;
        $dd.css('margin-top', excess+'px');
      }
      $dd.parent('.dropdown').removeClass('open');
    }
    // creates dropdown
    function addDropdown(select) {
      $(select).attr('data-toggle','dropdown');
      $(select).attr('aria-haspopup','true');
      $(select).attr('aria-expanded','false');
      $(select).after('<ul class="dropdown-menu" type="select-dropdown"></ul>');
      return getDropdown(select);
    }
    // adds items to dropdown
    function createDropdownItems(parent, dropdown, groupItem) {
      var $dd = dropdown;
      $('> *', parent).each(function() {
        var to_ignore = $(this)[0].hasAttribute("dropdown-ignore");
        var is_divider = $(this)[0].hasAttribute("dropdown-divider");

        if(!to_ignore) {
          if(is_divider) {
            $dd.append('<li class="divider" role="separator"></li>');
          }
          else if($(this).is('optgroup')) {
            $dd.append('<li class="dropdown-header">'+$(this).attr('label')+'</li>');
            createDropdownItems(this, $dd, true);
          }
          else {
            var text = $(this).html();
            var attributes = "";
            var classes = 'class="';
            $.each($(this).prop("attributes"), function() {
              if(this.name == "disabled") { classes += this.name; }
              else if(this.name == "selected") { classes += ' active'; }
              else { attributes += this.name + '="' + this.value + '" '; }
            });
            if(groupItem) { classes += ' group-item'; }
            $($dd).append('<li '+classes+'"><a '+attributes+'>'+text+'</a></li>');
          }
        }
      });
    }
    // removes dropdown
    function clearDropdown(dropdown, select) {
      $(dropdown).remove();
      $(select).removeAttr('data-toggle');
      $(select).removeAttr('aria-haspopup');
      $(select).removeAttr('aria-expanded');
      $(select).parent('.dropdown').removeClass('open')
      return;
    }

    // ========= UPDATE DROPDOWN ========= //
    $('.dropdown select').on('mousedown',function(e) {
      // disable default behavior
      e.preventDefault();
      this.blur();
      window.focus();

      if($(this).parent('.dropdown').hasClass('open')) {
        return clearDropdown(getDropdown(this), this);
      }

      var $dd = getDropdown(this);
      if($dd.length === 0) { $dd = addDropdown(this); }
      else { $dd.empty(); $dd.css('margin-top',''); }
      // fill values into dropdown
      createDropdownItems(this, $dd, false);
      repositionDropdown($dd);
    });

    // ========= UPDATE SELECT INPUT ========= //
    $(document.body).on("click", ".dropdown select + ul[type=select-dropdown] li", function() {
      var $dd = $(this).parent();
      var $input = getSelect($dd);
      if($(this).hasClass('active') || $(this).hasClass('disabled') 
        || $(this).hasClass('divider') || $(this).hasClass('dropdown-header')) { 
        return clearDropdown($dd, $input); 
      }
      $(this).addClass('clicked');
      $input.empty();      // clear values from select input
      var inGroup = false;
      $('li', $dd).each(function() {
        if($(this).hasClass('dropdown-header')) {
          inGroup = true;
          $input.append('<optgroup label="'+$(this).html()+'">');
        }
        else {
          if(inGroup && !$(this).hasClass('group-item')) {
            inGroup = false;
          }
          var attributes = "";
          var text = $('a', this).html();
          $.each($('a', this).prop("attributes"), function() {
            attributes += this.name + '="' + this.value + '" ';
          });
          if($(this).hasClass('disabled')) {
            attributes += 'disabled ';
          }
          if($(this).hasClass('divider')) {
            attributes += 'dropdown-divider disabled ';
          }
          if($(this).hasClass('clicked')) {
            attributes += 'selected ';
          }
          if(inGroup) {
            $('optgroup:last-of-type',$input).append('<option '+attributes+'>'+text+'</option>');
          }
          else {
            $input.append('<option '+attributes+'>'+text+'</option>');
          }
        }
      });
      clearDropdown($dd, $input); 
    });
  }
});