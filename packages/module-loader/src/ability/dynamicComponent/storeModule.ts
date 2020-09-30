import { getComponentName, error } from '@vue-async/utils';
import { DynamicComponent } from '../../../types';

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
        return error(
          process.env.NODE_ENV === 'production',
          '[moduleLoader] component must be named for dynamic component.',
        );
      }
      if (!state[position]) {
        state[position] = {};
      }
      if (state[position][componentName]) {
        return error(
          process.env.NODE_ENV === 'production',
          `[moduleLoader] async component "${componentName}" has existed in the ${position}, ignored it.`,
        );
      }
      state[position][componentName] = component;
    },
    // 移除注册插槽组件
    remove(state: State, { name, position = 'GLOBAL' }: { name: string; position: string }) {
      if (!state[position]) {
        return error(process.env.NODE_ENV === 'production', `[moduleLoader] position "${position}" does not  exist.`);
      }
      if (!state[position][name]) {
        return error(
          process.env.NODE_ENV === 'production',
          `[moduleLoader] async component "${name}" does not  exist in the ${position}.`,
        );
      }
      delete state[position][name];
    },
  },
};
