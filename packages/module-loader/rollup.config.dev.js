// import * as path from 'path';
// import alias from '@rollup/plugin-alias';
// import serve from 'rollup-plugin-serve';
// import typescript from 'rollup-plugin-typescript2';
import { builds, genConfig } from './rollup.config.js';

// const config = genConfig(builds['iife-dev'], true);
// config.input = './dev/main.ts';

//https://github.com/ezolenko/rollup-plugin-typescript2/issues/125#issuecomment-490126822
// config.plugins.splice(
//   config.plugins.findIndex((plugin) => plugin.name === 'rpt2'),
//   1,
//   typescript({
//     clean: true,
//     include: ['./src/**/*.ts', './dev/**/*.ts'],
//     exclude: [],
//     tsconfig: path.resolve(__dirname, './tsconfig.dev.json'),
//     rollupCommonJSResolveHack: true,
//     useTsconfigDeclarationDir: true,
//     typescript: require('ttypescript'),
//   }),
// );

// config.plugins.unshift(
//   alias({
//     entries: {
//       '@vue-async/module-loader': path.resolve(__dirname, './src'),
//     },
//   }),
// );

// config.plugins = config.plugins.concat([
//   serve({
//     contentBase: ['dev-modules'],
//     historyApiFallback: true,
//     port: 7000,
//   }),
// ]);

const config = [genConfig(builds['es'], true)];

export default config;
