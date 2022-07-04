import Vue from 'vue';
import merge from 'lodash.merge';

// Types
import type { Component } from 'vue';
import type { SchemaTypes } from '@formily/vue';

export declare type RegisterComponents = Omit<
  Record<SchemaTypes, Component | (string & {}) | ((...args: any[]) => any)>,
  'void' | 'object' | 'array'
> & {
  object: RegisterComponents;
  array: RegisterComponents;
};

export type UseOptions = {
  prefixCls?: string;
  i18nRender?: (key: string, fallback: string) => string;
  configEditor?: RegisterComponents;
};

const defaultOptions = (): UseOptions => ({
  prefixCls: undefined,
  i18nRender(key: string, fallback: string): string {
    return fallback;
  },
});

let options: UseOptions;

const getOptions = function () {
  return merge({}, defaultOptions(), options);
};

const getPrefixCls = function (this: any, suffixCls: string, customizePrefixCls?: string): string {
  const options = getOptions();
  const props = Object.getPrototypeOf(this || Vue).$props;
  const prefixCls = props.prefixCls || options.prefixCls || 'lj';

  if (customizePrefixCls) return customizePrefixCls;
  return suffixCls ? prefixCls + '-' + suffixCls : prefixCls;
};

const use = function (opt: UseOptions) {
  options = opt;
};

export { use, getOptions, getPrefixCls };
