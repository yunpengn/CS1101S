import io = require("./io");
import motors = require("./motors");
import sensors = require("./sensors");
import extras = require("./extras");
export declare var INPUT_AUTO: any;
export declare var OUTPUT_AUTO: any;
export declare var INPUT_1: string;
export declare var INPUT_2: string;
export declare var INPUT_3: string;
export declare var INPUT_4: string;
export declare var OUTPUT_A: string;
export declare var OUTPUT_B: string;
export declare var OUTPUT_C: string;
export declare var OUTPUT_D: string;
export declare var Device: typeof io.Device;
export declare var IndexedDevice: typeof io.IndexedDevice;
export declare var Motor: typeof motors.Motor;
export declare var DcMotor: typeof motors.DcMotor;
export declare var LargeMotor: typeof motors.LargeMotor;
export declare var MediumMotor: typeof motors.MediumMotor;
export declare var ServoMotor: typeof motors.ServoMotor;
export declare module Motor {
    type CommandValue = motors.Motor.CommandValue;
    type EncoderPolarityValue = motors.Motor.EncoderPolarityValue;
    type PolarityValue = motors.Motor.PolarityValue;
    type StateValue = motors.Motor.StateValue;
    type StopActionValue = motors.Motor.StopActionValue;
}
export declare module ServoMotor {
    type CommandValue = motors.ServoMotor.CommandValue;
    type PolarityValue = motors.ServoMotor.PolarityValue;
}
export declare module DcMotor {
    type CommandValue = motors.DcMotor.CommandValue;
    type PolarityValue = motors.DcMotor.PolarityValue;
    type StopActionValue = motors.DcMotor.StopActionValue;
}
export declare var Sensor: typeof sensors.Sensor;
export declare var I2CSensor: typeof sensors.I2CSensor;
export declare var TouchSensor: typeof sensors.TouchSensor;
export declare var ColorSensor: typeof sensors.ColorSensor;
export declare var UltrasonicSensor: typeof sensors.UltrasonicSensor;
export declare var GyroSensor: typeof sensors.GyroSensor;
export declare var InfraredSensor: typeof sensors.InfraredSensor;
export declare var SoundSensor: typeof sensors.SoundSensor;
export declare var LightSensor: typeof sensors.LightSensor;
export declare var PowerSupply: typeof extras.PowerSupply;
export declare var LED: typeof extras.LED;
export declare var LEDGroup: typeof extras.LEDGroup;
export declare var LegoPort: typeof extras.LegoPort;
export declare class Ev3Leds {
    static redLeft: extras.LED;
    static redRight: extras.LED;
    static greenLeft: extras.LED;
    static greenRight: extras.LED;
    static left: extras.LEDGroup;
    static right: extras.LEDGroup;
    static blackColor: number[];
    static redColor: number[];
    static greenColor: number[];
    static amberColor: number[];
    static orangeColor: number[];
    static yellowColor: number[];
    static isConnected: boolean;
}
export declare class BrickpiLeds {
    static blueLed1: extras.LED;
    static blueLed2: extras.LED;
    static led1: extras.LEDGroup;
    static led2: extras.LEDGroup;
    static blackColor: number[];
    static blueColor: number[];
    static isConnected: boolean;
}
