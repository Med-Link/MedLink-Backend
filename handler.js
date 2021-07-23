'use strict';

const serverless = require('serverless-http');
const app = require('./src/index.server');

module.exports.hello = serverless(app);
