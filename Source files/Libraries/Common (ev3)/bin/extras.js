"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IO = require('./io');
var Device = IO.Device;
var PowerSupply = (function (_super) {
    __extends(PowerSupply, _super);
    function PowerSupply(deviceName) {
        _super.call(this);
        var deviceConstraints = {};
        if (deviceName == undefined)
            deviceConstraints["scope"] = "System";
        else
            this.deviceName = deviceName;
        this.connect('power_supply', deviceName, deviceConstraints);
    }
    Object.defineProperty(PowerSupply.prototype, "measuredCurrent", {
        get: function () {
            return this.readNumber("current_now");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "measuredVoltage", {
        get: function () {
            return this.readNumber("voltage_now");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "maxVoltage", {
        get: function () {
            return this.readNumber("voltage_max_design");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "minVoltage", {
        get: function () {
            return this.readNumber("voltage_min_design");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "technology", {
        get: function () {
            return this.readString("technology");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "type", {
        get: function () {
            return this.readString("type");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "voltageVolts", {
        get: function () {
            return this.measuredVoltage / 1000000;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PowerSupply.prototype, "currentAmps", {
        get: function () {
            return this.measuredCurrent / 1000000;
        },
        enumerable: true,
        configurable: true
    });
    return PowerSupply;
}(Device));
exports.PowerSupply = PowerSupply;
var LED = (function (_super) {
    __extends(LED, _super);
    function LED(deviceName) {
        _super.call(this);
        this.deviceName = deviceName;
        this.connect('leds', deviceName);
    }
    Object.defineProperty(LED.prototype, "maxBrightness", {
        get: function () {
            return this.readNumber("max_brightness");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LED.prototype, "brightness", {
        get: function () {
            return this.readNumber("brightness");
        },
        set: function (value) {
            this.setNumber("brightness", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LED.prototype, "triggers", {
        get: function () {
            return this.readStringArray("trigger");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LED.prototype, "trigger", {
        get: function () {
            return this.readStringSelector("trigger");
        },
        set: function (value) {
            this.setString("trigger", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LED.prototype, "delayOn", {
        get: function () {
            return this.readNumber("delay_on");
        },
        set: function (value) {
            this.setNumber("delay_on", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LED.prototype, "delayOff", {
        get: function () {
            return this.readNumber("delay_off");
        },
        set: function (value) {
            this.setNumber("delay_off", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LED.prototype, "brightnessPct", {
        get: function () {
            return this.brightness / this.maxBrightness;
        },
        set: function (brightnessPct) {
            this.brightness = Math.round(this.maxBrightness * brightnessPct);
        },
        enumerable: true,
        configurable: true
    });
    LED.prototype.on = function () {
        this.brightness = this.maxBrightness;
    };
    LED.prototype.off = function () {
        this.brightness = 0;
    };
    LED.prototype.flash = function (onInterval, offInterval) {
        this.delayOn = onInterval;
        this.delayOff = offInterval;
        this.trigger = "timer";
    };
    return LED;
}(Device));
exports.LED = LED;
var LEDGroup = (function () {
    function LEDGroup() {
        var leds = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            leds[_i - 0] = arguments[_i];
        }
        this.leds = [];
        for (var _a = 0, leds_1 = leds; _a < leds_1.length; _a++) {
            var ledObj = leds_1[_a];
            if (typeof ledObj == "string") {
                var newLed = new LED(ledObj);
                this.leds.push(newLed);
            }
            else {
                this.leds.push(ledObj);
            }
        }
    }
    Object.defineProperty(LEDGroup.prototype, "isConnected", {
        get: function () {
            return this.leds.every(function (led, index, wholeArray) {
                return led.connected;
            });
        },
        enumerable: true,
        configurable: true
    });
    LEDGroup.prototype.setColor = function (colorCombination, pctPower) {
        if (colorCombination.length !== this.leds.length) {
            throw new Error("The given color values had either too few or too many numbers for this LED group."
                + " Expected length: " + this.leds.length + "; Given length: " + colorCombination.length);
        }
        if (pctPower == undefined || pctPower == null) {
            pctPower = 1;
        }
        for (var ledIndex = 0; ledIndex < this.leds.length; ledIndex++) {
            this.leds[ledIndex].brightnessPct = pctPower * colorCombination[ledIndex];
        }
    };
    LEDGroup.prototype.setProps = function (props) {
        for (var _i = 0, _a = this.leds; _i < _a.length; _i++) {
            var led = _a[_i];
            for (var prop in Object.keys(props)) {
                if (Object.keys(led).indexOf(prop) != -1) {
                    led[prop] = props[prop];
                }
            }
        }
    };
    LEDGroup.prototype.allOn = function () {
        for (var _i = 0, _a = this.leds; _i < _a.length; _i++) {
            var led = _a[_i];
            led.on();
        }
    };
    LEDGroup.prototype.allOff = function () {
        for (var _i = 0, _a = this.leds; _i < _a.length; _i++) {
            var led = _a[_i];
            led.off();
        }
    };
    return LEDGroup;
}());
exports.LEDGroup = LEDGroup;
var LegoPort = (function (_super) {
    __extends(LegoPort, _super);
    function LegoPort(port) {
        _super.call(this);
        this._deviceIndex = -1;
        this.connect('lego-port', 'port(\d*)', {
            port_name: port
        });
    }
    Object.defineProperty(LegoPort.prototype, "deviceIndex", {
        get: function () {
            return this._deviceIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegoPort.prototype, "address", {
        get: function () {
            return this.readString("address");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegoPort.prototype, "driverName", {
        get: function () {
            return this.readString("driver_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegoPort.prototype, "modes", {
        get: function () {
            return this.readStringArray("modes");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegoPort.prototype, "mode", {
        get: function () {
            return this.readString("mode");
        },
        set: function (value) {
            this.setString("mode", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegoPort.prototype, "setDevice", {
        set: function (value) {
            this.setString("set_device", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LegoPort.prototype, "status", {
        get: function () {
            return this.readString("status");
        },
        enumerable: true,
        configurable: true
    });
    return LegoPort;
}(Device));
exports.LegoPort = LegoPort;
//# sourceMappingURL=extras.js.map