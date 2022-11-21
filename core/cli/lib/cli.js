'use strict';

const path = require('path');

const rootCheck = require('root-check');
const pathExists = require('path-exists').sync;
const userHome = require('user-home');
const colors = require('colors/safe');
const semver = require('semver')
const dotenv = require('dotenv');
const {Command} = require("commander");
const minimist = require('minimist')
const axios = require('axios')
// const urlJoin = require('url-join')

const init = require("@coomic/init");
const npmlog = require('@coomic/log')
const pkg = require("../package.json");
const config = require('./config')

const program = new Command();

module.exports = cli;

function cli() {
    try {
        prepare();
        registerCommand();
    } catch (e) {
        npmlog.error(e.message)
    }
}

// 准备阶段
function prepare() {
    checkPkgVersion();
    checkNodeVersion();
    rootCheck();
    checkUserHome();
    checkEnv();
    checkArgs();
    checkUpdate();
}

// 注册命令
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

// 检查脚手架版本号
function checkPkgVersion() {
    npmlog.info(`version:${pkg.version}`);
}

// 检查node版本
function checkNodeVersion() {
    const current = process.version;
    const lowest = config.LOWEST_NODE_VERSION;
    if (!semver.gt(current, lowest)) {
        throw new Error(colors.red(`node版本要求：${lowest}+`))
    }
}

// 检查用户主目录
function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'));
    }
}

// 检查环境变量
function checkEnv() {
    const dotenvPath = path.resolve(userHome, '.env');
    // console.log(dotenvPath)
    // console.log(pathExists(dotenvPath))
    if (pathExists(dotenvPath)) {
        const config = dotenv.config({
            path: path.resolve(userHome, '.env')
        });
        console.log(config);
    }
}

// 检查参数，处理debug模式
function checkArgs() {
    const args = minimist(process.argv.slice(2))
    npmlog.level = process.env.LOG_LEVEL = args.debug ? 'verbose' : 'info';
}

// 检查更新
async function checkUpdate() {
    const currentVersion = pkg.version;
    const pkgName = pkg.name;
    const res = await axios.get(`https://registry.npm.taobao.org/${pkgName}`);
    if (!res.data || !res.data.versions) {
        return;
    }
    const versions = Object.keys(res.data.versions);
    const latestVersion = semver.maxSatisfying(versions, `^${currentVersion}`);
    npmlog.info('new version available:', colors.red(currentVersion), '->', colors.green(latestVersion))
}
