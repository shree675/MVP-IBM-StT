#! /usr/bin/env node

require('dotenv').config({ silent: true });
const app = require('./app');
var path = require('path');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Server running on port: %d', port);
});

module.exports = server;
