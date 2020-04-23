/**
 * tools
 */

import _Vue from 'vue';

export const hasSymbol = typeof Symbol === 'function' && Symbol.for;

export const noop: any = (_: any) => _;

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

export function proxy(target: any, key: string, { get, set }: { get?: Function; set?: Function }) {
  sharedPropertyDefinition.get = get || noop;
  sharedPropertyDefinition.set = set || noop;
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

export function def(obj: Record<string, any>, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  });
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj: Record<string, any> | any[], key: string): boolean {
  return hasOwnProperty.call(obj, key);
}

export function createUid() {
  return Math.random()
    .toString(36)
    .substring(3, 8);
}

export function assert(condition: any, msg: string) {
  if (!condition) {
    throw new Error(`[@vue-async] ${msg}`);
  }
}

export function warn(condition: boolean, msg: string, vm?: _Vue) {
  if (!condition) {
    // eslint-disable-next-line no-console
    console.warn(`[@vue-async] ${msg}`, vm);
  }
}

export function error(condition: boolean, msg: string, vm?: _Vue) {
  if (!condition) {
    // eslint-disable-next-line no-console
    console.error(`[@vue-async] ${msg}`, vm);
  }
}

export function print(title: string, content: string) {
  // eslint-disable-next-line no-console
  console.log(
    `%c${title}%c${content}`,
    'background: #00d1b2; padding: 5px; color: #fff; border-radius: 5px 0 0 5px',
    'background: #555; padding: 5px; color: #fff; border-radius: 0 5px 5px 0',
  );
}
