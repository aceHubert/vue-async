import { isVue2, markRaw } from 'vue-demi';
import { Suspense } from './core/Suspense';
import { createResource } from './core/createResource';
import { ResourceManager } from './types';

export const resManagerSymbol = Symbol();

export function createResManager(): ResourceManager {
  const resManager: ResourceManager = markRaw({
    install(app) {
      if (!isVue2) {
        app.component('Suspense', Suspense);

        app.provide(resManagerSymbol, resManager);
        app.config.globalProperties.$aresource = resManager;
      }
    },
    createResource: createResource.bind(null),
  });

  return resManager;
}
