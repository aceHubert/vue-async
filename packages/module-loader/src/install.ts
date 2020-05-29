import _Vue from 'vue';
import { Route, RawLocation } from 'vue-router';
import dynamicComponent from './ability/dynamicComponent';
import dynamicComponentState from './ability/dynamicComponent/storeModule';
import createEventBus from './ability/eventBus';
import createModuleLoader from './ability/moduleLoader';
import createComponentLoader from './ability/componentLoader';
import { UseOptions } from '../types';

export default function install(Vue: typeof _Vue, options: UseOptions = {}) {
  if ((install as any).installed) return;
  (install as any).installed = true;

  // 用于监听模块加载的情况，处理路由404问题
  const vm = new Vue({
    data() {
      return {
        status: {
          current: false, // 默认必须为 true
        },
      };
    },
  });

  Object.defineProperties(Vue.prototype, {
    $eventBus: {
      value: createEventBus(Vue),
      writable: false,
    },
    $moduleLoader: {
      value: createModuleLoader(Vue, vm.status),
      writable: false,
    },
    $componentLoader: {
      value: createComponentLoader(),
      writable: false,
    },
  });

  const { store, router } = options;

  // store
  if (store) {
    store.registerModule('dynamicComponent', dynamicComponentState);
    // define $dynamicComponent
    Object.defineProperty(Vue.prototype, '$dynamicComponent', {
      value: dynamicComponent(Vue, store),
      writable: false,
    });
  }

  // router
  // 解决动态路由404问题
  if (router) {
    const resolveRoute = (
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: _Vue) => void) | void) => void,
    ) => {
      const fullPath = to.redirectedFrom || to.fullPath;

      const { resolved, location } = router.resolve(fullPath);
      // 在加载完组件后resolve的地址与原来要跳转的地址不一致时跳转
      // 以免造成404死循环
      if (resolved.name !== to.name) {
        next(location);
      } else {
        next();
      }
    };

    router.beforeEach((to, from, next) => {
      if (!to.name || to.name === '404' || to.name === 'page-not-found' || to.path === '*') {
        // 模块已经被加载完成, 但由于在其之前添加 beforeEach 阻止时间过长，vm.$watch还没开始监听
        if (vm.status.current) {
          resolveRoute(to, from, next);
        }
        vm.$watch(
          () => vm.status.current,
          (newVal, oldVal) => {
            // false => true
            if (newVal && !oldVal) {
              resolveRoute(to, from, next);
            }
          },
        );
      } else {
        next();
      }
    });
  }

  // Used to avoid multiple mixins being setup
  // when in dev mode and hot module reload
  // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
  if (Vue.$__module_loader_installed__) return;
  // eslint-disable-next-line @typescript-eslint/camelcase
  Vue.$__module_loader_installed__ = true;

  // 设置子模块中的运行时 Vue 对象与主框架一致
  // 或使用 '--inline-vue' 使用独立 Vue 对象
  if (!(window as any).Vue) {
    (window as any).Vue = Vue;
  }

  Vue.mixin({
    beforeCreate() {
      const options = this.$options as any;

      if (options.moduleLoader) {
        options.moduleLoader.init(this, options.ssrContext);
        this.$moduleLoadManager = Vue.observable(options.moduleLoader.framework);
      } else {
        this.$moduleLoadManager = (options.parent && options.parent.$moduleLoadManager) || this;
      }
    },
  });
}
