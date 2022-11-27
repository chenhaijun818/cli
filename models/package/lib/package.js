'use strict';
const path = require('path')

const pkgDir = require('pkg-dir').sync
const npminstall = require('npminstall')

class Package {

    targetDir = '';
    storeDir = '';
    packageName = '';
    packageVersion = '';

    constructor(options) {
        if (!options) {
            throw new Error('Package constructor error: 无效的参数')
        }
        this.targetDir = options.targetDir;
        this.storeDir = options.storeDir;
        this.packageName = options.name;
        this.packageVersion = options.version;
    }

    install() {
        npminstall({
            storeDir: path.join(this.targetDir, 'node_modules'),
            pkgs: [
                {name: this.packageName, version: this.packageVersion}
            ]
        })
    }

    update() {
    }

    exists() {
        return false
    }

    getRootFilePath() {
        const dir = pkgDir(this.targetDir);
        if (dir) {
            const pkg = require(path.join(dir, 'package.json'))
            if (pkg) {
                return path.join(dir, pkg.main).replace(/\\/g, '/')
            }
        }
    }

}

module.exports = Package;
