import { isVue2, markRaw } from 'vue-demi';
import { createResource } from './core';
import { debug } from './env';

// Types
import type { InjectionKey } from 'vue-demi';
import type { ResourceManager } from './types';

export const ResourceManagerSymbol: InjectionKey<ResourceManager> = debug
  ? Symbol.for('__VUE_ASYNC_RESOURCE_MANAGER__')
  : Symbol();

export function createResourceManager(): ResourceManager {
  const manager: ResourceManager = markRaw({
    install(app) {
      if (!isVue2) {
        manager._a = app;

        app.config.globalProperties.$createResource = createResource.bind(manager);
        app.provide(ResourceManagerSymbol, manager);
      }
    },
    // it's actually undefined here
    // @ts-expect-error set in install when using Vue 3
    _a: null,
  });

  return manager;
}
