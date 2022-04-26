import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
// import typescript from 'rollup-plugin-typescript2';
import externalGlobals from 'rollup-plugin-external-globals';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import { DEFAULT_EXTENSIONS } from '@babel/core';

const extensions = [...DEFAULT_EXTENSIONS, '.ts', '.tsx'];

const presets = () => {
  const externals = {
    vue: 'Vue',
    '@vue/composition-api': 'VueCompositionAPI',
    '@formily/vue': 'Formily.Vue',
    '@vue-async/module-loader': 'VueAsync.ModuleLoader',
    '@vue-async/resource-manager': 'VueAsync.ResourceManager',
    // '@vue-async/utils': 'VueAsync.Utils', // 打包到dist, 并 tree shakeing
  };
  return [
    // 使用 @babel/preset-typescript 编译 ts
    // typescript({
    //   tsconfig: './tsconfig.build.json',
    //   tsconfigOverride: {
    //     compilerOptions: {
    //       module: 'ESNext',
    //       declaration: false,
    //     },
    //   },
    // }),
    resolve({
      browser: true,
      // Set the root directory to be the parent folder
      rootDir: path.join(__dirname, '..'),
      extensions,
      // modulesOnly: true,
    }),
    commonjs(),
    babel({
      // https://babeljs.io/docs/en/options#rootMode
      rootMode: 'upward', // 向上级查找 babel.config.js
      exclude: [/\/@babel\//, /\/core-js\//],
      babelHelpers: 'bundled',
      extensions,
    }),
    externalGlobals(externals, {
      exclude: ['**/*.{less,sass,scss}'],
    }),
  ];
};

const createEnvPlugin = (env) => {
  return injectProcessEnv(
    {
      NODE_ENV: env,
    },
    {
      exclude: '**/*.{css,less,sass,scss}',
      verbose: false,
    },
  );
};

const inputFilePath = path.join(process.cwd(), 'src/index.ts');

const noUIDtsPackages = ['utils'];

export const removeImportStyleFromInputFilePlugin = () => ({
  name: 'remove-import-style-from-input-file',
  transform(code, id) {
    // 样式由 build:style 进行打包，所以要删除入口文件上的 `import './style'`
    if (inputFilePath === id) {
      return code.replace(`import './style';`, '');
    }

    return code;
  },
});

export default (filename, targetName, ...plugins) => {
  const base = [
    {
      input: 'src/index.ts',
      output: {
        format: 'umd',
        file: `dist/${filename}.umd.development.js`,
        name: targetName,
        sourcemap: true,
        exports: 'named',
        amd: {
          id: filename,
        },
      },
      external: ['vue'],
      plugins: [...presets(), ...plugins, createEnvPlugin('development')],
    },
    {
      input: 'src/index.ts',
      output: {
        format: 'umd',
        file: `dist/${filename}.umd.production.js`,
        name: targetName,
        sourcemap: true,
        exports: 'named',
        amd: {
          id: filename,
        },
      },
      external: ['vue'],
      plugins: [...presets(), terser(), ...plugins, createEnvPlugin('production')],
    },
  ];

  if (noUIDtsPackages.includes(filename)) {
    base.push({
      input: 'esm/index.d.ts',
      output: {
        format: 'es',
        file: `dist/${filename}.d.ts`,
      },
      plugins: [dts(), ...plugins],
    });
    base.push({
      input: 'esm/index.d.ts',
      output: {
        format: 'es',
        file: `dist/${filename}.all.d.ts`,
      },
      plugins: [
        dts({
          respectExternal: true,
        }),
        ...plugins,
      ],
    });
  }

  return base;
};
