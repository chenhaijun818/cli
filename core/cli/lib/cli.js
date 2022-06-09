'use strict';

const pkg = require("../package.json");
const init = require("@lizen/init");
module.exports = cli;

function cli() {
    prepare();
    registerCommand();
}

function prepare() {
    console.log('prepare...');
    checkPkgVersion();
    checkRoot();
}

function registerCommand() {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version);

    program.command('init [name]').option('-f, --force', '是否强制初始化').action(init);

    program.on('option:debug', () => {
        console.log('on debug')
    });

    program.on('command:*', (e) => {
        console.log('unknown command:', e.shift())
    });

    program.parse(process.argv)
}

function checkPkgVersion() {
    log.info('cli', pkg.version);
}

function checkRoot() {
    const rootCheck = require('root-check');
    rootCheck();
}
