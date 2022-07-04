import * as components from './components';
import { install as innerInstall } from './install';
import { version } from './version';

// Types
import type { PluginFunction } from 'vue';
import type { UseOptions } from './options';

export * from './components';

export const install: PluginFunction<UseOptions> = (Vue, options = {}) => {
  innerInstall.call(null, Vue, {
    ...options,
    components,
  });
};

export { version };

export default {
  version,
  install,
};

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
