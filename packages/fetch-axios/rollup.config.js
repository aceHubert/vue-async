import lisence from 'rollup-plugin-license';
import baseConfig from '../../scripts/rollup.base';

const packageConfig = require('./package.json');

export default baseConfig(
  'fetch-axios',
  'VueAsync.FetchAxios',
  //  add banner
  lisence({
    banner: {
      commentStyle: 'regular', // The default
      content: `${packageConfig.name}@${packageConfig.version}`,
    },
  }),
);
