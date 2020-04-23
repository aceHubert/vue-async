import Vue from 'vue';
import ModuleLoader from '@vue-async/module-loader';
import router from '@/router';
import store from '@/store';
import { AppStore } from '@/store/modules';

Vue.use(ModuleLoader, { router, store });

export function createModuleLoader(modules: { [name: string]: string } = {}) {
  const moduleLoader = new ModuleLoader({
    modules: {
      // 'module-js': 'http://localhost:3000/module-js/module-js.umd.js',
      // 'module-ts': 'http://localhost:3000/module-ts/module-ts.umd.js',
      ...modules,
    },
    addMenus(menus: Menu | Array<Menu>) {
      AppStore.AddMenus(menus);
    },
  });

  return moduleLoader;
}
