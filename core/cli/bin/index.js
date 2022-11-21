#! /usr/bin/env node

const {Command} = require('commander')

const pkg = require('../package.json')
const npmlog = require('@lizen/log')

const program = new Command()

program
    .name('lizen')
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否启用调试模式', false);

program.command('create <name> <location>')
    .action((name, location) => {
        console.log(name, location)
    });

program.on('command:*', () => {
    npmlog.info('未知的命令');
    program.outputHelp()
})

program.parse();
// const cli = require('../lib/cli');

// cli();
