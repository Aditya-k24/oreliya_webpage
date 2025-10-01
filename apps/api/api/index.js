// Vercel serverless function wrapper for Express app
const app = require('../dist/index.js').default || require('../dist/index.js');

module.exports = app;

