import * as path from 'path';
// import filesize from 'rollup-plugin-filesize'
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';

const packageVersion = require('./package.json').version;
const extensions = ['.js', '.ts'];

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
  es: {
    outFile: 'index.esm.js',
    format: 'es',
    mode: 'development',
  },
};

function genConfig({ outFile, format, mode }, clean = false) {
  const isProd = mode === 'production';
  return {
    input: './src/index.ts',
    output: {
      file: path.join('./dist', outFile),
      format,
      globals: {
        vue: 'Vue',
      },
      exports: 'named',
      name: format === 'umd' ? 'async-manager' : undefined,
    },
    external: ['vue'],
    plugins: [
      clean &&
        clear({
          targets: ['./dist'],
          watch: true,
        }),
      babel(),
      typescript({
        clean: true,
        include: ['./src/**/*.ts'],
        exclude: ['./src/version.ts'],
        tsconfig: path.resolve(__dirname, './tsconfig.json'),
        rollupCommonJSResolveHack: true,
        useTsconfigDeclarationDir: true,
        typescript: require('../../node_modules/typescript'),
      }),
      resolve({
        extensions,
        modulesOnly: true,
      }),
      json(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
        __VERSION__: packageVersion,
      }),
      isProd && terser(),
    ].filter(Boolean),
  };
}

function getAllBuilds() {
  return Object.keys(builds).map((key, index) => genConfig(builds[key], index === 0));
}

let buildConfig;

if (process.env.TARGET) {
  buildConfig = genConfig(builds[process.env.TARGET], true);
} else {
  buildConfig = getAllBuilds();
}

export default buildConfig;
