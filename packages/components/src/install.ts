import { use } from './options';

// Types
import type { VueConstructor, Component, DirectiveOptions, PluginFunction, PluginObject } from 'vue';
import type { UseOptions } from './options';

export function install(
  Vue: VueConstructor,
  options: UseOptions & {
    components?: Record<string, Component>;
    directives?: Record<string, DirectiveOptions>;
    plugins?: Record<string, PluginFunction<any> | PluginObject<any>>;
  } = {},
) {
  if ((install as any).installed) return;
  (install as any).installed = true;

  const { components = {}, plugins = {}, directives = {}, ...restOptions } = options;

  for (const name in directives) {
    const directive = directives[name];

    Vue.directive(name, directive);
  }

  for (const name in plugins) {
    const plugin = plugins[name];

    Vue.use(plugin);
  }

  (function registerComponents(components: any) {
    if (components) {
      for (const key in components) {
        const component = components[key];

        Vue.component(component.name, component);
      }
      return true;
    }
    return false;
  })(components);

  // Used to avoid multiple mixins being setup
  // when in dev mode and hot module reload
  // https://github.com/vuejs/vue/issues/5089#issuecomment-284260111
  if (Vue.$__vue_async_complex_installed__) return;
  // eslint-disable-next-line @typescript-eslint/camelcase
  Vue.$__vue_async_complex_installed__ = true;

  // register options
  use(restOptions);
}
