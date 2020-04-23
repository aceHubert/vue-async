import Vue from 'vue';

export let currentInstance: Vue | null = null;

/**
 * set current instance
 * @param instance Vue instance
 */
export function setCurrentInstance(instance: Vue) {
  currentInstance = instance;
}

export const suspenseInstanceStack: Vue[] = [];
export let currentSuspenseInstance: Vue;
/**
 * push suspense instance
 * @param instance Vue instance
 */
export function pushSuspenseInstance(instance: Vue) {
  currentSuspenseInstance = instance;
  suspenseInstanceStack.push(instance);
}

/**
 * pop suspense instance
 */
export function popSuspenseInstance(): Vue | null {
  suspenseInstanceStack.pop();
  return (currentSuspenseInstance = suspenseInstanceStack[suspenseInstanceStack.length - 1]);
}
