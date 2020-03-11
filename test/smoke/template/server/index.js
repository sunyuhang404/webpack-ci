
if (typeof window === 'undefined') {
  global.window = {};
}

const fs = require('fs');
const path = require('path');
const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server');
const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8');
const data = require('./data.json');

const server = (port) => {
  const app = express();

  // 设置一个静态目录
  app.use(express.static('dist'));

  // 路由
  app.get('/search', (req, res) => {
    // 返回包裹在 HTML 中的组件
    const html = renderMarkup(renderToString(SSR));
    res.status(200).send(html);
  });

  // 监听端口
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
};

const renderMarkup = (str) => {
  const dataStr = JSON.stringify(data);
  return template.replace('<!--HTML_PLACEHOLDER-->', str)
    .replace('<!--INITIAL_DATA_PLACEHOLDER-->', `<script>window.__initial_data=${dataStr}</script>`);
}

server(process.env.PORT || 3000);