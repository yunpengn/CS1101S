import IO = require('./io');
import Device = IO.Device;
export declare class PowerSupply extends Device {
    deviceName: any;
    constructor(deviceName: string);
    measuredCurrent: number;
    measuredVoltage: number;
    maxVoltage: number;
    minVoltage: number;
    technology: string;
    type: string;
    voltageVolts: number;
    currentAmps: number;
}
export declare class LED extends Device {
    deviceName: string;
    constructor(deviceName: string);
    maxBrightness: number;
    brightness: number;
    triggers: string[];
    trigger: string;
    delayOn: number;
    delayOff: number;
    brightnessPct: number;
    on(): void;
    off(): void;
    flash(onInterval: number, offInterval: number): void;
}
export declare class LEDGroup {
    private leds;
    constructor(...leds: (string | LED)[]);
    isConnected: boolean;
    setColor(colorCombination: number[], pctPower: number): void;
    setProps(props: {
        [propName: string]: any;
    }): void;
    allOn(): void;
    allOff(): void;
}
export declare class LegoPort extends Device {
    protected _deviceIndex: number;
    deviceIndex: number;
    constructor(port: string);
    address: string;
    driverName: string;
    modes: string[];
    mode: string;
    setDevice: string;
    status: string;
}
