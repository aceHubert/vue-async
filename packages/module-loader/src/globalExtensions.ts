// @ts-ignore: works on Vue 2, fails in Vue 3
import { Component } from 'vue';
import { RegistrableModule, DeprecatedModuleLoaderOptions, EventBus } from './types';

// Extensions of Vue types to be appended manually
// https://github.com/microsoft/rushstack/issues/2090
// https://github.com/microsoft/rushstack/issues/1709

// @ts-ignore: works on Vue 2, fails in Vue 3
declare module 'vue/types/vue' {
  interface Vue {
    /**
     * @deprecated does not work from now on!
     */
    $moduleLoadManager: Record<string, any>;
    /**
     * @deprecated does not work from now on!
     */
    $moduleLoader: (
      subModules: RegistrableModule | RegistrableModule[],
      options: DeprecatedModuleLoaderOptions,
    ) => void;
    /**
     * 动态加载远程组件
     */
    $componentLoader: (componentName: string, path: string, styles?: string | string[]) => Promise<Component>;
    /**
     * event bus
     */
    $eventBus: EventBus;
  }
}
