const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 設定前綴，預設為 'PROXY_'
const PREFIX = 'PROXY_';

// 掃描所有環境變數，找出符合前綴的變數
function setupProxyRoutes() {
  const proxyRoutes = {};

  // 遍歷所有環境變數
  Object.keys(process.env).forEach(key => {
    if (key.startsWith(PREFIX)) {
      // 移除前綴，轉換為路由路徑
      const routePath = key.replace(PREFIX, '').toLowerCase().replace(/_/g, '-');
      const targetUrl = process.env[key];

      if (targetUrl) {
        proxyRoutes[`/${routePath}`] = targetUrl;
        console.log(`設定代理路由: /${routePath} -> ${targetUrl}`);
      }
    }
  });

  return proxyRoutes;
}

// 設定代理路由
const proxyRoutes = setupProxyRoutes();

// 為每個路由建立代理中介軟體
Object.entries(proxyRoutes).forEach(([path, target]) => {
  app.use(path, createProxyMiddleware({
    target: target,
    changeOrigin: true,
    pathRewrite: {
      [`^${path}`]: '', // 移除路徑前綴
    },
  }));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`使用前綴: ${PREFIX}`);
  if (Object.keys(proxyRoutes).length > 0) {
    console.log('已設定的代理路由:');
    Object.entries(proxyRoutes).forEach(([path, target]) => {
      console.log(`  ${path} -> ${target}`);
    });
  }
});