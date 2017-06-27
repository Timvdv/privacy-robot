var cv = require('opencv');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 10;
var camInterval = 1000 / camFps;

// face detection properties
var rectColor = [0, 255, 0];
var rectThickness = 2;

// initialize camera
var camera = new cv.VideoCapture(0);

// Require Johnny five
let servos = require('./servo-connector').camera;

camera.setWidth(camWidth);
camera.setHeight(camHeight);

var interval = null;

// When multiple sockets connect the stream get really slow.
module.exports = function (socket) {

  var servo_timer = 0;

  console.log(servos);

  //Init servos
  servos.init();

  if(interval) {
    clearInterval(interval);
  }

  interval = setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;

      im = im.flip(90);

      im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
          if (err) throw err;

          var face = {};


          for (var i = 0; i < faces.length; i++) {
            face = faces[i];
            face.faceDetected = true;

            im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
            // im = contourEffect(im);
          }

          if(!faces.length) {
            face.faceDetected = false;
            im = contourEffect(im);
          } else {
            if( servos.ready && servo_timer > 5 ) {
              servos.goToPosition(face.x, face.y, face.width, face.height);
              servo_timer = 0;
            }
          }

          servo_timer++;

          socket.volatile.emit('frame', { buffer: im.toBuffer(), face: face });
      });

    });
  }, camInterval);

  function contourEffect(im) {
    var BLUE  = [255, 0, 0]; // B, G, R
    var RED   = [0, 0, 255]; // B, G, R
    var GREEN = [0, 255, 0]; // B, G, R
    var WHITE = [255, 255, 255]; // B, G, R

    im.convertGrayscale();
    im_canny = im.copy();
    im_canny.canny(0, 100);
    im_canny.dilate(2);

    contours = im_canny.findContours();

    for (i = 0; i < contours.size(); i++) {

      if (contours.area(i) < 2000) continue;

      var arcLength = contours.arcLength(i, true);
      contours.approxPolyDP(i, 0.01 * arcLength, true);

      switch(contours.cornerCount(i)) {
        case 3:
          im.drawContour(contours, i, GREEN);
          break;
        case 4:
          im.drawContour(contours, i, RED);
          break;
        default:
          im.drawContour(contours, i, WHITE);
      }
    }

    return im;
  }

  function perspectiveEffect(im) {
    var width = im.width();
    var height = im.height();
    if (width < 1 || height < 1) throw new Error('Image has no size');
    var srcArray = [0, 0, width, 0, width, height, 0, height];
    var dstArray = [0, 0, width * 14, height * 0.1, width, height, width * 0.2, height * 0.8];
    var xfrmMat = im.getPerspectiveTransform(srcArray, dstArray);
    im.warpPerspective(xfrmMat, width, height, [255, 255, 255]);

    return im;
  }

};


