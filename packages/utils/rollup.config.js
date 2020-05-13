import * as path from 'path';
// import filesize from 'rollup-plugin-filesize'
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import mulitEntry from '@rollup/plugin-multi-entry';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';
import lisence from 'rollup-plugin-license';
import { DEFAULT_EXTENSIONS } from '@babel/core';

const packageConfig = require('./package.json');
const extensions = [...DEFAULT_EXTENSIONS, '.ts', '.tsx'];

const builds = {
  'cjs-dev': {
    outFile: 'index.common.js',
    format: 'cjs',
    mode: 'development',
  },
  'cjs-prod': {
    outFile: 'index.common.min.js',
    format: 'cjs',
    mode: 'production',
  },
  'umd-dev': {
    outFile: 'index.umd.js',
    format: 'umd',
    mode: 'development',
  },
  'umd-prod': {
    outFile: 'index.umd.min.js',
    format: 'umd',
    mode: 'production',
  },
  'iife-dev': {
    outFile: 'index.js',
    format: 'iife',
    mode: 'development',
  },
  'iife-prod': {
    outFile: 'index.min.js',
    format: 'iife',
    mode: 'production',
  },
  es: {
    outFile: 'index.esm.js',
    format: 'es',
    mode: 'development',
  },
};

function genConfig({ outFile, format, mode }, clean = false) {
  const isProd = mode === 'production';
  return {
    input: ['./src/*.ts', './src/*/index.ts'],
    output: {
      file: path.join('./dist', outFile),
      // dir: './dist',
      format,
      globals: {
        vue: 'Vue',
      },
      exports: 'named',
      name: format === 'umd' || format === 'iife' ? 'vueAsyncUtils' : undefined,
    },
    // https://rollupjs.org/guide/en/#error-this-is-undefined
    // context: format === 'umd' ? 'window' : undefined,
    external: ['vue'],
    plugins: [
      clean &&
        clear({
          targets: ['./dist'],
          watch: true,
        }),
      mulitEntry(),
      resolve({
        browser: true,
        // Set the root directory to be the parent folder
        rootDir: path.join(process.cwd(), '../..'),
        extensions,
        // modulesOnly: true,
      }),
      typescript({
        clean: true,
        include: ['./src/**/*.ts'],
        exclude: [],
        tsconfig: path.resolve(__dirname, './tsconfig.dist.json'),
        rollupCommonJSResolveHack: true,
        useTsconfigDeclarationDir: true,
        typescript: require('../../node_modules/typescript'),
      }),
      // commonjs => es6
      commonjs(),
      format === 'iife' &&
        babel({
          // https://babeljs.io/docs/en/options#rootMode
          rootMode: 'upward', // 向上级查找 babel.config.js
          exclude: ['../../node_modules/@babel/**', '../../node_modules/core-js/**'],
          babelHelpers: 'bundled',
          extensions,
        }),
      json(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
        __VERSION__: packageConfig.version,
      }),
      // minimize files
      isProd && terser(),
      // add banner
      lisence({
        banner: {
          commentStyle: 'regular', // The default
          content: `${packageConfig.name}@${packageConfig.version}`,
        },
      }),
    ].filter(Boolean),
    onwarn(warning, warn) {
      // ignoer 'this' rewrite with 'undefined' warn
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning); // this requires Rollup 0.46
    },
  };
}

function getAllBuilds() {
  return Object.keys(builds).map((key, index) => genConfig(builds[key], index === 0));
}

let buildConfig;
// const dtsConfirg = genDtsConfig();

if (process.env.TARGET) {
  buildConfig = genConfig(builds[process.env.TARGET], true);
} else {
  buildConfig = getAllBuilds();
}

export default buildConfig;
