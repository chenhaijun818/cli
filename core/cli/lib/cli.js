'use strict';

const path = require('path');

const rootCheck = require('root-check');
const pkg = require("../package.json");
const init = require("@lizen/init");
const pathExists = require('path-exists').sync;
const userHome = require('user-home');
const colors = require('colors/safe');
const dotenv = require('dotenv');
const {Command} = require("commander");

const program = new Command();

module.exports = cli;

function cli() {
    prepare();
    registerCommand();
}

function prepare() {
    console.log('prepare...');
    checkPkgVersion();
    rootCheck();
    checkUserHome();
    checkEnv();
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

    program.parse(process.argv);
}

function checkPkgVersion() {
    console.log('cli', pkg.version);
}

function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'));
    }
}

function checkEnv() {
    const dotenvPath = path.resolve(userHome, '.env');
    if (pathExists(dotenvPath)) {
        const config = dotenv.config({
            path: path.resolve(userHome, '.env')
        });
        console.log(config);
    }
}
