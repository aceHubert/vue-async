/**
 * router/utils
 * 添加语言前缀
 */
import { RouteConfig, Route, RawLocation } from 'vue-router';
import kebabCase from 'lodash.kebabcase';
import languages from '@/data/i18n/languages.json';

export function layout(path: string, name: string, children: RouteConfig[]) {
  const folder = kebabCase(name);

  return {
    path,
    component: () =>
      import(
        /* webpackChunkName: "layout-[request]" */
        `@/layouts/${folder}/index`
      ),
    props: true,
    children,
  };
}

export function trailingSlash(str: string) {
  return str.endsWith('/') ? str : str + '/';
}

// Matches allowed languages
export const languagePattern = languages.map((lang: LangConfig) => lang.alternate || lang.locale).join('|');
export const languageRegexp = new RegExp('^(' + languagePattern + ')$');
// Matches any language identifier
export const genericLanguageRegexp = /[a-z]{2,3}|[a-z]{2,3}-[a-zA-Z]{4}|[a-z]{2,3}-[A-Z]{2,3}/;

export const preferredLanguage =
  typeof document === 'undefined'
    ? 'en'
    : localStorage.getItem('currentLanguage') || navigator.languages.find(l => l.match(languageRegexp)) || 'en';

export function root(children: RouteConfig[]) {
  return [
    layout(`/:lang(${languagePattern})`, 'Root', children),
    {
      path: `/:lang(${genericLanguageRegexp.source})/*`,
      redirect: (to: Route) => trailingSlash(`/${preferredLanguage}/${to.params.pathMatch || ''}`),
    },
    {
      // The previous one doesn't match if there's no slash after the language code
      path: `/:lang(${genericLanguageRegexp.source})`,
      redirect: () => `/${preferredLanguage}/`,
    },
    redirect((to: Route) => trailingSlash(`/${preferredLanguage}${to.path}`)),
  ];
}

export function redirect(redirect: RawLocation | ((to: Route) => RawLocation)) {
  return { path: '*', redirect };
}
