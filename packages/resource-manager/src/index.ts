import Suspense from './ability/Suspense';
import lazy from './ability/lazy';
import createResource from './ability/createResource';
import install from './install';

class ResourceManager {
  static version = '__VERSION__';
  static install = install;
}

export { Suspense, lazy, createResource };
export default ResourceManager;

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ResourceManager);
}
