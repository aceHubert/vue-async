import dynamicComponent, {
  namespaces as dynamicComponentPath,
  storeModule as dynamicComponentStoreModule,
} from './ability/dynamicComponent';

import createEventBus from './ability/eventBus';
import createModuleLoader from './ability/moduleLoader';
import createComponentLoader from './ability/componentLoader';
import ModuleLoader from './framework';

// Types
import { VueConstructor } from 'vue';
import { Store } from 'vuex';
import VueRouter, { Route, RawLocation } from 'vue-router';

export default function install(this: typeof ModuleLoader, Vue: VueConstructor) {
  if ((install as any).installed) return;
  (install as any).installed = true;

  // 监听模块加载的情况，处理路由404问题
  const vm = new Vue({
    data() {
      return {
        status: {
          current: false, // 管理 modules 是否已经加载完，处理路由需要
        },
      };
    },
  });

  const properties = {
    $moduleLoader: {
      value: createModuleLoader(Vue, vm.status),
      writable: false,
      enumerable: true,
      configurable: true,
    },
    $componentLoader: {
      value: createComponentLoader(Vue),
      writable: false,
      enumerable: true,
      configurable: true,
    },
    $eventBus: {
      value: createEventBus(Vue),
      writable: false,
      enumerable: true,
      configurable: true,
    },
  };

  /**
   * 注入到 Vue 实例
   */
  Object.defineProperties(Vue.prototype, properties);

  /**
   * router注入（当路由被注册注入时，必须调用$moduleLoaser至少一次，否则 status 状态无法变更造成路由被阻止）
   * @param router
   */
  const routerInject = (router: VueRouter) => {
    return router.beforeEach((to, from, next) => {
      if (!to.name || to.name === '404' || to.name === 'page-not-found' || to.name === 'not-found' || to.path === '*') {
        // 模块已经被加载完成, 但由于在其之前添加的 beforeEach 阻止时间过长，vm.$watch还没开始监听
        if (vm.status.current) {
          return resolveRoute(to, from, next);
        }
        // 当 status 为 false 时watch状态
        vm.$watch(
          () => vm.status.current,
          (newVal, oldVal) => {
            // 从false => true状态
            if (newVal && !oldVal) {
              resolveRoute(to, from, next);
            }
          },
        );
      } else {
        next();
      }
    });

    // 解决动态路由404问题
    function resolveRoute(
      to: Route,
      from: Route,
      next: (to?: RawLocation | false | ((vm: InstanceType<VueConstructor>) => void) | void) => void,
    ) {
      const fullPath = to.redirectedFrom || to.fullPath;
      const { resolved, location } = router.resolve(fullPath);
      // 在加载完组件后resolve的地址与原来要跳转的地址不一致时跳转
      // 以免造成404死循环
      if (resolved.name !== to.name) {
        next(location);
      } else {
        next();
      }
    }
  };

  /**
   * store 注入, 添加 $dynamicComponent 方法
   * @param store
   */
  const storeInject = (store: Store<unknown>) => {
    if (!store.hasModule(dynamicComponentPath)) {
      store.registerModule(dynamicComponentPath, dynamicComponentStoreModule);
      // define $dynamicComponent
      Object.defineProperty(Vue.prototype, '$dynamicComponent', {
        value: dynamicComponent(Vue, store),
        writable: false,
        enumerable: true,
        configurable: true,
      });
    }
  };

  const _init = Vue.prototype._init;
  /**
   * 从 Vue root.options 中获取 router | store 实例
   */
  Vue.prototype._init = function (options: any = {}) {
    // router beforeEach 需要在 beforeCreate 之前添加，才能在页面强制刷新时第一次生效
    if (options.router) {
      routerInject(options.router);
    }
    if (options.store) {
      storeInject(options.store);
    }
    _init.call(this, options);
  };

  // 扩展 new ModuleLoader().load() 在 Vue 实例化之前加载模块
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  Object.defineProperties(this.prototype, {
    // 需要主动注册 DynamicComponent
    registerDynamicComponent: {
      value: function (store: Store<unknown>) {
        storeInject(store);
        return this;
      },
      writable: false,
      enumerable: true,
      configurable: true,
    },
    load: properties.$moduleLoader,
    loadComponent: properties.$componentLoader,
    eventBus: properties.$eventBus,
  });

  // Used to avoid multiple mixins being setup
  // when in dev mode and hot module reload
  // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
  if (Vue.$__module_loader_installed__) return;
  // eslint-disable-next-line @typescript-eslint/camelcase
  Vue.$__module_loader_installed__ = true;

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
