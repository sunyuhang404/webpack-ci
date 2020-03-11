
const path = require('path');
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 把目录改成执行测试的当前目录
const projectRoot = process.cwd();

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;
    return htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        // 设置模板位置
        template: path.join(projectRoot, `src/${pageName}/index.html`),
        // 指定打包出来的文件名称
        filename: `${pageName}.html`,
        // 指定生成的html要使用哪些chunk
        chunks: ['react', 'commons', pageName],
        // 设置打包出来的 js 和 css自动注入到html中
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      }),
    );
  });
  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  // 指定需要兼容的浏览器的版本 兼容浏览器最近的2个版本，使用人数超过1%和指定的浏览器版本
                  // browsers: ['last 2 version', '>1%', 'ios 7']
                  overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'],
                }),
              ],
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              exclude: /node_modules/,
              // 相对于px的转换单位 1rem = 75px
              remUnit: 75,
              // px转换成rem 小数点的位数
              remPrecesion: 8,
            },
          },
          'less-loader',
        ],
      },
      // {
      //   test: /.(png|jpg|gif|jpeg)$/,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         limit: 10240
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name][hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // 清理构建目录
    new CleanWebpackPlugin(),
    // CSS 提取成单独文件
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    // 命令行显示优化
    new FriendlyErrorsWebpackPlugin(),
    function errorPlugin() {
      // 构建错误捕获
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          // console.log('build error'); // eslint-disable-line
          process.exit(1);
        }
      });
    },
  ].concat(htmlWebpackPlugins),
};
