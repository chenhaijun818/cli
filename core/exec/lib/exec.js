'use strict';
const Package = require('@lizen/package');

function exec() {
    let pkg = new Package();
    console.log(pkg);
}

module.exports = exec;
