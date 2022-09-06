import ModuleLoader from '@vue-async/module-loader';

declare module '@nuxt/types' {
  interface Context {
    $moduleLoader: ModuleLoader;
  }
}
