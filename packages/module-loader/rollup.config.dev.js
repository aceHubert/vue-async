import * as path from 'path';
import alias from '@rollup/plugin-alias';
import serve from 'rollup-plugin-serve';
import { builds, genConfig } from './rollup.config.js';

const config = genConfig(builds['iife-dev'], true);
config.input = './dev/main.js';
config.plugins.unshift(
  alias({
    entries: {
      '@vue-async/module-loader': path.resolve(__dirname, './src'),
    },
  }),
);
config.plugins = config.plugins.concat([
  serve({
    contentBase: ['dev', 'dist'],
    historyApiFallback: true,
    port: 7000,
  }),
]);

export default config;
