"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fs = require('fs');
var path = require('path');
var Promise = null;
try {
    Promise = require('bluebird');
}
catch (e) {
}
var XError = (function () {
    function XError() {
        var tsargs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tsargs[_i - 0] = arguments[_i];
        }
        Error.apply(this, arguments);
        return new Error();
    }
    return XError;
}());
XError['prototype'] = new Error();
var TraceError = (function () {
    function TraceError(message, innerError) {
        this.message = message;
        this.innerError = innerError;
    }
    TraceError.prototype.toString = function () {
        var str = this.message.trim() + '\r\nInner error:\r\n';
        var innerLines = this.innerError.toString().split('\r\n');
        for (var i in innerLines) {
            innerLines[i] = '  ' + innerLines[i];
        }
        return str + innerLines.join('\r\n');
    };
    return TraceError;
}());
exports.TraceError = TraceError;
var EventNotificationRequest = (function () {
    function EventNotificationRequest(callbackFunction, eventPredicate, firstTriggerOnly, userData) {
        if (firstTriggerOnly === void 0) { firstTriggerOnly = true; }
        this.callbackFunction = callbackFunction;
        this.eventPredicate = eventPredicate;
        this.userData = userData;
        this.firstTriggerOnly = firstTriggerOnly;
    }
    EventNotificationRequest.prototype.handleUpdate = function () {
        var predicateResult;
        try {
            predicateResult = this.eventPredicate(this.userData);
        }
        catch (e) {
            this.callbackFunction(e);
            return false;
        }
        if (predicateResult) {
            this.callbackFunction();
            if (this.firstTriggerOnly)
                return false;
        }
        return true;
    };
    return EventNotificationRequest;
}());
var Device = (function () {
    function Device() {
        this.connected = false;
        this.sysClassDir = '/sys/class';
        this.pendingEventRequests = [];
        this.eventTimerCancellationToken = null;
    }
    Device.prototype.connect = function (driverName, nameConvention, propertyConstraints) {
        var nameRegex = nameConvention ? new RegExp(nameConvention) : undefined;
        var deviceSearchDir = path.join(Device.overrideSysClassDir || this.sysClassDir, driverName);
        var availableDevices;
        try {
            availableDevices = fs.readdirSync(deviceSearchDir);
        }
        catch (error) {
            return;
        }
        for (var deviceDirIndex in availableDevices) {
            var currentDeviceDirName = availableDevices[deviceDirIndex];
            if (nameRegex != undefined && !nameRegex.test(currentDeviceDirName)) {
                continue;
            }
            var currentDeviceDir = path.join(deviceSearchDir, currentDeviceDirName);
            var satisfiesConstraints = true;
            if (propertyConstraints != undefined) {
                for (var propName in propertyConstraints) {
                    var propertyValue = this.readProperty(propName, currentDeviceDir);
                    var constraintValue = propertyConstraints[propName];
                    if (constraintValue instanceof Array) {
                        if (constraintValue.indexOf(propertyValue) === -1) {
                            satisfiesConstraints = false;
                        }
                    }
                    else if (propertyValue != constraintValue) {
                        satisfiesConstraints = false;
                    }
                }
            }
            if (!satisfiesConstraints)
                continue;
            this.deviceRoot = currentDeviceDir;
            this.deviceDirName = currentDeviceDirName;
            this.connected = true;
        }
    };
    Device.prototype.constructPropertyPath = function (property, deviceRoot) {
        return path.join(deviceRoot || this.deviceRoot, property);
    };
    Device.prototype.readNumber = function (property, deviceRoot) {
        var value = this.readProperty(property, deviceRoot);
        if (typeof value !== 'number')
            return NaN;
        return value;
    };
    Device.prototype.readString = function (property, deviceRoot) {
        var value = this.readProperty(property, deviceRoot);
        return String(value);
    };
    Device.prototype.readStringAsType = function (property, deviceRoot) {
        return this.readString(property, deviceRoot);
    };
    Device.prototype.readStringArray = function (property, deviceRoot) {
        return this.readString(property, deviceRoot)
            .split(' ')
            .map(function (value) { return value.replace(/^\[|\]$/g, ''); });
    };
    Device.prototype.readStringArrayAsType = function (property, deviceRoot) {
        return this.readStringArray(property, deviceRoot);
    };
    Device.prototype.readStringSelector = function (property, deviceRoot) {
        var bracketedParts = this.readString(property, deviceRoot)
            .split(' ')
            .filter(function (value) { return value.match(/^\[|\]$/g) != null; });
        if (bracketedParts.length <= 0)
            return null;
        return bracketedParts[0].replace(/^\[|\]$/g, '');
    };
    Device.prototype.readProperty = function (property, deviceRoot) {
        if (!deviceRoot && !this.connected)
            throw new Error('You must be connected to a device before you can read from it. This error probably means that the target device was not found.');
        var rawValue;
        var propertyPath = this.constructPropertyPath(property, deviceRoot);
        try {
            rawValue = fs.readFileSync(propertyPath).toString();
        }
        catch (e) {
            throw new TraceError('There was an error while reading from the property file "' + propertyPath + '".', e);
        }
        rawValue = rawValue.trim();
        var numValue = Number(rawValue);
        if (isNaN(numValue))
            return rawValue;
        else
            return numValue;
    };
    Device.prototype.setProperty = function (property, value) {
        if (!this.connected)
            throw new Error('You must be connected to a device before you can write to it. This error probably means that the target device was not found.');
        var propertyPath = this.constructPropertyPath(property);
        try {
            fs.writeFileSync(propertyPath, value.toString());
        }
        catch (e) {
            throw new TraceError('There was an error while writing to the property file "' + propertyPath + '".', e);
        }
    };
    Device.prototype.setNumber = function (property, value) {
        this.setProperty(property, value);
    };
    Device.prototype.setString = function (property, value) {
        this.setProperty(property, value);
    };
    Device.prototype.set = function (propertyDefs) {
        for (var key in propertyDefs) {
            this.setProperty(key, propertyDefs[key]);
        }
    };
    Device.prototype.updatePendingEventRequests = function () {
        this.pendingEventRequests = this.pendingEventRequests.filter(function (eventRequest, index, arr) {
            return eventRequest.handleUpdate();
        });
        this.updateEventTimerState();
    };
    Device.prototype.updateEventTimerState = function () {
        var _this = this;
        if (this.pendingEventRequests.length > 0 && this.eventTimerCancellationToken == null) {
            this.eventTimerCancellationToken = setInterval(function () { return _this.updatePendingEventRequests(); }, Device.eventTimerInterval);
        }
        else if (this.pendingEventRequests.length <= 0 && this.eventTimerCancellationToken != null) {
            clearInterval(this.eventTimerCancellationToken);
            this.eventTimerCancellationToken = null;
        }
    };
    Device.prototype.registerEventCallback = function (callbackFunction, eventPredicate, firstTriggerOnly, userCallbackData) {
        if (firstTriggerOnly === void 0) { firstTriggerOnly = false; }
        var newEventRequest = new EventNotificationRequest(function (err) {
            callbackFunction(err, userCallbackData);
        }, eventPredicate, firstTriggerOnly, userCallbackData);
        this.pendingEventRequests.push(newEventRequest);
        this.updateEventTimerState();
    };
    Device.prototype.registerEventPromise = function (eventPredicate, userCallbackData) {
        var _this = this;
        if (Promise == null) {
            throw new Error("Promises are currently unavailable. Install the 'bluebird' package or use 'registerEventCallback(...)' instead.");
        }
        return new Promise(function (resolve, reject) {
            _this.registerEventCallback(function (err) {
                if (err)
                    reject(err);
                else
                    resolve(userCallbackData);
            }, eventPredicate, true, userCallbackData);
        });
    };
    Device.overrideSysClassDir = null;
    Device.eventTimerInterval = 50;
    return Device;
}());
exports.Device = Device;
var IndexedDevice = (function (_super) {
    __extends(IndexedDevice, _super);
    function IndexedDevice(driverTypeDirName, nameConvention, targetAddress, targetDriverName) {
        _super.call(this);
        this.deviceIndexRegex = new RegExp("(\\d+)", "g");
        this._deviceIndex = -1;
        var propertyConstraints = {};
        if (targetAddress != undefined)
            propertyConstraints['address'] = targetAddress;
        if (targetDriverName != undefined)
            propertyConstraints['driver_name'] = [].concat(targetDriverName);
        this.connect(driverTypeDirName, nameConvention, propertyConstraints);
        if (this.connected) {
            var matches = this.deviceIndexRegex.exec(this.deviceDirName);
            if (matches != null && matches[0] != undefined) {
                this._deviceIndex = Number(matches[1]);
            }
        }
    }
    Object.defineProperty(IndexedDevice.prototype, "deviceIndex", {
        get: function () {
            return this._deviceIndex;
        },
        enumerable: true,
        configurable: true
    });
    return IndexedDevice;
}(Device));
exports.IndexedDevice = IndexedDevice;
//# sourceMappingURL=io.js.map