import ModuleLoader from './framework';
import hook from './ability/hooks';

const install = ModuleLoader.install;

ModuleLoader.install = (Vue) => {
  install.call(ModuleLoader, Vue);
};

export { hook };
export default ModuleLoader;

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ModuleLoader);
}
