var five = require("johnny-five"),
    board, led, wheels;
var keypress = require("keypress"); keypress(process.stdin);

board = new five.Board();

module.exports = {
  camera: {
    ready: false,
    rotateValue: 90,
    rotateVerticalValue: 90,
    init: function() {
      init(this);
    }
  }
}

function init(camera) {
  board.on("ready", function() {
      camera.ready = true;

      led = new five.Led(13);
      led.strobe(100);

      camera.rotate = new five.Servo({
        pin: 10,
        center: true
      });

      camera.rotateVertical = new five.Servo({
        pin: 9,
        center: true
      });

      camera.rotate.to(camera.rotateValue);
      camera.rotateVertical.to(camera.rotateVerticalValue);

      // camera.both = new five.Servos().stop();

      camera.turnLeft = function() {
        camera.rotate.to(0, 500);
      }

      camera.turnRight = function() {
        camera.rotate.to(180, 500);
      }

      camera.goToPosition = function(face_x, face_y, face_width, face_height) {
        screen_width = 320;
        screen_height = 240;

        var scale_x = 100;
        var scale_y = 80;

        var servo_x_offsett = (180 - scale_x) / 2;
        var servo_y_offsett = (180 - scale_y) / 2;

        var middle_x = face_x + (face_width / 2);
        var middle_y = face_y + (face_height / 2);

        console.log('Face x: '+ face_x +' Face y:' + face_y + 'Face width: '+ face_width +' face height:' + face_height);

        let x = (scale_x / screen_width) * middle_x,
            y = (scale_y / screen_height) * middle_y;

        console.log('Camera rotates to - x: '+ x +' y:' + y);

        camera.rotate.to(servo_x_offsett + x, 500);
        camera.rotateVertical.to(180 - servo_y_offsett - y, 500);
      };

      console.log('sweeeping');
  });
}

function enableKeyboard(camera) {
  console.log("Control the camera with the arrow keys, the space bar to stop, Q to exit.")

  // Configure stdin for the keyboard controller
  process.stdin.resume(); process.stdin.setEncoding("utf8"); process.stdin.setRawMode(true);

  process.stdin.on("keypress", function(ch, key) {
    var speed = 4;

    if (!key) { return; }

    if (key.name == "q") {

        console.log("Quitting"); process.exit();

    } else if (key.name == "up") {

        console.log("Up");
        camera.rotateVerticalValue = camera.rotateVerticalValue - speed;

    } else if (key.name == "down") {

        console.log("Down");
        camera.rotateVerticalValue = camera.rotateVerticalValue + speed;

    } else if (key.name == "left") {

        console.log("Left");
        camera.rotateValue = camera.rotateValue + speed;

    } else if (key.name == "right") {

        console.log("Right");
        camera.rotateValue = camera.rotateValue - speed;

    } else if (key.name == "space") {

        console.log("Stopping");
        camera.rotateValue = 90;
        camera.rotateVerticalValue = 90;
    }

    camera.rotate.to(camera.rotateValue);
    camera.rotateVertical.to(camera.rotateVerticalValue);
  });
}