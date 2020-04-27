import { DynamicComponent } from './ability/dynamicComponent/storeModule';
import { Modules } from './ability/moduleLoader';
import ModuleLoader from './framework';

const install = ModuleLoader.install;

ModuleLoader.install = (Vue, options = {}) => {
  install.call(ModuleLoader, Vue, options);
};

export { Modules, DynamicComponent };
export default ModuleLoader;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ModuleLoader);
}
