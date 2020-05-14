import ModuleLoader from './framework';

const install = ModuleLoader.install;

ModuleLoader.install = (Vue, options = {}) => {
  install.call(ModuleLoader, Vue, options);
};

export default ModuleLoader;

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (window && (window as any).Vue) {
  (window as any).Vue.use(ModuleLoader);
}
