import IO = require('./io');
import IndexedDevice = IO.IndexedDevice;
export declare module Motor {
    type CommandValue = 'run-forever' | 'run-to-abs-pos' | 'run-to-rel-pos' | 'run-timed' | 'run-direct' | 'stop' | 'reset';
    type EncoderPolarityValue = 'normal' | 'inversed';
    type PolarityValue = 'normal' | 'inversed';
    type StateValue = 'running' | 'ramping' | 'holding' | 'overloaded' | 'stalled';
    type StopActionValue = 'coast' | 'brake' | 'hold';
}
export declare module DcMotor {
    type CommandValue = 'run-forever' | 'run-timed' | 'run-direct' | 'stop';
    type PolarityValue = 'normal' | 'inversed';
    type StopActionValue = 'coast' | 'brake';
}
export declare module ServoMotor {
    type CommandValue = 'run' | 'float';
    type PolarityValue = 'normal' | 'inversed';
}
export declare class MotorBase extends IndexedDevice {
    constructor(driverTypeDirName: string, nameConvention?: string, targetAddress?: string, targetDriverName?: string | string[]);
}
export declare class Motor extends MotorBase {
    constructor(port?: string, targetDriverName?: string[] | string);
    commandValues: {
        runForever: Motor.CommandValue;
        runToAbsPos: Motor.CommandValue;
        runToRelPos: Motor.CommandValue;
        runTimed: Motor.CommandValue;
        runDirect: Motor.CommandValue;
        stop: Motor.CommandValue;
        reset: Motor.CommandValue;
    };
    encoderPolarityValues: {
        normal: Motor.EncoderPolarityValue;
        inversed: Motor.EncoderPolarityValue;
    };
    polarityValues: {
        normal: Motor.PolarityValue;
        inversed: Motor.PolarityValue;
    };
    stateValues: {
        running: Motor.StateValue;
        ramping: Motor.StateValue;
        holding: Motor.StateValue;
        overloaded: Motor.StateValue;
        stalled: Motor.StateValue;
    };
    stopActionValues: {
        coast: Motor.StopActionValue;
        brake: Motor.StopActionValue;
        hold: Motor.StopActionValue;
    };
    reset(): void;
    stop(): void;
    address: string;
    command: Motor.CommandValue;
    commands: string[];
    countPerRot: number;
    countPerM: number;
    driverName: string;
    dutyCycle: number;
    dutyCycleSp: number;
    fullTravelCount: number;
    polarity: Motor.PolarityValue;
    position: number;
    positionP: number;
    positionI: number;
    positionD: number;
    positionSp: number;
    maxSpeed: number;
    speed: number;
    speedSp: number;
    rampUpSp: number;
    rampDownSp: number;
    speedP: number;
    speedI: number;
    speedD: number;
    state: Motor.StateValue[];
    stopAction: Motor.StopActionValue;
    stopActions: string[];
    timeSp: number;
    sendCommand(commandName: Motor.CommandValue): void;
    setStopAction(stopAction: Motor.StopActionValue): void;
    runForever(sp?: number, stopAction?: Motor.StopActionValue): void;
    start(sp?: number, stopAction?: Motor.StopActionValue): void;
    runToPosition(position?: number, speedSp?: number, stopAction?: Motor.StopActionValue): void;
    runToAbsolutePosition(position?: number, speedSp?: number, stopAction?: Motor.StopActionValue): void;
    runForDistance(distance?: number, speedSp?: number, stopAction?: Motor.StopActionValue): void;
    runToRelativePosition(relPos?: number, speedSp?: number, stopAction?: Motor.StopActionValue): void;
    runForTime(timeMs: number, speedSp?: number, stopAction?: Motor.StopActionValue): void;
    hasState(stateValue: Motor.StateValue): boolean;
    isRunning: boolean;
    isRamping: boolean;
    isHolding: boolean;
    isOverloaded: boolean;
    isStalled: boolean;
}
export declare class LargeMotor extends Motor {
    constructor(port?: string);
}
export declare class MediumMotor extends Motor {
    constructor(port?: string);
}
export declare class DcMotor extends MotorBase {
    constructor(port: string);
    commandValues: {
        runForever: DcMotor.CommandValue;
        runTimed: DcMotor.CommandValue;
        runDirect: DcMotor.CommandValue;
        stop: DcMotor.CommandValue;
    };
    polarityValues: {
        normal: DcMotor.PolarityValue;
        inversed: DcMotor.PolarityValue;
    };
    stopActionValues: {
        coast: DcMotor.StopActionValue;
        brake: DcMotor.StopActionValue;
    };
    address: string;
    command: DcMotor.CommandValue;
    commands: string[];
    driverName: string;
    dutyCycle: number;
    dutyCycleSp: number;
    polarity: DcMotor.PolarityValue;
    rampDownSp: number;
    rampUpSp: number;
    state: string[];
    stopAction: DcMotor.StopActionValue;
    stopActions: string[];
    timeSp: number;
}
export declare class ServoMotor extends MotorBase {
    constructor(port: string);
    commandValues: {
        run: ServoMotor.CommandValue;
        float: ServoMotor.CommandValue;
    };
    polarityValues: {
        normal: ServoMotor.PolarityValue;
        inversed: ServoMotor.PolarityValue;
    };
    address: string;
    command: ServoMotor.CommandValue;
    driverName: string;
    maxPulseSp: number;
    midPulseSp: number;
    minPulseSp: number;
    polarity: ServoMotor.PolarityValue;
    positionSp: number;
    rateSp: number;
    state: string[];
}
