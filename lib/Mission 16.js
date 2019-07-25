var ev3dev = require('ev3dev-lang');
var source = require('./source.js');
var exec = require('child_process').exec;

exports.hello = function() {
  console.log("HELLO THERE");
};

exports.connected = function(obj) {
  return (typeof obj.connected === 'boolean') && obj.connected;
};

exports.motorA = function() {
  var motor = new ev3dev.Motor(ev3dev.OUTPUT_A);
  return motor;
};

exports.motorB = function() {
  var motor = new ev3dev.Motor(ev3dev.OUTPUT_B);
  return motor;
};

exports.motorC = function() {
  var motor = new ev3dev.Motor(ev3dev.OUTPUT_C);
  return motor;
};

exports.motorD = function() {
  var motor = new ev3dev.Motor(ev3dev.OUTPUT_D);
  return motor;
};

exports.runForDistance = function(motor, distance, speed) {
  motor.runForDistance(distance, speed);
};

exports.runForTime = function(motor, time, speed) {
  motor.runForTime(time, speed);
};

exports.runToAbsolutePosition = function(motor, position, speed) {
  motor.runToAbsolutePosition(position, speed);
};

exports.runToRelativePosition = function(motor, position, speed) {
  motor.runToRelativePosition(position, speed);
};

exports.motorGetPosition = function(motor) {
  return motor.position;
}

exports.motorGetSpeed = function(motor) {
  return motor.speed;
}

exports.motorSetSpeed = function(motor, speed) {
  motor.speedSp = speed;
}

exports.motorStart = function(motor) {
  motor.start();
};

exports.motorStop = function(motor) {
  motor.stop();
};

exports.motorSetStopAction = function(motor, stopAction) {
  motor.setStopAction(stopAction);
}

// Light Sensor

exports.colorSensor = function() {
  var colorSensor = new ev3dev.ColorSensor();
  return colorSensor;
};

exports.colorSensorRed = function(colorSensor) {
  return colorSensor.red;
}

exports.colorSensorGreen = function(colorSensor) {
  return colorSensor.green;
}

exports.colorSensorBlue = function(colorSensor) {
  return colorSensor.blue;
}

exports.reflectedLightIntensity = function(colorSensor) {
  return colorSensor.reflectedLightIntensity;
};

// Touch Sensor

exports.touchSensor1 = function() {
  var touchSensor = new ev3dev.TouchSensor(ev3dev.INPUT_1);
  return touchSensor;
};

exports.touchSensor2 = function() {
  var touchSensor = new ev3dev.TouchSensor(ev3dev.INPUT_2);
  return touchSensor;
};

exports.touchSensor3 = function() {
  var touchSensor = new ev3dev.TouchSensor(ev3dev.INPUT_3);
  return touchSensor;
};

exports.touchSensor4 = function() {
  var touchSensor = new ev3dev.TouchSensor(ev3dev.INPUT_4);
  return touchSensor;
};

exports.touchSensorPressed = function(touchSensor) {
  return touchSensor.isPressed;
};

// Ultrasonic Sensor

exports.ultrasonicSensor = function() {
  var ultrasonicSensor = new ev3dev.UltrasonicSensor();
  return ultrasonicSensor;
};

exports.ultrasonicSensorDistance = function(ultrasonicSensor) {
  return ultrasonicSensor.distanceCentimeters;
};

// Gyro Sensor

exports.gyroSensor = function() {
  var gyroSensor = new ev3dev.GyroSensor();
  return gyroSensor;
};

exports.gyroSensorRateMode = function(gyroSensor) {
  gyroSensor.mode = "GYRO-RATE";
}

exports.gyroSensorRate = function(gyroSensor) {
  // The rate at which the sensor is rotating, in degrees/second.
  return gyroSensor.rate;
};

exports.gyroSensorAngleMode = function(gyroSensor) {
  gyroSensor.mode = "GYRO-ANG";
}

exports.gyroSensorAngle = function(gyroSensor) {
  // The number of degrees that the sensor has been rotated since it was put into this mode
  return gyroSensor.angle;
};

// Misc

exports.pause = function(time) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < time) {}
};

exports.runUntil = function(terminateCondition, task) {
  while (!terminateCondition()) {
    task();
  }
};

exports.runForever = function(task) {
  while (true) {
    task();
  }
};

var head = source.head;
var tail = source.tail;

exports.playSequence = function(beeps) {
  if (source.is_empty_list(beeps)) {
    return;
  }
  var first = head(beeps);
  var initial = "beep" + " -f " + head(first) + " -l " + head(tail(first))
             + " -D " + head(tail(tail(first)))
  var command = source.accumulate(function(c, t) {
    return t + " -n -f " + head(c) + " -l " + head(tail(c))
             + " -D " + head(tail(tail(c)));
  }, initial, tail(beeps));
  exec(command);
};

exports.speak = function(script) {
  exec("espeak \"" + script + "\" --stdout | aplay");
}

var fs = require('fs');
var inputFile = fs.openSync("/dev/input/by-path/platform-gpio-keys.0-event", "r");
var buffer = new Buffer(16);
var lastButton;
var KEY_UP = 103
var KEY_DOWN = 108
var KEY_LEFT = 105
var KEY_RIGHT = 106
var KEY_ENTER = 28

exports.waitForButtonPress = function() {
  var type, code, value;
  while (!((type == 1) && (value == 0))) {
    fs.readSync(inputFile, buffer, 0, 16, null);
    type = buffer.readUInt16LE(8);
    code = buffer.readUInt16LE(10);
    value = buffer.readUInt32LE(12);
  }
  lastButton = code;
}

exports.buttonEnterPressed = function() {
  return lastButton == KEY_ENTER;
}

exports.buttonUpPressed = function() {
  return lastButton == KEY_UP;
}

exports.buttonDownPressed = function() {
  return lastButton == KEY_DOWN;
}

exports.buttonLeftPressed = function() {
  return lastButton == KEY_LEFT;
}

exports.buttonRightPressed = function() {
  return lastButton == KEY_RIGHT;
}
