#!/usr/bin/env node

var childProcess = require('child_process');
var Promise = require('bluebird');
var _ = require('lodash');
var utils = require('./lib/utils.js');
var Listener = require('./hid.js');


var defaultOpts = {
    debounce: 50,
    verbose: false,
    silent: false,
    initial: false,
    command: null
};

var VERSION = 'arcade-commander-cli: ' + require('./package.json').version;

var argv = require('yargs')
    .usage(
        'Usage: $0 <command> [options]\n\n' +
        '<command>:\n' +
        'The bash command to be executed on a button press.\n'
    )
    .example('$0 "npm run build-js"', 'Run an NPM script')
    .example('$0 "/etc/init.d/mysql restart"', 'Restart a process')
    .demand(1)
    .option('d', {
        alias: 'debounce',
        default: defaultOpts.debounce,
        describe: 'Debounce timeout in ms for executing command',
        type: 'number'
    })
    .option('i', {
        alias: 'initial',
        describe: 'When set, command is initially run once',
        default: defaultOpts.initial,
        type: 'boolean'
    })
    .option('verbose', {
        describe: 'When set, output is more verbose and human readable.',
        default: defaultOpts.verbose,
        type: 'boolean'
    })
    .option('silent', {
        describe: 'When set, internal messages of arcade-commander-cli won\'t be written.',
        default: defaultOpts.silent,
        type: 'boolean'
    })
    .help('h')
    .alias('h', 'help')
    .alias('v', 'version')
    .version(VERSION)
    .argv;


function main() {
    var userOpts = getUserOpts(argv);
    var opts = _.merge(defaultOpts, userOpts);
    startListening(opts);
}

function getUserOpts(argv) {
    argv.command = argv._[0];
    // console.log('command to run', argv.command);
    return argv;
}

function startListening(opts) {

    var debouncedRun = _.debounce(run, opts.debounce);

    if (opts.initial) {
        debouncedRun(opts.command);
    }

    var listener = new Listener();
    listener.on('trigger', function() {
        debouncedRun(opts.command);
    });

}

function run(cmd) {
    return utils.run(cmd)
    .catch(function(err) {
        console.error('Error when executing', cmd);
        console.error(err.stack);
    });
}

main();
