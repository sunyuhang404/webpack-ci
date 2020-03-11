
const webpack = require('webpack');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.base');

/**
 * 代码热更新
 * source map 设置
 */

const devConfig = {
  devServer: {
    // 服务基于那个目录
    contentBase: './dist',
    hot: true,
    stats: 'errors-only',
  },
  mode: 'development',
  devtool: 'cheap-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = merge(baseConfig, devConfig);
