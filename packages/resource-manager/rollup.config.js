import lisence from 'rollup-plugin-license';
import baseConfig from '../../scripts/rollup.base';

const packageConfig = require('./package.json');

export default baseConfig(
  'resource-manager',
  'VueAsync.ResourceManager',
  //  add banner
  lisence({
    banner: {
      commentStyle: 'regular', // The default
      content: `${packageConfig.name}@${packageConfig.version}`,
    },
  }),
);
