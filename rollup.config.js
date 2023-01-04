// rollup 可以使用ES6的 module语法
// import path from 'path';
// import json from '@rollup/plugin-json';
// import resolvePlugin from '@rollup/plugin-node-resolve';
// import ts from 'rollup-plugin-typescript2';

const path = require('path');
const json = require('@rollup/plugin-json');
const resolvePlugin = require('@rollup/plugin-node-resolve');
const ts = require('rollup-plugin-typescript2');

const packagesDir = path.resolve(__dirname, 'packages')

const packageDir = path.resolve(packagesDir, process.env.TARGET) //找到需要打包的模块

const resolve = (p) => path.resolve(packageDir, p)

const name = path.basename(packageDir) // 获取文件名称

const pkg = require(resolve('package.json'))

const outputConfig = {
    'esm-bundler': {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    'cjs': {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    'global': {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife'
    }
}

function createConfig(format, outputConfig) {
    outputConfig.name = pkg.buildOptions.name
    outputConfig.sourcemap = true

    const opt = {
        input: resolve(`src/index.ts`),
        output: outputConfig,
        plugins: [
            json(),
            ts({
                tsconfig: path.resolve(__dirname, 'tsconfig.json')
            }),
            resolvePlugin()
        ]
    }

    return opt
}


module.exports = pkg.buildOptions.formats.map(format => createConfig(format, outputConfig[format]))  