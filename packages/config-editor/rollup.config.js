import * as path from 'path';
// import filesize from 'rollup-plugin-filesize'
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';
import lisence from 'rollup-plugin-license';
import { DEFAULT_EXTENSIONS } from '@babel/core';

const isProd = process.env.BUILD === 'production';
const packageConfig = require('./package.json');
const extensions = [...DEFAULT_EXTENSIONS, '.ts', '.tsx', '.vue'];

export const builds = {
  'cjs-dev': {
    outFile: 'config-editor.common.js',
    format: 'cjs',
    mode: 'development',
  },
  // 'cjs-prod': {
  //   outFile: 'config-editor.common.min.js',
  //   format: 'cjs',
  //   mode: 'production',
  // },
  'umd-dev': {
    outFile: 'config-editor.umd.js',
    format: 'umd',
    mode: 'development',
  },
  'umd-prod': {
    outFile: 'config-editor.umd.min.js',
    format: 'umd',
    mode: 'production',
  },
  'iife-dev': {
    outFile: 'config-editor.js',
    format: 'iife',
    mode: 'development',
  },
  'iife-prod': {
    outFile: 'config-editor.min.js',
    format: 'iife',
    mode: 'production',
  },
  es: {
    outFile: 'config-editor.esm.js',
    format: 'es',
    mode: 'development',
  },
};

// polyfill in iife mode
export function genConfig({ outFile, format, mode }, clean = false) {
  return {
    input: './src/index.ts',
    output: {
      file: path.join('./dist', outFile),
      format,
      globals: {
        vue: 'Vue',
        '@vue-async/utils': 'VueAsyncUtils',
      },
      exports: 'named',
      name: format === 'umd' || format === 'iife' ? 'VueAsyncConfigEditor' : undefined,
    },
    external: ['vue', !(format === 'iife' || format === 'umd') && '@vue-async/utils'].filter(Boolean),
    plugins: [
      clean &&
        clear({
          // 删除目录/文件
          targets: ['./dist'],
          watch: true,
        }),
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
        typescript: require('typescript'),
      }),
      postcss({
        extract: `styles/config-editor${mode === 'production' ? '.min' : ''}.css`,
        minimize: mode === 'production',
        plugins: [require('autoprefixer')],
        use: [
          [
            'less',
            {
              javascriptEnabled: true,
              modifyVars: {
                hack: 'true;@import "view-design/src/styles/custom.less";',
              },
            },
          ],
        ],
      }),
      vue({ css: false }),
      // commonjs => es6
      commonjs(),
      babel({
        presets: [
          [
            '@vue/babel-preset-app',
            {
              useBuiltIns: 'usage',
              corejs: {
                version: 3,
              },
              // caller.target will be the same as the target option from webpack
              targets: { node: 'current', chrome: '58', ie: '9' },
            },
          ],
        ],
        plugins: [
          [
            'import',
            {
              libraryName: 'view-design',
              libraryDirectory: 'src/components',
            },
            'view-design',
          ],
        ],
        // https://babeljs.io/docs/en/options#rootMode
        rootMode: 'upward', // 向上级查找 babel.config.js
        exclude: [/\/@babel\//, /\/core-js\//],
        babelHelpers: 'runtime',
        extensions,
      }),
      json(),
      replace({
        ...(format === 'iife' || format === 'umd'
          ? {
              'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
            }
          : null),
        __VERSION__: packageConfig.version,
      }),
      // minimize files
      mode === 'production' && terser(),
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
  buildConfig = genConfig(builds[process.env.TARGET], process.env.CLEAN !== 'false');
} else {
  buildConfig = getAllBuilds();
}

export default buildConfig;
