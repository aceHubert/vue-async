import _Vue from 'vue';
import { Store } from 'vuex';
import _VueRouter, { Route, RawLocation } from 'vue-router';
import dynamicComponent from './ability/dynamicComponent/index';
import dynamicComponentState from './ability/dynamicComponent/storeModule';
import eventBus from './ability/eventBus';
import moduleLoader from './ability/moduleLoader';

export type Options = {
  store?: Store<any>;
  router?: _VueRouter;
};

export default function install(Vue: typeof _Vue, options: Options = {}) {
  if ((install as any).installed) return;
  (install as any).installed = true;

  // 用于监听模块加载的情况，处理路由404问题
  const vm = new Vue({
    data() {
      return {
        status: {
          current: true,
        },
      };
    },
  });

  Object.defineProperties(Vue.prototype, {
    $eventBus: {
      value: eventBus(),
      writable: false,
    },
    $moduleLoader: {
      value: moduleLoader(Vue, vm.status),
      writable: false,
    },
  });

  const { store, router } = options;

  // store
  if (store) {
    store.registerModule('dynamicComponent', dynamicComponentState);
    // define $dynamicComponent
    Object.defineProperty(Vue.prototype, '$dynamicComponent', {
      value: dynamicComponent(store),
      writable: false,
    });
  }

  // router
  // 解决动态路由404问题
  if (router) {
    const resolveRoute = (
      to: Route,
      next: (to?: RawLocation | false | ((vm: _Vue) => any) | void) => void,
    ) => {
      const fullPath = to.redirectedFrom || to.fullPath;
      const { location } = router.resolve(fullPath);
      // 在加载完组件后resolve的地址与原来要跳转的地址不一致时跳转
      // 以免造成404死循环
      if (location.name !== to.name) {
        next(location);
      } else {
        next();
      }
    };

    router.beforeEach((to, from, next) => {
      if (!to.name || to.name === '404') {
        // 前 ModuleLoader 被 use 前添加的 beforeEach阻止时间过长，vm.$watch还没开始监听
        // 模块已经被加载完成时
        if (vm.status.current) {
          resolveRoute(to, next);
        } else {
          vm.$watch(
            () => vm.status.current,
            (newVal, oldVal) => {
              console.log(newVal, oldVal);
              // false => true
              if (newVal && !oldVal) {
                resolveRoute(to, next);
              }
            },
          );
        }
      } else {
        next();
      }
    });
  }

  // Used to avoid multiple mixins being setup
  // when in dev mode and hot module reload
  // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
  if (Vue.$_module_loader_installed) return;
  Vue.$_module_loader_installed = true;

  Vue.mixin({
    beforeCreate() {
      const options = this.$options as any;

      if (options.moduleLoader) {
        options.moduleLoader.init(this, options.ssrContext);
        this.$moduleLoaderManager = Vue.observable(options.moduleLoader.framework);
        // 初始化实例中的 modules
        // 放在最后执行，module 入口可以使用 this.$moduleLoaderManager中的功能
        options.moduleLoader.initModules(this);
      } else {
        this.$moduleLoaderManager = (options.parent && options.parent.$moduleLoaderManager) || this;
      }
    },
  });
}
