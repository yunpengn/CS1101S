"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var IO = require('./io');
var IndexedDevice = IO.IndexedDevice;
var MotorBase = (function (_super) {
    __extends(MotorBase, _super);
    function MotorBase(driverTypeDirName, nameConvention, targetAddress, targetDriverName) {
        _super.call(this, driverTypeDirName, nameConvention, targetAddress, targetDriverName);
    }
    return MotorBase;
}(IndexedDevice));
exports.MotorBase = MotorBase;
var Motor = (function (_super) {
    __extends(Motor, _super);
    function Motor(port, targetDriverName) {
        _super.call(this, 'tacho-motor', null, port, targetDriverName);
    }
    Object.defineProperty(Motor.prototype, "commandValues", {
        get: function () {
            return {
                runForever: "run-forever",
                runToAbsPos: "run-to-abs-pos",
                runToRelPos: "run-to-rel-pos",
                runTimed: "run-timed",
                runDirect: "run-direct",
                stop: "stop",
                reset: "reset"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "encoderPolarityValues", {
        get: function () {
            return {
                normal: "normal",
                inversed: "inversed"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "polarityValues", {
        get: function () {
            return {
                normal: "normal",
                inversed: "inversed"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "stateValues", {
        get: function () {
            return {
                running: "running",
                ramping: "ramping",
                holding: "holding",
                overloaded: "overloaded",
                stalled: "stalled"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "stopActionValues", {
        get: function () {
            return {
                coast: "coast",
                brake: "brake",
                hold: "hold"
            };
        },
        enumerable: true,
        configurable: true
    });
    Motor.prototype.reset = function () {
        this.command = this.commandValues.reset;
    };
    Motor.prototype.stop = function () {
        this.command = this.commandValues.stop;
    };
    Object.defineProperty(Motor.prototype, "address", {
        get: function () {
            return this.readString("address");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "command", {
        set: function (value) {
            this.setString("command", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "commands", {
        get: function () {
            return this.readStringArray("commands");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "countPerRot", {
        get: function () {
            return this.readNumber("count_per_rot");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "countPerM", {
        get: function () {
            return this.readNumber("count_per_m");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "driverName", {
        get: function () {
            return this.readString("driver_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "dutyCycle", {
        get: function () {
            return this.readNumber("duty_cycle");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "dutyCycleSp", {
        get: function () {
            return this.readNumber("duty_cycle_sp");
        },
        set: function (value) {
            this.setNumber("duty_cycle_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "fullTravelCount", {
        get: function () {
            return this.readNumber("full_travel_count");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "polarity", {
        get: function () {
            return this.readStringAsType("polarity");
        },
        set: function (value) {
            this.setString("polarity", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "position", {
        get: function () {
            return this.readNumber("position");
        },
        set: function (value) {
            this.setNumber("position", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "positionP", {
        get: function () {
            return this.readNumber("hold_pid/Kp");
        },
        set: function (value) {
            this.setNumber("hold_pid/Kp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "positionI", {
        get: function () {
            return this.readNumber("hold_pid/Ki");
        },
        set: function (value) {
            this.setNumber("hold_pid/Ki", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "positionD", {
        get: function () {
            return this.readNumber("hold_pid/Kd");
        },
        set: function (value) {
            this.setNumber("hold_pid/Kd", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "positionSp", {
        get: function () {
            return this.readNumber("position_sp");
        },
        set: function (value) {
            this.setNumber("position_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "maxSpeed", {
        get: function () {
            return this.readNumber("max_speed");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "speed", {
        get: function () {
            return this.readNumber("speed");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "speedSp", {
        get: function () {
            return this.readNumber("speed_sp");
        },
        set: function (value) {
            this.setNumber("speed_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "rampUpSp", {
        get: function () {
            return this.readNumber("ramp_up_sp");
        },
        set: function (value) {
            this.setNumber("ramp_up_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "rampDownSp", {
        get: function () {
            return this.readNumber("ramp_down_sp");
        },
        set: function (value) {
            this.setNumber("ramp_down_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "speedP", {
        get: function () {
            return this.readNumber("speed_pid/Kp");
        },
        set: function (value) {
            this.setNumber("speed_pid/Kp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "speedI", {
        get: function () {
            return this.readNumber("speed_pid/Ki");
        },
        set: function (value) {
            this.setNumber("speed_pid/Ki", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "speedD", {
        get: function () {
            return this.readNumber("speed_pid/Kd");
        },
        set: function (value) {
            this.setNumber("speed_pid/Kd", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "state", {
        get: function () {
            return this.readStringArrayAsType("state");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "stopAction", {
        get: function () {
            return this.readStringAsType("stop_action");
        },
        set: function (value) {
            this.setString("stop_action", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "stopActions", {
        get: function () {
            return this.readStringArray("stop_actions");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "timeSp", {
        get: function () {
            return this.readNumber("time_sp");
        },
        set: function (value) {
            this.setNumber("time_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Motor.prototype.sendCommand = function (commandName) {
        if (this.commands.indexOf(commandName) < 0)
            throw new Error('The command ' + commandName + ' is not supported by the device.');
        this.command = commandName;
    };
    Motor.prototype.setStopAction = function (stopAction) {
        if (this.stopActions.indexOf(stopAction) < 0)
            throw new Error('The stop command ' + stopAction + ' is not supported by the device.');
        this.stopAction = stopAction;
    };
    Motor.prototype.runForever = function (sp, stopAction) {
        if (sp != undefined)
            this.speedSp = sp;
        if (stopAction != undefined)
            this.setStopAction(stopAction);
        this.sendCommand(this.commandValues.runForever);
    };
    Motor.prototype.start = function (sp, stopAction) {
        this.runForever(sp, stopAction);
    };
    Motor.prototype.runToPosition = function (position, speedSp, stopAction) {
        this.runToAbsolutePosition(position, speedSp, stopAction);
    };
    Motor.prototype.runToAbsolutePosition = function (position, speedSp, stopAction) {
        if (speedSp != undefined)
            this.speedSp = speedSp;
        if (position != undefined)
            this.positionSp = position;
        if (stopAction != undefined)
            this.setStopAction(stopAction);
        this.sendCommand(this.commandValues.runToAbsPos);
    };
    Motor.prototype.runForDistance = function (distance, speedSp, stopAction) {
        this.runToRelativePosition(distance, speedSp, stopAction);
    };
    Motor.prototype.runToRelativePosition = function (relPos, speedSp, stopAction) {
        if (speedSp != undefined)
            this.speedSp = speedSp;
        if (relPos != undefined)
            this.positionSp = relPos;
        if (stopAction != undefined)
            this.setStopAction(stopAction);
        this.sendCommand(this.commandValues.runToRelPos);
    };
    Motor.prototype.runForTime = function (timeMs, speedSp, stopAction) {
        if (speedSp != undefined)
            this.speedSp = speedSp;
        if (timeMs != undefined)
            this.timeSp = timeMs;
        if (stopAction != undefined)
            this.setStopAction(stopAction);
        this.sendCommand(this.commandValues.runTimed);
    };
    Motor.prototype.hasState = function (stateValue) {
        return this.state.indexOf(stateValue) >= 0;
    };
    Object.defineProperty(Motor.prototype, "isRunning", {
        get: function () {
            return this.hasState(this.stateValues.running);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "isRamping", {
        get: function () {
            return this.hasState(this.stateValues.ramping);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "isHolding", {
        get: function () {
            return this.hasState(this.stateValues.holding);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "isOverloaded", {
        get: function () {
            return this.hasState(this.stateValues.overloaded);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Motor.prototype, "isStalled", {
        get: function () {
            return this.hasState(this.stateValues.stalled);
        },
        enumerable: true,
        configurable: true
    });
    return Motor;
}(MotorBase));
exports.Motor = Motor;
var LargeMotor = (function (_super) {
    __extends(LargeMotor, _super);
    function LargeMotor(port) {
        _super.call(this, port, 'lego-ev3-l-motor');
    }
    return LargeMotor;
}(Motor));
exports.LargeMotor = LargeMotor;
var MediumMotor = (function (_super) {
    __extends(MediumMotor, _super);
    function MediumMotor(port) {
        _super.call(this, port, 'lego-ev3-m-motor');
    }
    return MediumMotor;
}(Motor));
exports.MediumMotor = MediumMotor;
var DcMotor = (function (_super) {
    __extends(DcMotor, _super);
    function DcMotor(port) {
        _super.call(this, 'dc-motor', null, port);
    }
    Object.defineProperty(DcMotor.prototype, "commandValues", {
        get: function () {
            return {
                runForever: "run-forever",
                runTimed: "run-timed",
                runDirect: "run-direct",
                stop: "stop"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "polarityValues", {
        get: function () {
            return {
                normal: "normal",
                inversed: "inversed"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "stopActionValues", {
        get: function () {
            return {
                coast: "coast",
                brake: "brake"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "address", {
        get: function () {
            return this.readString("address");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "command", {
        set: function (value) {
            this.setString("command", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "commands", {
        get: function () {
            return this.readStringArray("commands");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "driverName", {
        get: function () {
            return this.readString("driver_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "dutyCycle", {
        get: function () {
            return this.readNumber("duty_cycle");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "dutyCycleSp", {
        get: function () {
            return this.readNumber("duty_cycle_sp");
        },
        set: function (value) {
            this.setNumber("duty_cycle_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "polarity", {
        get: function () {
            return this.readStringAsType("polarity");
        },
        set: function (value) {
            this.setString("polarity", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "rampDownSp", {
        get: function () {
            return this.readNumber("ramp_down_sp");
        },
        set: function (value) {
            this.setNumber("ramp_down_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "rampUpSp", {
        get: function () {
            return this.readNumber("ramp_up_sp");
        },
        set: function (value) {
            this.setNumber("ramp_up_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "state", {
        get: function () {
            return this.readStringArray("state");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "stopAction", {
        set: function (value) {
            this.setString("stop_action", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "stopActions", {
        get: function () {
            return this.readStringArray("stop_actions");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DcMotor.prototype, "timeSp", {
        get: function () {
            return this.readNumber("time_sp");
        },
        set: function (value) {
            this.setNumber("time_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    return DcMotor;
}(MotorBase));
exports.DcMotor = DcMotor;
var ServoMotor = (function (_super) {
    __extends(ServoMotor, _super);
    function ServoMotor(port) {
        _super.call(this, 'servo-motor', null, port);
    }
    Object.defineProperty(ServoMotor.prototype, "commandValues", {
        get: function () {
            return {
                run: "run",
                float: "float"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "polarityValues", {
        get: function () {
            return {
                normal: "normal",
                inversed: "inversed"
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "address", {
        get: function () {
            return this.readString("address");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "command", {
        set: function (value) {
            this.setString("command", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "driverName", {
        get: function () {
            return this.readString("driver_name");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "maxPulseSp", {
        get: function () {
            return this.readNumber("max_pulse_sp");
        },
        set: function (value) {
            this.setNumber("max_pulse_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "midPulseSp", {
        get: function () {
            return this.readNumber("mid_pulse_sp");
        },
        set: function (value) {
            this.setNumber("mid_pulse_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "minPulseSp", {
        get: function () {
            return this.readNumber("min_pulse_sp");
        },
        set: function (value) {
            this.setNumber("min_pulse_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "polarity", {
        get: function () {
            return this.readStringAsType("polarity");
        },
        set: function (value) {
            this.setString("polarity", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "positionSp", {
        get: function () {
            return this.readNumber("position_sp");
        },
        set: function (value) {
            this.setNumber("position_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "rateSp", {
        get: function () {
            return this.readNumber("rate_sp");
        },
        set: function (value) {
            this.setNumber("rate_sp", value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServoMotor.prototype, "state", {
        get: function () {
            return this.readStringArray("state");
        },
        enumerable: true,
        configurable: true
    });
    return ServoMotor;
}(MotorBase));
exports.ServoMotor = ServoMotor;
//# sourceMappingURL=motors.js.map