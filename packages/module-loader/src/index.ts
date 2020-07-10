import ModuleLoader from './framework';

const install = ModuleLoader.install;

ModuleLoader.install = (Vue) => {
  install.call(ModuleLoader, Vue);
};

export default ModuleLoader;

// Auto install if it is not done yet and `window` has `Vue`.
// To allow users to avoid auto-installation in some cases,
if (window && window.Vue) {
  window.Vue.use(ModuleLoader);
}
