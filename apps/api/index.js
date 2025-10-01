/* eslint-disable */
// Vercel serverless entry point
const app = require('./dist/index.js').default || require('./dist/index.js');

module.exports = app;
