#! /usr/bin/env node

let pkg = require('../package.json')

checkVersion();


function checkVersion() {
    console.log(pkg.version)
}