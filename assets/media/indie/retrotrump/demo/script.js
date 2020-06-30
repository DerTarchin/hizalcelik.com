var button = document.querySelector('.button');
var gif2020 = document.getElementById('g2020');
var gif1980 = document.getElementById('g1980');
var state = 'red';

var onMouseDown = function(e) {
  button.setAttribute('data-state', state + 'down');
}

var onMouseUp = function(e) {
  button.setAttribute('data-state', state + 'up');
}

var onClick = function(e) {
  if(state === 'red') {
    state = 'blue';
    gif2020.classList.remove('inv');
    gif1980.classList.add('inv');
  } else {
    state = 'red'
    gif2020.classList.add('inv');
    gif1980.classList.remove('inv');
  }
  button.setAttribute('data-state', state + 'up');
}

button.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
button.addEventListener('click', onClick);

// toggle gif + button change
// $('#toggle').on('click', function() {
//   $('.gif').toggleClass('inv');
//   $('.gif').toggleClass('vis');

//   var btnsrc = $('.btn:not(.hide)').attr('src');
//   var newsrc;
//   if (btnsrc.includes('red')) newsrc = "blue";
//   else newsrc = "red";

//   if(btnsrc.includes('down')) newsrc += "_down";
//   else newsrc += "_up";

//   $('.btn:not(.hide)').addClass('hide');
//   $('.btn[src="'+newsrc+'.png"]').removeClass('hide');

//   console.log('.btn[src="'+newsrc+'.png"]');
// });

// toggle button down
// $('#toggle').on('mousedown', function() {
//   var src = $('.btn:not(.hide)').attr('src').replace('_up','_down');
//   $('.btn:not(.hide)').addClass('hide');
//   $('.btn[src="'+src+'"]').removeClass('hide');
// });

// // toggle button up
// $('body').on('mouseup mouseleave', function() {
//   var src = $('.btn:not(.hide)').attr('src').replace('_down','_up');
//   $('.btn:not(.hide)').addClass('hide');
//   $('.btn[src="'+src+'"]').removeClass('hide');
// });