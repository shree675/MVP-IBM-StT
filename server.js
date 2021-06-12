#! /usr/bin/env node

require('dotenv').config({ silent: true });

const app = require('./app');

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'client/build')));
//   app.get('*', (req, res) => {
//     res.sendfile(path.join((__dirname = 'client/build/index.html')));
//   });
// }

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Server running on port: %d', port);
});

module.exports = server;
