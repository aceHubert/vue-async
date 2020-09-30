/**
 * tools
 */
import { isUndef } from './types';
export const hasSymbol = typeof Symbol === 'function' && Symbol.for;

export const noop: any = (_: any) => _;

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

export function proxy(target: any, key: string, { get, set }: { get?: Function; set?: Function } = {}) {
  sharedPropertyDefinition.get = get || noop;
  sharedPropertyDefinition.set = set || noop;
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

export function def(
  obj: Record<string, any>,
  key: string,
  val: any,
  {
    enumerable = false,
    writable = true,
    configurable = true,
  }: { enumerable?: boolean; writable?: boolean; configurable?: boolean } = {},
) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable,
    writable,
    configurable,
  });
}

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj: Record<string, any> | any[], key: string): boolean {
  return hasOwnProperty.call(obj, key);
}

export function createUid() {
  return Math.random().toString(36).substring(3, 8);
}

export function assert(condition: any, msg: string) {
  if (!condition) {
    throw new Error(`error: ${msg}`);
  }
}

export function warn(condition: boolean, msg: string, vm?: any) {
  if (!condition) {
    if (isUndef(vm)) {
      // eslint-disable-next-line no-console
      console.warn(`warning: ${msg}`);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`warning: ${msg}`, vm);
    }
  }
}

export function error(condition: boolean, msg: string, vm?: any) {
  if (!condition) {
    if (isUndef(vm)) {
      // eslint-disable-next-line no-console
      console.error(`error: ${msg}`);
    } else {
      // eslint-disable-next-line no-console
      console.error(`error: ${msg}`, vm);
    }
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
