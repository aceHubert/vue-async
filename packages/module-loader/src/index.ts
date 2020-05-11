import { DynamicComponent } from './ability/dynamicComponent/storeModule';
import { Modules } from './ability/moduleLoader';
import ModuleLoader from './framework';

const install = ModuleLoader.install;

ModuleLoader.install = (Vue, options = {}) => {
  install.call(ModuleLoader, Vue, options);
};

export { Modules, DynamicComponent };
export default ModuleLoader;

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (window && (window as any).Vue) {
  window.Vue.use(ModuleLoader);
}
