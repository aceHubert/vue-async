export const namespace = 'moduleJS';

export default {
  namespaced: true,
  state: {
    index: 1,
  },
  mutations: {
    add(state, number) {
      state.index += number;
    },
  },
};
