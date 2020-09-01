/**
 * componentLoader
 */
import Vue, { VueConstructor, Component as VueComponent } from 'vue';
import { warn as globalWarn, isPlainObject, isFunction, hasOwn } from '@vue-async/utils';
import { execScript } from '../utils';

const isProduction = process.env.NODE_ENV === 'production';

/** 验证组件导出是否正确 */
function validateExportComponent(exports: any) {
  const _export = (exports && exports.default) || exports;
  if (isPlainObject(_export)) {
    return (
      Object.keys(_export).length > 0 &&
      (hasOwn(_export, 'template') ||
      hasOwn(_export, 'render') || // component definition
      hasOwn(_export, 'component') || // AsyncComponentFactory
        isFunction(_export)) // AsyncComponentPromise
    );
  } else {
    return _export instanceof Vue;
  }
}

/** 获取组件 */
function getComponentFromExport(scriptExports: any, componentName: string, global: WindowProxy) {
  if (validateExportComponent(scriptExports)) {
    return (scriptExports && scriptExports.default) || scriptExports;
  }

  globalWarn(
    isProduction,
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
  return function loader(componentName: string, src: string): Promise<VueComponent> {
    const global = window;
    return execScript(src, global).then((scriptExports) => {
      return getComponentFromExport(scriptExports, componentName, global);
    });
  };
};
