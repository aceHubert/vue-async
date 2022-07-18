/**
 * types
 */

export function isUndef(v: any): boolean {
  return v === void 0;
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

// Inlined Object.is polyfill.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
export function objectIs(x: any, y: any): boolean {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  }
  // eslint-disable-next-line
  return x !== x && y !== y;
}

// https://developer.mozilla.org/en-US/docs/Glossary/Primitive
export function isPrimitive(value: any): boolean {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint' ||
    typeof value === 'undefined' ||
    value === null
  );
}

export function equals(x: any, y: any): boolean {
  const f1 = x instanceof Object;
  const f2 = y instanceof Object;
  if (!f1 || !f2) {
    return x === y;
  }
  if (Object.keys(x).length !== Object.keys(y).length) {
    return false;
  }
  const newX = Object.keys(x);
  for (let p in newX) {
    p = newX[p];
    const a = x[p] instanceof Object;
    const b = y[p] instanceof Object;
    if (a && b) {
      return equals(x[p], y[p]);
    } else if (x[p] !== y[p]) {
      return false;
    }
  }
  return true;
}
