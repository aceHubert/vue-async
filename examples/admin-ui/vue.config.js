const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const sourceMap = !isProduction;

module.exports = {
  // 基本路径
  publicPath: '/',
  // 输出文件目录
  outputDir: 'dist',
  // 静态文件目录
  assetsDir: 'static',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: ['vuetify', 'vuex-module-decorators'],
  // 这是一个不进行任何 schema 验证的对象，因此它可以用来传递任何第三方插件选项。
  pluginOptions: {
    // 公共样式资源变量注入
    // 'style-resources-loader': {
    //   preProcessor: 'less',
    //   patterns: [
    //     path.resolve(__dirname, 'src/assets/style/variable/color.less')
    //   ]
    // }
  },
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: (config) => {
    //https://cli.vuejs.org/guide/troubleshooting.html#symbolic-links-in-node-modules
    config.resolve.symlinks(false);

    // https://webpack.js.org/configuration/devtool/#development
    config.when(process.env.NODE_ENV === 'development', (config) => config.devtool('cheap-source-map'));

    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          vuetify: {
            name: 'chunk-vuetify', // split vuetify into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?vuetify(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: path.resolve(__dirname, 'src/components'),
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      config.optimization.runtimeChunk('single');
    });
  },
  configureWebpack: (config) => {
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        alias: {
          vue$: 'vue/dist/vue.runtime.esm.js',
          '@': path.resolve(__dirname, './src'),
        },
      },
    });
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: sourceMap,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      scss: {
        fiber: require('fibers'),
        data: '@import "~vuetify/src/styles/styles.sass";',
      },
      css: {
        // 模块定义设置
        modules: {
          localIdentName: isProduction ? '[hash:base64]' : '[path]_[name]_[local]_[hash:base64:5]',
        },
        localsConvention: 'camelCaseOnly',
      },
    },
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: true,
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === 'darwin',
    host: 'localhost',
    port: 3001, //8080,
    https: false,
    hotOnly: false,
    proxy: {
      // 设置代理
      // proxy all requests starting with /api to jsonplaceholder
      '/api': {
        // target: "https://emm.cmccbigdata.com:8443/",
        target: 'http://localhost:3002/',
        // target: "http://47.106.136.114/",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
    // before: app => { }
  },
};
