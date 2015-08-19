var HID = require('node-hid');
var lodash = require('lodash');
var EventEmitter = require('events').EventEmitter;

module.exports = ArcadeCommanderHID = function() {
    this.controller = getDevice();

    this.controller.on('data', function(data) {
        this.debug('data:', hex(data[0]), hex(data[1]), hex(data[2]), hex(data[3]));

        this.handleMessage(data[2], data[3]);

        // TODO: validate the first two bytes
        // if (data[0] === 0xab && data[1] === 0xcd) {
        //     //handle message...
        // } else {
        //     throw new Error('Invalid packet received: ' + hex(data[0]) + ' ' + hex(data[1]));
        // }
    }.bind(this));
}
ArcadeCommanderHID.prototype = Object.create(EventEmitter.prototype);

ArcadeCommanderHID.prototype.handleMessage = function(messageByte, paramByte) {
    var buttonPressed = (paramByte == 0x01 || paramByte == 0x54);
    if (buttonPressed) {
        this.trigger();
    }
}

ArcadeCommanderHID.prototype.trigger = function() {
    this.emit('trigger');
}

ArcadeCommanderHID.prototype.debug = function() {
    if (false) {
        console.log.apply(console, arguments);
    }
}

////////////
// DEVICES
////////////

function getDevice() {
    var devices = lodash.filter(HID.devices(), function(device) {
        return device.product === 'Teensyduino RawHID';
    });

    if (devices.length === 0) {
        throw new Error('no Teensyduino device found');
    }

    return new HID.HID(devices[0].path);
}

/////////////
// UTILITES
/////////////

function hex(number) {
    var result = number.toString(16).toUpperCase();
    return '0x00'.substr(0, 4 - result.length) + result;
}

function bin(number) {
    var padding = '00000000';
    var result = (number >>> 0).toString(2);
    return padding.substr(result.length) + result;
}
