"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IO = require('./io');
var IndexedDevice = IO.IndexedDevice;
var SensorBase = (function (_super) {
    __extends(SensorBase, _super);
    function SensorBase(driverTypeDirName, nameConvention, targetAddress, targetDriverName) {
        _super.call(this, driverTypeDirName, nameConvention, targetAddress, targetDriverName);
    }
    return SensorBase;
}(IndexedDevice));
exports.SensorBase = SensorBase;
var Sensor = (function (_super) {
    __extends(Sensor, _super);
    function Sensor(port, driverNames) {
        _super.call(this, 'lego-sensor', 'sensor(\\d*)', port, driverNames);
    }
    Sensor.prototype.getValue = function (valueIndex) {
        return this.readNumber("value" + valueIndex);
    };
    Sensor.prototype.getFloatValue = function (valueIndex) {
        return this.getValue(valueIndex) / Math.pow(10, this.decimals);
    };
    Object.defineProperty(Sensor.prototype, "address", {
        get: function () {
            return this.readString("address");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "command", {
        set: function (value) {
            this.setString("command", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "commands", {
        get: function () {
            return this.readStringArray("commands");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "decimals", {
        get: function () {
            return this.readNumber("decimals");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "driverName", {
        get: function () {
            return this.readString("driver_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "mode", {
        get: function () {
            return this.readString("mode");
        },
        set: function (value) {
            this.setString("mode", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "modes", {
        get: function () {
            return this.readStringArray("modes");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "numValues", {
        get: function () {
            return this.readNumber("num_values");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sensor.prototype, "units", {
        get: function () {
            return this.readString("units");
        },
        enumerable: true,
        configurable: true
    });
    return Sensor;
}(SensorBase));
exports.Sensor = Sensor;
var TouchSensor = (function (_super) {
    __extends(TouchSensor, _super);
    function TouchSensor(port) {
        _super.call(this, port, ["lego-ev3-touch", "lego-nxt-touch"]);
    }
    Object.defineProperty(TouchSensor.prototype, "isPressed", {
        get: function () {
            this.mode = 'TOUCH';
            return Boolean(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    return TouchSensor;
}(Sensor));
exports.TouchSensor = TouchSensor;
var ColorSensor = (function (_super) {
    __extends(ColorSensor, _super);
    function ColorSensor(port) {
        _super.call(this, port, ["lego-ev3-color"]);
    }
    Object.defineProperty(ColorSensor.prototype, "reflectedLightIntensity", {
        get: function () {
            this.mode = 'COL-REFLECT';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorSensor.prototype, "ambientLightIntensity", {
        get: function () {
            this.mode = 'COL-AMBIENT';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorSensor.prototype, "color", {
        get: function () {
            this.mode = 'COL-COLOR';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorSensor.prototype, "red", {
        get: function () {
            this.mode = 'RGB-RAW';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorSensor.prototype, "green", {
        get: function () {
            this.mode = 'RGB-RAW';
            return Number(this.getFloatValue(1));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColorSensor.prototype, "blue", {
        get: function () {
            this.mode = 'RGB-RAW';
            return Number(this.getFloatValue(2));
        },
        enumerable: true,
        configurable: true
    });
    return ColorSensor;
}(Sensor));
exports.ColorSensor = ColorSensor;
var UltrasonicSensor = (function (_super) {
    __extends(UltrasonicSensor, _super);
    function UltrasonicSensor(port) {
        _super.call(this, port, ["lego-ev3-us", "lego-nxt-us"]);
    }
    Object.defineProperty(UltrasonicSensor.prototype, "distanceCentimeters", {
        get: function () {
            this.mode = 'US-DIST-CM';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UltrasonicSensor.prototype, "distanceInches", {
        get: function () {
            this.mode = 'US-DIST-IN';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UltrasonicSensor.prototype, "otherSensorPresent", {
        get: function () {
            this.mode = 'US-LISTEN';
            return Boolean(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    return UltrasonicSensor;
}(Sensor));
exports.UltrasonicSensor = UltrasonicSensor;
var GyroSensor = (function (_super) {
    __extends(GyroSensor, _super);
    function GyroSensor(port) {
        _super.call(this, port, ["lego-ev3-gyro"]);
    }
    Object.defineProperty(GyroSensor.prototype, "angle", {
        get: function () {
            this.mode = 'GYRO-ANG';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GyroSensor.prototype, "rate", {
        get: function () {
            this.mode = 'GYRO-RATE';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    return GyroSensor;
}(Sensor));
exports.GyroSensor = GyroSensor;
var InfraredSensor = (function (_super) {
    __extends(InfraredSensor, _super);
    function InfraredSensor(port) {
        _super.call(this, port, ["lego-ev3-ir"]);
    }
    Object.defineProperty(InfraredSensor.prototype, "proximity", {
        get: function () {
            this.mode = 'IR-PROX';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    return InfraredSensor;
}(Sensor));
exports.InfraredSensor = InfraredSensor;
var SoundSensor = (function (_super) {
    __extends(SoundSensor, _super);
    function SoundSensor(port) {
        _super.call(this, port, ["lego-nxt-sound"]);
    }
    Object.defineProperty(SoundSensor.prototype, "soundPressure", {
        get: function () {
            this.mode = 'DB';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundSensor.prototype, "soundPressureLow", {
        get: function () {
            this.mode = 'DBA';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    return SoundSensor;
}(Sensor));
exports.SoundSensor = SoundSensor;
var LightSensor = (function (_super) {
    __extends(LightSensor, _super);
    function LightSensor(port) {
        _super.call(this, port, ["lego-nxt-light"]);
    }
    Object.defineProperty(LightSensor.prototype, "reflectedLightIntensity", {
        get: function () {
            this.mode = 'REFLECT';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LightSensor.prototype, "ambientLightIntensity", {
        get: function () {
            this.mode = 'AMBIENT';
            return Number(this.getFloatValue(0));
        },
        enumerable: true,
        configurable: true
    });
    return LightSensor;
}(Sensor));
exports.LightSensor = LightSensor;
var I2CSensor = (function (_super) {
    __extends(I2CSensor, _super);
    function I2CSensor(port, driverNames) {
        _super.call(this, port, driverNames);
    }
    Object.defineProperty(I2CSensor.prototype, "fwVersion", {
        get: function () {
            return this.readString("fw_version");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(I2CSensor.prototype, "pollMs", {
        get: function () {
            return this.readNumber("poll_ms");
        },
        set: function (value) {
            this.setNumber("poll_ms", value);
        },
        enumerable: true,
        configurable: true
    });
    return I2CSensor;
}(Sensor));
exports.I2CSensor = I2CSensor;
//# sourceMappingURL=sensors.js.map