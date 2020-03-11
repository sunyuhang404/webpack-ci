
const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({
  timeout: '10000ms'
});

process.chdir(path.join(__dirname, 'template'));

// 先删除 dist
rimraf('./dist', () => {
  // 用 webpack 构建一遍
  const prodConfig = require('../../lib/webpack.prod');
  webpack(prodConfig, (err, stats) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }
    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false
    }));

    console.log('\nWebpack build success, begin run test.');

    // 添加测试用例
    mocha.addFile(path.join(__dirname, 'html-test.js'));
    mocha.addFile(path.join(__dirname, 'css-js-test.js'));
    // 执行
    mocha.run();
  });
});
