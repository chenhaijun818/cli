'use strict';

const path = require('path')

const getPackages = require('installed-packages')

function exec(command) {
    // 1.判定这个命令的包是否已经下载
    // 2.没下载，就下载
    // 3.已下载，就更新
    console.log('exec')
    getPackages().then(packages => {
        console.log('packages:', packages.filter(p => {
            const reg = new RegExp(p)
            return reg.test('lizen')
        }))
    })
    // let pkg = new Package({
    //     name: `@lizen/${name}`,
    //     targetDir: process.env.TARGET_PATH,
    //     storeDir: path.join()
    // });
    // pkg.install();
    // const rootFile = pkg.getRootFilePath();
    // console.log(rootFile)
}

module.exports = exec;
