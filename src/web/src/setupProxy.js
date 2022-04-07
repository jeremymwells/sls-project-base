const { createProxyMiddleware } = require('http-proxy-middleware');

const stage = process.env.REACT_APP_STAGE || 'local';

module.exports = function(app) {
  app.use(
    `/${stage}/api/`,
    createProxyMiddleware({
      target: `http://localhost:8080`,
      changeOrigin: true,
      ws: false,
      hostRewrite: true,
    })
  );
};
