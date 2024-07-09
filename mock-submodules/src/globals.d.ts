import type { RouteRecordRaw } from 'vue-router';

declare module '@vue-async/module-loader/esm/types' {
  interface RegisterProperties {
    routes: RouteRecordRaw[];
  }
}
