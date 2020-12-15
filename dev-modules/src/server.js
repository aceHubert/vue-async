const path = require('path');
const express = require('express');
const app = express();

const ipAddress = process.env.MODULE_IP_ADDRESS || 'localhost';
const port = process.env.MODULE_PORT || 7002;

app.use('/', express.static(path.join(__dirname, '../dist')));

// eslint-disable-next-line no-console
app.listen(port, ipAddress, () =>
  console.log('\x1b[36m', `Module server is listening on: http://${ipAddress}:${port}`, '\x1b[0m'),
);
