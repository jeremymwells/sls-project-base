const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const apiPrefix = process.env.REACT_APP_API_ROOT || 'local';

setTimeout(async function() {
  const app = express();
  app.use(
    `${apiPrefix}/`,
    createProxyMiddleware({
      target: `http://localhost:8080`,
      changeOrigin: true,
      ws: false,
      hostRewrite: true,
    })
  );
  
  const webPort = require('./.expo/packager-info.json').webpackServerPort
  app.use(
    `/`,
    createProxyMiddleware({
      target: `http://localhost:${webPort}`,
      changeOrigin: true,
      ws: false,
      hostRewrite: true,
    })
  );
  
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  console.log(`React Native App Proxy Running on port 3000`);
  console.info('Open browser to http://localhost:3000');
  
  await require('open')('http://localhost:3000', { wait: false });
  
  app.listen(3000);
}, 4500)
