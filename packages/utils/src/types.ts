/**
 * types
 */

export function isUndef(v: any): boolean {
  return v === undefined || v === null;
}

export function isArray<T>(x: unknown): x is T[] {
  return Array.isArray(x);
}

export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object';
}

const toString = (x: any) => Object.prototype.toString.call(x);
export function isPlainObject(x: unknown): x is Record<any, any> {
  return toString(x) === '[object Object]';
}

export function isFunction(x: unknown): x is Function {
  return typeof x === 'function';
}
