"use strict";
var io = require("./io");
var motors = require("./motors");
var sensors = require("./sensors");
var extras = require("./extras");
exports.INPUT_AUTO = undefined;
exports.OUTPUT_AUTO = undefined;
exports.INPUT_1 = "in1";
exports.INPUT_2 = "in2";
exports.INPUT_3 = "in3";
exports.INPUT_4 = "in4";
exports.OUTPUT_A = "outA";
exports.OUTPUT_B = "outB";
exports.OUTPUT_C = "outC";
exports.OUTPUT_D = "outD";
exports.Device = io.Device;
exports.IndexedDevice = io.IndexedDevice;
exports.Motor = motors.Motor;
exports.DcMotor = motors.DcMotor;
exports.LargeMotor = motors.LargeMotor;
exports.MediumMotor = motors.MediumMotor;
exports.ServoMotor = motors.ServoMotor;
exports.Sensor = sensors.Sensor;
exports.I2CSensor = sensors.I2CSensor;
exports.TouchSensor = sensors.TouchSensor;
exports.ColorSensor = sensors.ColorSensor;
exports.UltrasonicSensor = sensors.UltrasonicSensor;
exports.GyroSensor = sensors.GyroSensor;
exports.InfraredSensor = sensors.InfraredSensor;
exports.SoundSensor = sensors.SoundSensor;
exports.LightSensor = sensors.LightSensor;
exports.PowerSupply = extras.PowerSupply;
exports.LED = extras.LED;
exports.LEDGroup = extras.LEDGroup;
exports.LegoPort = extras.LegoPort;
var Ev3Leds = (function () {
    function Ev3Leds() {
    }
    Object.defineProperty(Ev3Leds, "isConnected", {
        get: function () {
            return Ev3Leds.redLeft.connected && Ev3Leds.redRight.connected && Ev3Leds.greenLeft.connected && Ev3Leds.greenRight.connected;
        },
        enumerable: true,
        configurable: true
    });
    Ev3Leds.redLeft = new extras.LED("ev3:left:red:ev3dev");
    Ev3Leds.redRight = new extras.LED("ev3:right:red:ev3dev");
    Ev3Leds.greenLeft = new extras.LED("ev3:left:green:ev3dev");
    Ev3Leds.greenRight = new extras.LED("ev3:right:green:ev3dev");
    Ev3Leds.left = new extras.LEDGroup(Ev3Leds.redLeft, Ev3Leds.greenLeft);
    Ev3Leds.right = new extras.LEDGroup(Ev3Leds.redRight, Ev3Leds.greenRight);
    Ev3Leds.blackColor = [0, 0];
    Ev3Leds.redColor = [1, 0];
    Ev3Leds.greenColor = [0, 1];
    Ev3Leds.amberColor = [1, 1];
    Ev3Leds.orangeColor = [1, 0.5];
    Ev3Leds.yellowColor = [0.1, 1];
    return Ev3Leds;
}());
exports.Ev3Leds = Ev3Leds;
var BrickpiLeds = (function () {
    function BrickpiLeds() {
    }
    Object.defineProperty(BrickpiLeds, "isConnected", {
        get: function () {
            return BrickpiLeds.blueLed1.connected && BrickpiLeds.blueLed2.connected;
        },
        enumerable: true,
        configurable: true
    });
    BrickpiLeds.blueLed1 = new extras.LED("brickpi:led1:blue:ev3dev");
    BrickpiLeds.blueLed2 = new extras.LED("brickpi:led2:blue:ev3dev");
    BrickpiLeds.led1 = new extras.LEDGroup(BrickpiLeds.blueLed1);
    BrickpiLeds.led2 = new extras.LEDGroup(BrickpiLeds.blueLed2);
    BrickpiLeds.blackColor = [0];
    BrickpiLeds.blueColor = [1];
    return BrickpiLeds;
}());
exports.BrickpiLeds = BrickpiLeds;
//# sourceMappingURL=index.js.map