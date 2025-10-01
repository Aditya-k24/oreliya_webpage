/* eslint-disable */
// Vercel serverless handler
const appModule = require('./dist/index.js');
const app = appModule.default || appModule;

module.exports = (req, res) => {
  return app(req, res);
};
