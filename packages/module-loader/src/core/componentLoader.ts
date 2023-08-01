import warning from 'warning';
import { isPlainObject, hasOwn } from '@ace-util/core';
import { debug } from '../env';
import * as spa from '../utils/spa';
// import * as ssr from '../utils/ssr';

// Types
import { isVue2, Vue2, App } from 'vue-demi';
// @ts-ignore
import { Component } from 'vue';
import { Context as vmContext } from 'vm';

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
 */
export function createComponentLoader(App: App | typeof Vue2) {
  return function loader<T>(componentName: string, src: string, styles?: string | string[]): Promise<Component> {
    // server render
    // if (Vue.prototype.$isServer) {
    //   const global = ssr.createSandbox();

    //   return ssr.execScript(src, global).then((scriptExports) => {
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

    // load styles
    if (styles) {
      if (typeof styles === 'string') {
        styles = [styles];
      }
      spa.addStyles(styles, componentName);
    }

    // exec script
    return spa.execScript(src, global).then((scriptExports) => {
      return getComponentFromExport(scriptExports, componentName, global);
    });
    // }
  };
}
