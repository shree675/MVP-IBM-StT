#! /usr/bin/env node

require('dotenv').config({ silent: true });
const express = require('express');

const app = require('./app');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join((__dirname = 'build/index.html')));
  });
}

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Server running on port: %d', port);
});

module.exports = server;
