#! /usr/bin/env node
'use strict';
// 内置包
const path = require('path');
// 第三方包
const rootCheck = require('root-check');
const pathExists = require('path-exists').sync;
const userHome = require('user-home');
const colors = require('colors/safe');
const semver = require('semver')
const dotenv = require('dotenv');
const {Command} = require("commander");
const axios = require('axios')
// 自己开发的包
const npmlog = require('@lizen/log')
const pkg = require("../package.json");

const program = new Command();

cli()

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
    checkUpdate();
}

// 注册命令
function registerCommand() {
    program
        .name('lizen')
        .usage('<command> [options]')
        .version(pkg.version)
        .option('-d, --debug', '开启调试模式')
        .option('-t, --target <target>', '指定本地调试文件')

    program.command('publish <name>')
        .option('-f, --force', '是否强制初始化')
        .action(exec);

    // 处理debug模式
    program.on('option:debug', () => {
        npmlog.level = process.env.LOG_LEVEL = 'verbose'
    });

    // 处理本地调试文件
    program.on('option:target', () => {
        process.env.TARGET_PATH = program.opts().target
    })

    program.on('command:*', (e) => {
        npmlog.info('unknown command:', e.shift());
        program.outputHelp()
    });

    program.parse(process.argv);
}

// 执行命令
function exec(command) {
    console.log(command)
}

// 检查脚手架版本号
function checkPkgVersion() {
    npmlog.info(`version: ${pkg.version}`);
}

// 检查node版本
function checkNodeVersion() {
    const current = process.version;
    const lowest = '12.0.0';
    if (!semver.gt(current, lowest)) {
        throw new Error(colors.red(`node版本要求：${lowest}+`))
    }
}

// 检查用户主目录
function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red('当前登录用户主目录不存在！'));
    }
    process.env.HOME_PATH = userHome
}

// 检查环境变量
function checkEnv() {
    const dotenvPath = path.resolve(userHome, '.env');
    if (pathExists(dotenvPath)) {
        const config = dotenv.config({
            path: path.resolve(userHome, '.env')
        });
        console.log(config);
    }
}

// 检查更新
async function checkUpdate() {
    const currentVersion = pkg.version;
    const pkgName = pkg.name;
    const res = await axios.get(`https://registry.npmjs.org/${pkgName}`);
    if (!res.data || !res.data.versions) {
        return;
    }
    const versions = Object.keys(res.data.versions);
    const latestVersion = semver.maxSatisfying(versions, `^${currentVersion}`);
    if (latestVersion !== currentVersion) {
        npmlog.info('new version available:', colors.red(currentVersion), '->', colors.green(latestVersion))
    }
}
