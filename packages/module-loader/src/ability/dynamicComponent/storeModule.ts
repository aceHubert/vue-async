import { Component as VueComponent, AsyncComponent } from 'vue';
import { getComponentName, error } from '@vue-async/utils';

const isProduction = process.env.NODE_ENF === 'production';

export type DynamicComponent =
  | VueComponent
  | AsyncComponent
  | {
      component: VueComponent | AsyncComponent;
      cols?: number;
      [key: string]: any;
    };

export type State = {
  GLOBAL: { [componentName: string]: DynamicComponent };
  [position: string]: { [componentName: string]: DynamicComponent };
};

export default {
  namespaced: true,
  state: {
    GLOBAL: {},
  },
  mutations: {
    // 注册插槽组件
    add(state: State, { component, position = 'GLOBAL' }: { component: DynamicComponent; position: string }) {
      const _component = (component as any).component || component;
      // 必须使用外部 Vue 对象，本地 import 对象不一致
      const componentName = component.name || getComponentName(_component);
      if (!componentName) {
        return error(isProduction, 'component must be named for dynamic component.');
      }
      if (!state[position]) {
        state[position] = {};
      }
      if (state[position][componentName]) {
        return error(isProduction, `async component "${componentName}" has existed in the ${position}, ignored it.`);
      }
      state[position][componentName] = component;
    },
    // 移除注册插槽组件
    remove(state: State, { name, position = 'GLOBAL' }: { name: string; position: string }) {
      if (!state[position]) {
        return error(isProduction, `position "${position}" does not  exist.`);
      }
      if (!state[position][name]) {
        return error(isProduction, `async component "${name}" does not  exist in the ${position}.`);
      }
      delete state[position][name];
    },
  },
};
