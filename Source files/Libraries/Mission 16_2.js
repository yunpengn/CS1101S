var ev3dev = require('ev3dev-lang');

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

exports.stop = function(motor) {
  motor.stop();
};

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
  var touchSensor = new ev3dev.TouchSensor(1);
  return touchSensor;
};

exports.touchSensor2 = function() {
  var touchSensor = new ev3dev.TouchSensor(2);
  return touchSensor;
};

exports.touchSensorPressed = function(touchSensor) {
  return touchSensor.getValue(0);
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

exports.gyroSensorRate = function(gyroSensor) {
  // The rate at which the sensor is rotating, in degrees/second.
  return gyroSensor.rate;
};

// Misc

exports.pause = function(time) {
  setTimeout(function() {}, time);
};

exports.runUntil = function(terminateCondition, task) {
  while (!terminateCondition()) {
    task();
  }
};
