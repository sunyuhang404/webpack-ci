
// 跑用例之前, 需要进入到template目录

const path = require('path');
process.chdir(path.join(__dirname, 'smoke/template'));

// 用来引一下实际单元测试用例
describe('builder-webpack test case\n', () => {
  require('./unit/webpack-base-test');
});
