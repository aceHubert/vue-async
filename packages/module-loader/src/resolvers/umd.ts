/**
 * @author Hubert
 * fork from https://github.com/kuitos/import-html-entry/blob/master/src/utils.js
 */
import warning from 'warning';
import { debug } from '../env';
import { defineResolver } from '../resolver';

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

const scriptsCache = new Map<string, any>();
const stylesCache = new Map<string, HTMLLinkElement>();

export default defineResolver<WindowProxy>({
  execScript(entry, proxy, container = (proxy: WindowProxy) => proxy.document.body) {
    if (scriptsCache.has(entry)) return Promise.resolve(scriptsCache.get(entry)); // 从 catch 中获取

    const selector = typeof container === 'string' ? proxy.document.querySelector(container) : container(proxy);
    if (!selector) {
      return Promise.reject(new Error(`[@vue-async/module-loader] The container to append script is not found.`));
    }

    return new Promise((resolve, reject) => {
      noteGlobalProps(proxy);

      const script = proxy.document.createElement('script');
      script.src = entry;
      script.onload = () => {
        const propName = getGlobalProp(proxy);
        const exports = propName ? proxy[propName] || {} : {};
        scriptsCache.set(entry, exports); // add to catch
        resolve(exports);
      };
      script.onerror = (err) => {
        warning(!debug, `[@vue-async/module-loader] script had a problem to create, entry：${entry}`);
        selector.removeChild(script); // remove script
        reject(new Error(`script load error, error: ${err.toString()}`));
      };

      selector!.appendChild(script);
    });
  },
  async addStyles(styles: string[], proxy, container = (proxy: WindowProxy) => proxy.document.head) {
    if (styles.length) {
      const selector = typeof container === 'string' ? proxy.document.querySelector(container) : container(proxy);
      if (!selector) {
        return Promise.reject(new Error(`[@vue-async/module-loader] The container to append link is not found.`));
      }
      await Promise.all(
        styles.map((href) => {
          if (stylesCache.has(href)) return Promise.resolve(); // 从 catch 中获取

          return new Promise<void>((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = href;
            link.onload = () => {
              stylesCache.set(href, link);
              resolve();
            };
            link.onerror = (err) => {
              warning(!debug, `[@vue-async/module-loader] href had a problem to create, href${href}`);
              selector.removeChild(link); // remove link
              reject(new Error(`style load error, error: ${err.toString()}`));
            };
            selector.appendChild(link);
          });
        }),
      );
    }
  },
  removeStyles(styles: string[]) {
    if (styles.length) {
      styles.forEach((href) => {
        const link = stylesCache.get(href);
        link?.remove();
      });
    }
  },
});
