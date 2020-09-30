const path = require('path');

const { loadNuxt, build } = require('nuxt');

const express = require('express');
const app = express();

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 7001;

(async function run() {
  const nuxt = await loadNuxt({
    for: 'dev',
    rootDir: path.resolve(__dirname),
  });

  build(nuxt);

  app.use('/modules', express.static(path.resolve(__dirname, '../dev-modules')));

  app.use(nuxt.render);

  // eslint-disable-next-line no-console
  app.listen(port, host, () => console.log('\x1b[36m', `server is listening on: ${host}:${port}`, '\x1b[0m'));
})();
