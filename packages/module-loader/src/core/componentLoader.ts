import warning from 'warning';
import { isPlainObject, hasOwn } from '@ace-util/core';
import { debug } from '../env';
import { promisify } from '../utils/promisify';

// Types
import { isVue2, Vue2, App, Component } from 'vue-demi';
import { Context as vmContext } from 'vm';
import { Resolver } from '../types';

/** 验证组件导出是否正确 */
function validateExportComponent(exports: any) {
  const _export = (exports && exports.default) || exports;
  if (isPlainObject(_export)) {
    return (
      Object.keys(_export).length > 0 &&
      (hasOwn(_export, 'template') ||
        hasOwn(_export, 'render') || // component definition
        hasOwn(_export, 'setup')) // vue3 or @vue/composition-api
    );
  } else {
    // @ts-ignore works on Vue 2, fails in Vue 3
    return isVue2 ? _export instanceof Vue2 : false;
  }
}

/** 获取组件 */
function getComponentFromExport(scriptExports: any, componentName: string, global: WindowProxy | vmContext) {
  if (validateExportComponent(scriptExports)) {
    return (scriptExports && scriptExports.default) || scriptExports;
  }

  warning(
    !debug,
    `[@vue-async/module-loader] component not found from ${componentName} entry exports, fallback to get from window['${componentName}']`,
  );

  // fallback to global variable who named with ${moduleName} while module exports not found
  const globalVariableExports = (global as any)[componentName];

  if (validateExportComponent(globalVariableExports)) {
    return (globalVariableExports && globalVariableExports.default) || globalVariableExports;
  }

  throw new Error(`[@vue-async/module-loader] You need to export vue component in ${componentName} entry`);
}

/**
 * create module loader
 * @param App instance from 'createApp' in Vue3, Vue constructor in Vue2
 * @param resolver resolver
 */
export function createComponentLoader(
  App: App | typeof Vue2,
  resolver: {
    isServer: boolean;
    browser: (src: string) => Resolver<WindowProxy>;
    server: (src: string) => Resolver<vmContext>;
  },
) {
  return async function loader<T = any>(
    componentName: string,
    src: string,
    styles?: string | string[],
  ): Promise<Component<T>> {
    // server render
    // if (resolver.isServer) {
    //   const global = ssr.createSandbox();

    //   const serverResolver = resolver.server(src);
    //   return resolver.resolver.execScript(src, global).then((scriptExports) => {
    //     return getComponentFromExport(scriptExports, componentName, global);
    //   });
    // } else {

    // browser render
    // TODO: load in sandbox
    const global: WindowProxy = window;

    // 如果是Vue2, 把 Vue constructor 入到全局 context 上供子模块使用
    if (isVue2 && !global.Vue) {
      global.Vue = App;
    }

    const browserResolver = resolver.browser(src);
    // load styles
    if (styles) {
      if (typeof styles === 'string') {
        styles = [styles];
      }
      await promisify(browserResolver.addStyles(styles, global));
    }

    // exec script
    const scriptExports = await promisify(browserResolver.execScript<object>(src, global));
    return getComponentFromExport(scriptExports, componentName, global);
    // }
  };
}
