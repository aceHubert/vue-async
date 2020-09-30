import http from 'http';
import vm from 'vm';
import { error } from '@vue-async/utils';

export function createSandbox() {
  const sandbox: Record<string, any> = {
    Buffer: Buffer,
    require: require,
    console: console,
    process: process,
    setTimeout: setTimeout,
    setInterval: setInterval,
    setImmediate: setImmediate,
    clearTimeout: clearTimeout,
    clearInterval: clearInterval,
    clearImmediate: clearImmediate,
  };
  sandbox.global = sandbox;
  sandbox.exports = {};
  sandbox.module = {};
  return sandbox;
}

/** 加载 entry 脚本 */
export function execScript(entry: string, proxy: vm.Context = { exports: {} }) {
  return new Promise((resolve, reject) => {
    const request = http.get(entry, (res) => {
      const { statusCode } = res;

      if (statusCode !== 200) {
        error(process.env.NODE_ENV === 'production', `[moduleLoader] script had a problem to create, entry：${entry}`);
        reject(new Error(`script load error, statusCode: ${statusCode}`));
      }
      res.setEncoding('utf8');
      res.setTimeout(10000);

      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        // try {
        vm.createContext(proxy);
        vm.runInContext(rawData.toString(), proxy);
        if (typeof proxy.exports === 'object' && typeof proxy.module === 'object') {
          resolve(proxy.module.exports);
        } else {
          // 交给外部能过 lib name 查找
          resolve();
        }
        // }
        // catch (err) {
        //   error(
        //     process.env.NODE_ENV === 'production',
        //     `[moduleLoader] script had a problem to create, entry：${entry}`,
        //   );
        //   reject(new Error(`script load error, error: ${err.message}`));
        // }
      });
    });

    request.on('error', (err) => {
      error(process.env.NODE_ENV === 'production', `[moduleLoader] http.request error, entry：${entry}`);
      reject(new Error(`script load error, error: ${err.message}`));
    });
  });
}

/** 加载 styles */
export function execStyles(styles: string[], _styleFor?: string) {
  // load css
  if (styles.length) {
  }
}
