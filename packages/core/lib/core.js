#! /usr/bin/env node

let pkg = require('../package.json');
let commander = require('commander');
// let program = commander.program;
let program = new commander.Command();

let dev = program.command('dev [port]');
dev.action((port) => {
    console.log('dev start on ', port)
})

program
    .version(pkg.version)
    // .option('-f, --foo <foo>', '测试')
    .parse(process.argv)

// checkVersion();

// console.log(program.opts().foo)

function checkVersion() {
    console.log(pkg.version)
}
