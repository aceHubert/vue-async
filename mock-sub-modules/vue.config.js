const isProduction = process.env.NODE_ENV === 'production';

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
};
