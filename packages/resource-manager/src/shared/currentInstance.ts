import { Vue2 } from 'vue-demi';

type TypedVue = typeof Vue2;

export let currentInstance: TypedVue;

/**
 * set current instance
 * @param instance Vue instance
 */
export function setCurrentInstance(instance: TypedVue) {
  currentInstance = instance;
}

export const suspenseInstanceStack: TypedVue[] = [];
export let currentSuspenseInstance: TypedVue;
/**
 * push suspense instance
 * @param instance Vue instance
 */
export function pushSuspenseInstance(instance: TypedVue) {
  currentSuspenseInstance = instance;
  suspenseInstanceStack.push(instance);
}

/**
 * pop suspense instance
 */
export function popSuspenseInstance(): TypedVue {
  suspenseInstanceStack.pop();
  return (currentSuspenseInstance = suspenseInstanceStack[suspenseInstanceStack.length - 1]);
}
