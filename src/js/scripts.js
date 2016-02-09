'use strict';

let c,
    ctx,
    fps = 60;

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / fps);
          };
})();

let render = () => {
  // all of your render code goes here
};

let animationLoop = () => {
  requestAnimFrame(animationLoop);
  render();
};

window.onload = ()  => {
  c = document.getElementById('canvas');
  c.width = window.innerWidth;
  c.height = window.innerHeight;

  ctx = c.getContext('2d');

  animationLoop();
};

// if you want to draw lots of circles you'll use this function
let drawCircle = (circle) => {
  ctx.fillStyle = circle.color;
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2, true);
  ctx.fill();
};

// if you want to draw lots of rectangles you'll use this function
let drawRect = (rectangle) => {
  ctx.fillStyle = rectangle.color;
  ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
};
