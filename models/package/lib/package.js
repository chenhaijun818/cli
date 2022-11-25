'use strict';
const path = require('path')

const pkgDir = require('pkg-dir').sync

class Package {

    targetPath = '';
    storePath = '';
    packageName = '';
    packageVersion = '';

    constructor(options) {
        if (!options) {
            throw new Error('Package constructor error: 无效的参数')
        }
        this.targetPath = options.target;
        this.storePath = options.storePath;
        this.packageName = options.name;
        this.packageVersion = options.version;
    }

    install() {
    }

    update() {
    }

    exists() {
    }

    getRootFilePath() {
        const dir = pkgDir(this.targetPath);
        if (dir) {
            const pkg = require(path.join(dir, 'package.json'))
            if (pkg) {
                return path.join(dir, pkg.main).replace(/\\/g, '/')
            }
        }
    }

}

module.exports = Package;
