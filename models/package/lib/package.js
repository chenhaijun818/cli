'use strict';

class Package {

    targetPath = '';
    storePath = '';
    packageName = '';
    packageVersion = '';

    constructor(options) {
        this.targetPath = options.targetPath;
        this.storePath = options.storePath;
        this.packageName = options.name;
        this.packageVersion = options.version;
        console.log('package constructor')
    }

    install() {
    }

    update() {
    }

    exists() {
    }

}

module.exports = Package;
