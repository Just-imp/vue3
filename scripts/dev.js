// 只针对某个模块打包 并开启监控模式
const execa = require('execa');

async function build(target) {
    //开启子进程 并且使用rollup打包
    await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], { stdio: 'inherit' })
}

build('reactivity')
