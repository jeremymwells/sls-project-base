const { createProxyMiddleware } = require('http-proxy-middleware');

const apiPrefix = process.env.REACT_APP_API_ROOT || 'local';

module.exports = function(app) {
  app.use(
    `${apiPrefix}/`,
    createProxyMiddleware({
      target: `http://localhost:8080`,
      changeOrigin: true,
      ws: false,
      hostRewrite: true,
    })
  );
};
