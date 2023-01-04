// 将所有的模块打包
const fs = require('fs')
const execa = require('execa');

const target = fs.readdirSync('packages').filter(f => {
    return fs.statSync(`packages/${f}`).isDirectory()
})

runParallel(target, build)

async function build(target) {
    //开启子进程 并且使用rollup打包
    await execa('rollup', ['-c', '--environment', `TARGET:${target}`], { stdio: 'inherit' })
}

function runParallel(targets, build) {
    let resList = targets.map(t => {
        return build(t)
    })
    return Promise.all(resList)
}
