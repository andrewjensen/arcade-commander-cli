#!/usr/bin/env node

//SEE: http://misc.flogisoft.com/bash/tip_colors_and_formatting
//3d shadow

var colors = require('colors/safe');

if (Math.random() > 0.5) {
    win();
} else {
    fail();
}

function win() {
    _success('           ');
    _success('TESTS PASS!');
    _success('           ');
    console.log('');
}

function fail() {
    _error('           ');
    _error('TESTS FAIL!');
    _error('           ');
    console.log('');
}

function _success(msg) {
    console.log(colors.black(colors.bgGreen('     ' + msg + '     ')));
}

function _error(msg) {
    console.log(colors.black(colors.bgRed('     ' + msg + '     ')));
}
