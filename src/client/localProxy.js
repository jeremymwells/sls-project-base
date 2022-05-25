const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const apiPrefix = process.env.REACT_APP_API_ROOT || 'local';
const ci = process.env.CI || false;

setTimeout(async function() {
  const app = express();
  app.use(
    `${apiPrefix}/`,
    createProxyMiddleware({
      target: `http://localhost:8080`,
      changeOrigin: true,
      ws: true,
      hostRewrite: true,
    })
  );
  
  const webPort = require('./.expo/packager-info.json').webpackServerPort
  app.use(
    `/`,
    createProxyMiddleware({
      target: `http://localhost:${webPort}`,
      changeOrigin: true,
      ws: true,
      hostRewrite: true,
    })
  );
  
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log(`React Native App Proxy Running on port 3000`);
  console.info('Open browser to http://localhost:3000');
  
  if (!ci) {
    await require('open')('http://localhost:3000', { wait: false });
  }
  
  app.listen(3000);
}, 4500)
