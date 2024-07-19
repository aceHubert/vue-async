import { ComponentPublicInstance } from 'vue-demi';
import { COMPONENT_NAME } from './context';

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
