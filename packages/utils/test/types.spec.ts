import { isUndef, isArray, isObject, isPlainObject, isFunction, isPrimitive, objectIs, equals } from '../src/types';

test('isUndef', () => {
  expect(isUndef(undefined)).toEqual(true);
  expect(isUndef(void 0)).toEqual(true);
  expect(isUndef(null)).toEqual(false);
  expect(isUndef('')).toEqual(false);
  expect(isUndef('test')).toEqual(false);
});

test('isArray', () => {
  expect(isArray([])).toEqual(true);
  expect(isArray({})).toEqual(false);
  expect(isArray(Symbol('test'))).toEqual(false);
});

test('isObject', () => {
  expect(isObject({})).toEqual(true);
  expect(isObject([])).toEqual(true);
  expect(isObject('test')).toEqual(false);
});

test('isPlainObject', () => {
  expect(isPlainObject({})).toEqual(true);
  expect(isPlainObject([])).toEqual(false);
  expect(isPlainObject('test')).toEqual(false);
});

test('isFunction', () => {
  expect(isFunction(() => {})).toEqual(true);
  expect(isFunction(function () {})).toEqual(true);
  expect(isFunction([])).toEqual(false);
});

test('isPrimitive', () => {
  expect(isPrimitive(null)).toEqual(true);
  expect(isPrimitive(undefined)).toEqual(true);
  expect(isPrimitive('')).toEqual(true);
  expect(isPrimitive('test')).toEqual(true);
  expect(isPrimitive(123)).toEqual(true);
  expect(isPrimitive(1234567890123)).toEqual(true);
  expect(isPrimitive(false)).toEqual(true);
  expect(isPrimitive(Symbol('test'))).toEqual(true);
  expect(isPrimitive({})).toEqual(false);
  expect(isPrimitive([])).toEqual(false);
});

test('objectIs', () => {
  // both undefined
  expect(objectIs(undefined, void 0)).toEqual(true);
  // both null
  expect(objectIs(null, null)).toEqual(true);
  // both true or both false
  expect(objectIs(true, true)).toEqual(true);
  expect(objectIs(true, false)).toEqual(false);
  // both strings of the same length with the same characters in the same order
  expect(objectIs('123', '123')).toEqual(true);
  expect(objectIs('123', '321')).toEqual(false);
  // both the same object (meaning both values reference the same object in memory)
  let a: Record<string, any> = { n: 1 };
  const b = a;
  expect(objectIs(a, b)).toEqual(true);
  a.x = a = { n: 2 };
  expect(objectIs(a, b)).toEqual(false);
  expect(objectIs(a.x, void 0)).toEqual(true);
  expect(objectIs(b.n, 1)).toEqual(true);
  expect(objectIs(b.x.n, 2)).toEqual(true);

  expect(objectIs({ a: 1 }, { a: 1 })).toEqual(false);
  expect(objectIs([1], [1])).toEqual(false);
  // both numbers and
  // both +0
  // both -0
  // both NaN
  // or both non-zero and both not NaN and both have the same value
  expect(objectIs(+0, +0)).toEqual(true);
  expect(objectIs(+0, -0)).toEqual(false);
  expect(objectIs(NaN, NaN)).toEqual(true);
  expect(objectIs(1, 1)).toEqual(true);
});

test('equals', () => {
  expect(equals(1, 1)).toEqual(true);
  expect(equals(123, '123')).toEqual(false);
  expect(equals(123, [])).toEqual(false);
  expect(equals({}, {})).toEqual(true);
  expect(equals({ a: 1, b: 2 }, { b: 2, a: 1 })).toEqual(true);
  expect(equals({ a: 1, b: 2 }, { a: 2, b: 1 })).toEqual(false);
  expect(equals({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).toEqual(false);
  expect(equals([], [])).toEqual(true);
  expect(equals(['1', '2'], ['2', '1'])).toEqual(false);
  expect(equals(['1', '2'], ['1', '2', '3'])).toEqual(false);
  expect(equals({ a: ['1', '2'] }, { a: ['1', '2'] })).toEqual(true);
  expect(equals({ a: ['1', '2'] }, { a: ['1', '2', '3'] })).toEqual(false);
});
