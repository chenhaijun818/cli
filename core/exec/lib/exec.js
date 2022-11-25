'use strict';
const Package = require('@lizen/package/lib/package.js');

function exec(name) {
    let pkg = new Package({
        name: name,
        target: process.env.TARGET_PATH
    });
    const rootFile = pkg.getRootFilePath();
    console.log(rootFile)
}

module.exports = exec;
