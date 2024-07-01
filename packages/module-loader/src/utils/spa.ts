/**
 * @author Hubert
 * fork from https://github.com/kuitos/import-html-entry/blob/master/src/utils.js
 */
import warning from 'warning';
import { debug } from '../env';

const isIE11 = typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Trident') !== -1;

function shouldSkipProperty(global: WindowProxy, p: string) {
  if (!global.hasOwnProperty(p) || (!isNaN(p) && parseInt(p) < global.length)) return true;

  if (isIE11) {
    // https://github.com/kuitos/import-html-entry/pull/32，最小化 try 范围
    try {
      return global[p] && global[p].parent === window;
    } catch (err) {
      return true;
    }
  } else {
    return false;
  }
}

// safari unpredictably lists some new globals first or second in object order
let firstGlobalProp: unknown, secondGlobalProp: unknown, lastGlobalProp: unknown;

function getGlobalProp(global: WindowProxy) {
  let cnt = 0;
  let lastProp;
  let hasIframe = false;

  for (const p in global) {
    if (shouldSkipProperty(global, p)) continue;

    // 遍历 iframe，检查 window 上的属性值是否是 iframe，是则跳过后面的 first 和 second 判断
    for (let i = 0; i < window.frames.length && !hasIframe; i++) {
      const frame = window.frames[i];
      if (frame === global[p]) {
        hasIframe = true;
        break;
      }
    }

    if (!hasIframe && ((cnt === 0 && p !== firstGlobalProp) || (cnt === 1 && p !== secondGlobalProp))) return p;
    cnt++;
    lastProp = p;
  }

  if (lastProp !== lastGlobalProp) return lastProp;
  return;
}

function noteGlobalProps(global: WindowProxy) {
  // alternatively Object.keys(global).pop()
  // but this may be faster (pending benchmarks)
  firstGlobalProp = secondGlobalProp = undefined;

  for (const p in global) {
    if (shouldSkipProperty(global, p)) continue;
    if (!firstGlobalProp) firstGlobalProp = p;
    else if (!secondGlobalProp) secondGlobalProp = p;
    lastGlobalProp = p;
  }

  return lastGlobalProp;
}

/** 加载 entry 脚本 */
const entryScriptCatch: Record<string, any> = {};
export function execScript(entry: string, proxy: WindowProxy = window) {
  if (entryScriptCatch[entry]) return Promise.resolve(entryScriptCatch[entry]); // 从 catch 中获取

  return new Promise((resolve, reject) => {
    noteGlobalProps(proxy);

    const script = proxy.document.createElement('script');
    script.src = entry;
    script.setAttribute;
    script.onload = () => {
      const propName = getGlobalProp(proxy);
      const exports = propName ? proxy[propName] || {} : {};
      entryScriptCatch[entry] = exports; // add to catch
      resolve(exports);
    };
    script.onerror = (err) => {
      warning(!debug, `[@vue-async/module-loader] script had a problem to create, entry：${entry}`);
      proxy.document.body.removeChild(script); // remove script
      reject(new Error(`script load error, error: ${err}`));
    };
    proxy.document.body.appendChild(script);
  });
}

/** 加载 styles */
export function addStyles(styles: string[], styleFor?: string) {
  if (styles.length) {
    return Promise.all(
      styles.map((href) => {
        return new Promise((resolve) => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.type = 'text/css';
          link.href = href;
          styleFor && (link.dataset.styleFor = styleFor);
          link.onload = resolve;
          link.onerror = resolve;
          document.getElementsByTagName('head')[0].appendChild(link);
        });
      }),
    );
  }
  return Promise.resolve();
}

/** 移除 styles */
export function removeStyles(styleFor: string) {
  document.querySelectorAll(`link[data-style-for='${styleFor}']`).forEach((style) => {
    document.getElementsByTagName('head')[0].removeChild(style);
  });
}
