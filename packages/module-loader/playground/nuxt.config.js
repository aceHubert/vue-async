const path = require('path');

module.exports = () => {
  return {
    ssr: false,
    head: {
      scripts: [{ src: 'https://cdn.jsdelivr.net/npm/js-loading-overlay@1.2.0/dist/js-loading-overlay.min.js' }],
    },
    plugins: [{ src: 'plugins/module-loader' }],
    buildModules: ['@nuxt/typescript-build', '@nuxtjs/composition-api/module'],
    build: {
      transpile: ['@vue-async/*'],
      extend(config, { isDev, isClient, isServer }) {
        if (isClient) {
          config.node = {
            module: 'empty',
          };
        }
      },
    },
  };
};
