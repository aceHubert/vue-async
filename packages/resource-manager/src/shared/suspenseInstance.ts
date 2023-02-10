import { ComponentPublicInstance, Ref } from 'vue-demi';
import { COMPONENT_NAME } from './context';

import { AsyncFactory, SuspenseComponent } from '../types';

export const suspenseInstanceStack: ComponentPublicInstance[] = [];
export let currentSuspenseInstance: ComponentPublicInstance;
/**
 * push suspense instance
 * @param instance Vue instance
 */
export function pushSuspenseInstance(instance: ComponentPublicInstance) {
  currentSuspenseInstance = instance;
  suspenseInstanceStack.push(instance);
}

/**
 * pop suspense instance
 */
export function popSuspenseInstance(): ComponentPublicInstance {
  suspenseInstanceStack.pop();
  return (currentSuspenseInstance = suspenseInstanceStack[suspenseInstanceStack.length - 1]);
}

/**
 *  find suspense instance
 */
export function findSuspenseInstance(ins: ComponentPublicInstance) {
  let current = ins.$parent;
  while (current) {
    if (current.$options.name === COMPONENT_NAME) {
      return current;
    } else {
      current = current.$parent;
    }
  }
  return;
}

/**
 * @internal
 */
declare module 'vue-demi' {
  export class ComponentCustomProperties {
    resolved: Ref<boolean>;
    rejected: Ref<boolean>;
    displayLoading: Ref<boolean>;
    promiser: Promise<any>;
    setupLoading(): void;
    asyncFactorys: Set<AsyncFactory<any, SuspenseComponent>>;
    // readonly delay: number;
  }
}
