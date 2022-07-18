import Suspense from './ability/Suspense';
import lazy from './ability/lazy';
import createResource from './ability/createResource';
import install from './install';
import { version } from './version';

export { version, install, Suspense, lazy, createResource };
export default {
  version,
  install,
};

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
