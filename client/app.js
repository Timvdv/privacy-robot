// MODIFY THIS TO THE APPROPRIATE URL IF IT IS NOT BEING RUN LOCALLY
var socket = io.connect('http://localhost');

var canvas = document.getElementById('canvas-video');
var ctx = canvas.getContext('2d');
var img = new Image();

var face = false;
var transform = {x: 0, y: 0, scale: 1}

// show loading notice
ctx.fillStyle = '#333';
ctx.fillText('Loading...', canvas.width/2-30, canvas.height/3);

socket.on('frame', function (data) {
  var uint8Arr = new Uint8Array(data.buffer);
  var str = String.fromCharCode.apply(null, uint8Arr);
  var base64String = btoa(str);

  img.onload = function () {

    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    // ctx.drawImage(this, 0, 0, canvas.width, canvas.height, canvas.width - data.face.x, canvas.width - data.face.y, canvas.width * 2, canvas.height * 2);

    drawWithFace(data.face);

    if(data.face.faceDetected) {
      // scaleCanvas(2, {
      //     x: data.face.x,
      //     y: data.face.y
      //   }
      // );
    }
  };

  img.src = 'data:image/png;base64,' + base64String;


});

function drawWithFace(face) {

    if( face.faceDetected ) {
      text.startTicker();
    } else {
      text.tickerActive = false;
    }

    ctx.font = '48px serif';
    ctx.color = 'red';

    text.draw(ctx, face);

    // ctx.fillText('Hi there', face.x, face.y);
}

function scaleCanvas(scale, point) {
    var oldScale = transform.scale;
    transform.scale = scale / transform.scale;

    // Re-centre the canvas around the zoom point
    // (This may need some adjustment to re-centre correctly)
    transform.x += point.x / transform.scale - point.x / oldScale
    transform.y += point.y / transform.scale - point.y / oldScale;

    setTransform();
}

function setTransform() {
    ctx.setTransform(transform.scale, 0, 0, transform.scale, transform.x, transform.y);
}
