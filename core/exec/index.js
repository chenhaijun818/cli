const Package = require('@lizen/package');

function exec() {
    let package = new Package();
    console.log(package);
    console.log('exec')
}

module.exports = exec;
