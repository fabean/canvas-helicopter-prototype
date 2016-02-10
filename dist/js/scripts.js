'use strict';

var c = undefined,
    ctx = undefined,
    fps = 60,
    dot = {
  color: 'white',
  x: 20,
  y: 295,
  speed: {
    x: 5,
    y: 5
  },
  width: 10,
  height: 10
},
    keysDown = {},
    path = [],
    startScreen = false,
    timeStart = undefined,
    timeEnd = undefined;

var CANVAS_HEIGHT = '600',
    CANVAS_WIDTH = '800',
    PATH_WIDTH = 20;

var requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / fps);
  };
}();

var movePlayer = function movePlayer() {
  if (38 in keysDown) {
    // Player holding up
    if (10 <= dot.y) {
      dot.y += -dot.speed.y;
    }
  } else if (40 in keysDown) {
    // Player holding down
    if (c.height - 10 >= dot.y) {
      dot.y += dot.speed.y;
    }
  } else {
    dot.y += 1.2;
  }
  if (37 in keysDown) {
    // Player holding left
    if (10 <= dot.x) {
      dot.x += -dot.speed.x;
    }
  }
  if (39 in keysDown) {
    // Player holding right
    if (c.width - 10 >= dot.x) {
      dot.x += dot.speed.x;
    }
  }
};

var movePath = function movePath() {
  for (var i = 0; i < path.length; i++) {
    path[i].x -= 1;

    // if the path is off screen we replace it
    if (path[i].x === -PATH_WIDTH) {

      var thisHeight = Math.floor(Math.random() * CANVAS_HEIGHT) + 50; // 50 is a min height?
      // array.pop seems like [i] changes value so I'm just replacing the current path
      path[i] = {
        width: PATH_WIDTH,
        height: thisHeight,
        y: CANVAS_HEIGHT / 2 - thisHeight / 2,
        x: CANVAS_WIDTH,
        color: 'black'
      };
    }
  }
};

var calcCollision = function calcCollision() {
  // loop through path and see which one I'm current in
  for (var i = 0; i < path.length; i++) {
    if (path[i].x < dot.x && path[i].x + PATH_WIDTH > dot.x) {
      // this means this is the path youre currently in

      if (path[i].y > dot.y || path[i].height + path[i].y < dot.y) {
        console.log('you collided');
        startScreen = true;
      }
    }
  }
};

// if you want to draw lots of circles you'll use this function
var drawCircle = function drawCircle(circle) {
  ctx.fillStyle = circle.color;
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
  ctx.fill();
};

// if you want to draw lots of rectangles you'll use this function
var drawRect = function drawRect(rectangle) {
  ctx.fillStyle = rectangle.color;
  ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
};

var msToTime = function msToTime(duration) {
  var seconds = parseInt(duration / 1000 % 60),
      minutes = parseInt(duration / (1000 * 60) % 60);

  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return minutes + ':' + seconds;
};

var gameOver = function gameOver() {
  ctx.fillStyle = '#6F6';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);

  ctx.fillStyle = 'black';
  ctx.font = '20px Helvetica';
  var message = 'You crashed!';
  var messageTextWidth = ctx.measureText(message);
  ctx.fillText(message, CANVAS_WIDTH / 2 - messageTextWidth.width / 2, 200);

  if (typeof timeEnd === 'undefined') {
    timeEnd = performance.now();
  }
  var timeTakenInMs = timeEnd - timeStart;
  var timeTaken = msToTime(timeTakenInMs);
  var timeTakenMessage = 'You lasted: ' + timeTaken;
  var timeTakenWidth = ctx.measureText(timeTakenMessage);
  ctx.fillText(timeTakenMessage, CANVAS_WIDTH / 2 - timeTakenWidth.width / 2, 250);

  var message2 = 'Click to start again';
  var messageTextWidth2 = ctx.measureText(message2);
  ctx.fillText(message2, CANVAS_WIDTH / 2 - messageTextWidth2.width / 2, 300);
};

var render = function render() {
  // check to see if game is over
  if (startScreen) {
    gameOver();
    return;
  }

  // first we will calculate player movement
  movePlayer();

  // move the path
  movePath();

  // was there a collision?
  calcCollision();

  // draw background
  ctx.fillStyle = '#6F6';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);

  for (var i = 0; i < path.length; i++) {
    drawRect(path[i]);
  }

  // helicopter
  drawRect(dot);
};

var animationLoop = function animationLoop() {
  requestAnimFrame(animationLoop);
  render();
};

var gameRestart = function gameRestart() {
  timeStart = performance.now();
  timeEnd = undefined;
  startScreen = false;
  dot.x = 20;
  dot.y = 295;
};

window.onload = function () {
  c = document.getElementById('canvas');
  c.width = CANVAS_WIDTH;
  c.height = CANVAS_HEIGHT;

  ctx = c.getContext('2d');

  // Handle keyboard controls
  addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true;
  }, false);
  addEventListener('keyup', function (e) {
    delete keysDown[e.keyCode];
  }, false);
  addEventListener('mousedown', gameRestart);

  // generate inital path
  for (var i = 0; i < CANVAS_WIDTH / PATH_WIDTH + 1; i++) {
    var thisHeight = Math.floor(Math.random() * CANVAS_HEIGHT) + 50; // 50 is a min height?

    var thisPath = {
      width: PATH_WIDTH,
      height: thisHeight,
      y: CANVAS_HEIGHT / 2 - thisHeight / 2,
      x: i * PATH_WIDTH,
      color: 'black'
    };
    path.push(thisPath);
  }

  timeStart = performance.now();

  animationLoop();
};

// let person = [Math.floor(Math.random() * winner.length)];
//# sourceMappingURL=scripts.js.map
