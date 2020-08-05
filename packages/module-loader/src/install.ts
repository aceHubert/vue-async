import { VueConstructor } from 'vue';
import { Route, RawLocation } from 'vue-router';
import dynamicComponent, { namespaces as dynamicComponentPath } from './ability/dynamicComponent';
import dynamicComponentState from './ability/dynamicComponent/storeModule';
import createEventBus from './ability/eventBus';
import createModuleLoader from './ability/moduleLoader';
import createComponentLoader from './ability/componentLoader';
import { Store } from 'vuex';
import VueRouter from 'vue-router';

export default function install(Vue: VueConstructor) {
  if ((install as any).installed) return;
  (install as any).installed = true;

  // 用于监听模块加载的情况，处理路由404问题
  const vm = new Vue({
    data() {
      return {
        status: {
          current: false,
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

  // router
  const routerInject = (router: VueRouter) => {
    // 解决动态路由404问题
    const resolveRoute = (
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: InstanceType<VueConstructor>) => void) | void) => void,
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
  };

  // store
  const storeInject = (store: Store<unknown>) => {
    store.registerModule(dynamicComponentPath, dynamicComponentState);
    // define $dynamicComponent
    Object.defineProperty(Vue.prototype, '$dynamicComponent', {
      value: dynamicComponent(Vue, store),
      writable: false,
    });
  };

  const _init = Vue.prototype._init;
  Vue.prototype._init = function (options: any = {}) {
    // 从 Vue root option 中获取 router | store 实例
    // router beforeEach 需要在 beforeCreate 之前添加，才能在页面强制刷新时第一次生效
    if (options.router) {
      routerInject(options.router);
    }
    if (options.store) {
      storeInject(options.store);
    }
    _init.call(this, options);
  };

  // Used to avoid multiple mixins being setup
  // when in dev mode and hot module reload
  // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
  if (Vue.$__module_loader_installed__) return;
  // eslint-disable-next-line @typescript-eslint/camelcase
  Vue.$__module_loader_installed__ = true;

  if (window && !window.Vue) {
    window.Vue = Vue as any;
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
