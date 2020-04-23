const path = require('path');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, '../dist')));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Modules服务器启动成功');
});
