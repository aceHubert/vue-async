import { Component as VueComponent } from 'vue';
import { isProduction, error } from '../../tool';

export type State = {
  GLOBAL: { [componentName: string]: VueComponent };
  [position: string]: { [componentName: string]: VueComponent };
};

export default {
  namespaced: true,
  state: {
    GLOBAL: {},
  },
  mutations: {
    // 注册插槽组件
    create(
      state: State,
      { component, position = 'GLOBAL' }: { component: VueComponent; position: string },
    ) {
      if (!component.name) {
        return error(!isProduction, 'component must be named for asnyc component.');
      }
      if (!state[position]) {
        state[position] = {};
      }
      const componentName = component.name;
      if (state[position][componentName]) {
        return error(
          !isProduction,
          `async component "${componentName}" has existed in the ${position}, ignored it.`,
        );
      }
      state[position][componentName] = component;
    },
    destroy(state: State, { name, position = 'GLOBAL' }: { name: string; position: string }) {
      if (!state[position]) {
        return error(!isProduction, `position "${position}" does not  exist.`);
      }
      if (!state[position][name]) {
        return error(
          !isProduction,
          `async component "${name}" does not  exist in the ${position}.`,
        );
      }
      delete state[position][name];
    },
  },
};
