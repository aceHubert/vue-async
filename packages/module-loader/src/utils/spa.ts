/**
 * @author Hubert
 * fork from https://github.com/kuitos/import-html-entry/blob/master/src/utils.js
 */
import { error } from '@vue-async/utils';

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
export function execScript(entry: string, proxy: WindowProxy = window) {
  return new Promise((resolve, reject) => {
    noteGlobalProps(proxy);

    const script = proxy.document.createElement('script');
    script.src = entry;
    script.onload = () => {
      const propName = getGlobalProp(proxy);
      const exports = propName ? proxy[propName] || {} : {};
      resolve(exports);
    };
    script.onerror = (err) => {
      error(process.env.NODE_ENV === 'production', `[moduleLoader] script had a problem to create, entry：${entry}`);
      reject(new Error(`script load error, error: ${err}`));
    };
    proxy.document.body.appendChild(script);
  });
}

/** 加载 styles */
export function execStyles(styles: string[], styleFor?: string) {
  // load css
  if (styles.length) {
    (styles as string[]).map((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = href;
      styleFor && (link.dataset.styleFor = styleFor);
      document.getElementsByTagName('head')[0].appendChild(link);
    });
  }
}
