import IO = require('./io');
import IndexedDevice = IO.IndexedDevice;
export declare class SensorBase extends IndexedDevice {
    constructor(driverTypeDirName: string, nameConvention?: string, targetAddress?: string, targetDriverName?: string | string[]);
}
export declare class Sensor extends SensorBase {
    constructor(port?: string, driverNames?: string[] | string);
    getValue(valueIndex: number): number;
    getFloatValue(valueIndex: number): number;
    address: string;
    command: string;
    commands: string[];
    decimals: number;
    driverName: string;
    mode: string;
    modes: string[];
    numValues: number;
    units: string;
}
export declare class TouchSensor extends Sensor {
    constructor(port?: string);
    isPressed: boolean;
}
export declare class ColorSensor extends Sensor {
    constructor(port?: string);
    reflectedLightIntensity: number;
    ambientLightIntensity: number;
    color: number;
    red: number;
    green: number;
    blue: number;
}
export declare class UltrasonicSensor extends Sensor {
    constructor(port?: string);
    distanceCentimeters: number;
    distanceInches: number;
    otherSensorPresent: boolean;
}
export declare class GyroSensor extends Sensor {
    constructor(port?: string);
    angle: number;
    rate: number;
}
export declare class InfraredSensor extends Sensor {
    constructor(port?: string);
    proximity: number;
}
export declare class SoundSensor extends Sensor {
    constructor(port?: string);
    soundPressure: number;
    soundPressureLow: number;
}
export declare class LightSensor extends Sensor {
    constructor(port?: string);
    reflectedLightIntensity: number;
    ambientLightIntensity: number;
}
export declare class I2CSensor extends Sensor {
    constructor(port?: string, driverNames?: string[]);
    fwVersion: string;
    pollMs: number;
}
