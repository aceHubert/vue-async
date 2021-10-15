const path = require('path');

module.exports = () => {
  return {
    ssr: false,
    plugins: [{ src: 'plugins/module-loader' }],
    buildModules: ['@nuxt/typescript-build'],
    build: {
      transpile: ['@vue-async/utils', '@vue-async/module-loader'],
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
