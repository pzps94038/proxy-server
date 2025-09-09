const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', createProxyMiddleware({
  target: process.env.TARGET_URL,
  changeOrigin: true
}));

app.listen(process.env.PORT || 3000);