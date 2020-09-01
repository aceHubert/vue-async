/**
 * Extends interfaces in Vue.js
 */
import Vue, { VueConstructor } from 'vue';

declare global {
  interface Window {
    Vue: VueConstructor;
    [key: string]: any; // 元素隐式具有 "any" 类型，因为索引表达式的类型不为 "number"。
  }

  function isNaN(string: string | number): boolean;

  export type ValueOf<T> = T[keyof T];
  export type Dictionary<T> = Record<string, T>;
}

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue = Vue, Options = Dictionary<any>> {
    $__module_loader_installed__?: true;
    options: Options;
  }
}
