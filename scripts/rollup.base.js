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
    '@formily/reactive-vue': 'Formily.ReactiveVue',
    '@formily/reactive': 'Formily.Reactive',
    '@formily/path': 'Formily.Path',
    '@formily/shared': 'Formily.Shared',
    '@formily/validator': 'Formily.Validator',
    '@formily/core': 'Formily.Core',
    '@formily/json-schema': 'Formily.JSONSchema',
    '@formily/vue': 'Formily.Vue',
    '@monaco-editor/loader': 'monaco_loader',
    '@vue-async/components': 'VueAsync.Components',
    '@vue-async/module-loader': 'VueAsync.ModuleLoader',
    '@vue-async/resource-manager': 'VueAsync.ResourceManager',
    // '@vue-async/utils': 'VueAsync.Utils', // 打包到dist, 并 tree shakeing
  };
  return [
    resolve({
      browser: true,
      // Set the root directory to be the parent folder
      rootDir: path.join(__dirname, '..'),
      extensions,
      // modulesOnly: true,
    }),
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

/**
 * base rollup config
 * 如果 plugins 最后一个是函数，返回的plugins 将添加到presets
 */
export default (filename, targetName, ...plugins) => {
  function onwarn(warning, warn) {
    // ignoer 'this' rewrite with 'undefined' warn
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning); // this requires Rollup 0.46
  }

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
      onwarn,
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
      onwarn,
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
      external: ['vue'],
      plugins: [
        dts({
          respectExternal: true,
          compilerOptions: {
            exclude: ['**/vue/**'],
          },
        }),
        ...plugins,
      ],
    });
  }

  return base;
};
