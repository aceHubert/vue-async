import * as path from 'path';
// import filesize from 'rollup-plugin-filesize'
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
// import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';

const packageVersion = require('./package.json').version;

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
      name: format === 'umd' ? 'module-loader' : undefined,
    },
    external: ['vue'],
    plugins: [
      clean &&
        clear({
          // 删除目录/文件
          targets: ['./dist'],
          watch: true,
        }),
      // babel(),
      typescript({
        // typescript 配置
        clean: true,
        include: ['./src/**/*.ts'],
        exclude: [],
        tsconfig: path.resolve(__dirname, './tsconfig.dist.json'),
        rollupCommonJSResolveHack: true,
        useTsconfigDeclarationDir: true,
        typescript: require('../../node_modules/typescript'),
      }),
      resolve(),
      json(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
        __VERSION__: packageVersion,
      }),
      isProd && terser(), // mini 文件
    ].filter(Boolean),
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
