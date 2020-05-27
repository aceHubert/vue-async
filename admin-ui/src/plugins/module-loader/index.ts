import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import VueI18n, { LocaleMessageObject } from 'vue-i18n';
import ModuleLoader from '@vue-async/module-loader';
import router, { root } from '@/router';
import store from '@/store';
import { AppStore } from '@/store/modules';
import languages from '@/data/i18n/languages.json';

Vue.use(ModuleLoader, { router, store });

// 合并路由
const megreRoutes = (oldRoutes: RouteConfig[], newRoutes: RouteConfig[]) => {
  newRoutes.forEach((current: RouteConfig) => {
    const matchRoute = oldRoutes.find(
      (route: RouteConfig) => (current.name && route.name === current.name) || route.path === current.path,
    );
    if (matchRoute) {
      // 如果找到已在在的
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, name, ...restOptions } = current;
      Object.assign(matchRoute, restOptions); // 合并路由参数

      if (children) {
        !matchRoute.children && (matchRoute.children = []);
        megreRoutes(matchRoute.children, children);
      }
    } else {
      // 插入到 path:'*'之前
      const insertIndex = oldRoutes.findIndex((route: RouteConfig) => route.path === '*');
      // 如果没找到
      oldRoutes.splice(insertIndex < 0 ? 0 : insertIndex, 0, current);
    }
  });
};

export function createModuleLoader(
  ssrContext: any,
  {
    i18n,
  }: {
    i18n: VueI18n;
  },
) {
  const moduleLoader = new ModuleLoader({
    addMenus: (menus: Menu | Array<Menu>) => {
      AppStore.AddMenus(menus);
    },
    addRoutes: (routes: RouteConfig[]) => {
      const options = (router as any).options;
      megreRoutes(options.routes, root(routes));
      const newRouter = new VueRouter(options);
      (router as any).matcher = (newRouter as any).matcher;
    },
    languages,
    addLocaleMessage(lang: string, message: LocaleMessageObject) {
      const { locale } = languages.find((l: LangConfig) => l.alternate === lang || l.locale === lang) || {};
      if (!locale) {
        return Promise.reject(new Error(`Language ${lang} not found`));
      }
      i18n.mergeLocaleMessage(lang, message);
      return Promise.resolve(lang);
    },
  });

  return moduleLoader;
}