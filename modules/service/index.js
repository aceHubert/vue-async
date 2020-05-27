const path = require('path');
const express = require('express');
const cors = require('express-cors');
const app = express();

const ipAddress = process.env.MODULE_IP_ADDRESS || '127.0.0.1';
const port = process.env.MODULE_PORT || 3000;

app.use(
  cors({
    allowedOrigins: ['localhost:3001'],
  }),
);

app.use('/', express.static(path.join(__dirname, '../dist')));

// eslint-disable-next-line no-console
app.listen(port, ipAddress, () => console.log(`Module server is listening on: ${ipAddress}:${port}`));
