// webpack.config.js
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
// CSS extraction should only be enabled for production
// so that we still get hot-reload during development.
const isProduction = process.env.NODE_ENV === 'production';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class ServerMiniCssExtractPlugin extends MiniCssExtractPlugin {
  getCssChunkObject(mainChunk) {
    return {};
  }
}

module.exports = {
  publicPath: './',
  productionSourceMap: !isProduction,
  lintOnSave: false,
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    loaderOptions: {
      postcss: {
        postcssOptions: {
          path: __dirname,
        },
      },
      less: {
        javascriptEnabled: true,
      },
    },
  },
  configureWebpack: (config) => {
    // config.target = 'node'
    // config.resolve.extensions: nodeExternals({
    //   allowlist: config.resolve.extensions.concat(/\.css$/),
    // }),
    config.output.libraryExport = 'default';
  },
  chainWebpack: (config) => {
    // config.plugins.delete('extract-css');
    // config.plugin('extract-css').use(ServerMiniCssExtractPlugin, [{ filename: 'common.[chunkhash].css' }]);
    // config.resolve.extensions.add(
    //   nodeExternals({
    //     allowlist: /\.css$/,
    //   }),
    // );
    // config.plugin('extract-text').use(ExtractTextPlugin, [{ filename: 'common.[chunkhash].css' }]);
    // config.module
    //   .rule('vue')
    //   .use('vue-loader')
    //   .loader('vue-loader')
    //   .tap((options) => {
    //     // modify the options...
    //     options.extractCSS = isProduction;
    //     return options;
    //   });
    // const vueCssRule = config.module.rule('css').oneOfs.store.get('vue');
    // vueCssRule.use('css-loader').delete();
    // vueCssRule.use('css-loader/locals');
  },
};
