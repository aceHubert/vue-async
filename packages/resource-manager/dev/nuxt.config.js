const path = require('path');

module.exports = () => {
  return {
    ssr: true,
    vue: {
      config: {
        productionTip: false,
      },
    },
    plugins: [{ src: 'plugins/resource-manager' }],
    buildModules: ['@nuxt/typescript-build'],
    build: {
      transpile: ['@vue-async/utils', '@vue-async/resource-manager'],
    },
  };
};
