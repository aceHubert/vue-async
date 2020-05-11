import Suspense from './Suspense';
import lazy from './lazy';
import createReaourse from './createResource';
import install from './install';

export { Suspense, lazy, createReaourse };

export default {
  version: '__VERSION__',
  install,
};

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (window && (window as any).Vue) {
  (window as any).Vue.use(install);
}
