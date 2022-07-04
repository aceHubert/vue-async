import type { PluginFunction } from 'vue';

declare global {
  type Dictionary<T> = Record<string, T>;
  type ValueOf<T> = T[keyof T];
}

declare module 'vue/types/vue' {
  interface VueConstructor {
    $__vue_async_complex_installed__?: true;
    install: PluginFunction<any>;
  }
}

// 注意: 修改"全局声明"必须在模块内部, 所以至少要有 export{}字样
// 不然会报错❌: 全局范围的扩大仅可直接嵌套在外部模块中或环境模块声明中
export {};
