import 'vue';
import _VueRouter from 'vue-router';
import _Vuex from 'vuex';

declare global {
  class Vue {}
  const VueRouter: typeof _VueRouter;
  const Vuex: typeof _Vuex;
}
