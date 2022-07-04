const path = require('path');
const MonocaEditorWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = () => {
  return {
    ssr: false,
    vue: {
      config: {
        productionTip: false,
      },
    },
    buildModules: ['@nuxt/typescript-build'],
    build: {
      transpile: ['@vue-async/utils', '@vue-async/components'],
      babel: {
        presets: [
          [
            '@nuxt/babel-preset-app',
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
      },
      plugins: [
        new MonocaEditorWebpackPlugin({
          languages: ['json'],
        }),
      ],
    },
  };
};
