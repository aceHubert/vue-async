/**
 * componentLoader
 */
import Vue from 'vue';
import warning from 'warning';
import { isPlainObject, isFunction, hasOwn } from '@ace-util/core';
import * as spa from '../utils/spa';
// import * as ssr from '../utils/ssr';

// Types
import { VueConstructor, Component as VueComponent } from 'vue';
import { Context as vmContext } from 'vm';

/** 验证组件导出是否正确 */
function validateExportComponent(exports: any) {
  const _export = (exports && exports.default) || exports;
  if (isPlainObject(_export)) {
    return (
      Object.keys(_export).length > 0 &&
      (hasOwn(_export, 'template') ||
        hasOwn(_export, 'render') || // component definition
        isFunction(_export)) // Vue.extend
      // hasOwn(_export, 'component') || // AsyncComponentFactory
      //   isFunction(_export)) // AsyncComponentPromise
    );
  } else {
    return _export instanceof Vue;
  }
}

/** 获取组件 */
function getComponentFromExport(scriptExports: any, componentName: string, global: WindowProxy | vmContext) {
  if (validateExportComponent(scriptExports)) {
    return (scriptExports && scriptExports.default) || scriptExports;
  }

  warning(
    false,
    `[moduleLoader] component not found from ${componentName} entry exports, fallback to get from window['${componentName}']`,
  );

  // fallback to global variable who named with ${moduleName} while module exports not found
  const globalVariableExports = (global as any)[componentName];

  if (validateExportComponent(globalVariableExports)) {
    return (globalVariableExports && globalVariableExports.default) || globalVariableExports;
  }

  throw new Error(`[moduleLoader] You need to export vue component in ${componentName} entry`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (Vue: VueConstructor) => {
  return function loader(componentName: string, src: string, styles?: string | string[]): Promise<VueComponent> {
    // if (Vue.prototype.$isServer) {
    //   const global = ssr.createSandbox();

    //   return ssr.execScript(src, global).then((scriptExports) => {
    //     return getComponentFromExport(scriptExports, componentName, global);
    //   });
    // } else {
    const global: WindowProxy = window;

    if (!global.Vue) {
      global.Vue = Vue;
    }

    // load styles
    if (styles) {
      if (typeof styles === 'string') {
        styles = [styles];
      }
      spa.execStyles(styles, componentName);
    }

    // exec script
    return spa.execScript(src, global).then((scriptExports) => {
      return getComponentFromExport(scriptExports, componentName, global);
    });
    // }
  };
};
