declare global {
  interface Window {
    Vue: VueConstructor;
    [key: string]: any; // 元素隐式具有 "any" 类型，因为索引表达式的类型不为 "number"。
  }

  function isNaN(string: string | number): boolean;
}

export {};
