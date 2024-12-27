import warning from 'warning';
import { debug } from '../env';

// Types
import { Context as vmContext } from 'vm';
import { ClientRequest, IncomingMessage } from 'http';
import { ResolverCreatorOptions, Resolver } from '../types';

function createSandbox(globalVariables: Record<string, any> = {}) {
  const sandbox: Record<string, any> = {
    ...globalVariables,
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

  return {};
}

function tryGetCwd(path: any) {
  let threw = true;
  let cwd;
  try {
    cwd = process.cwd();
    threw = false;
  } finally {
    if (threw) {
      // getcwd(3) can fail if the current working directory has been deleted.
      // Fall back to the directory name of the (absolute) executable path.
      // It's not really correct but what are the alternatives?
      return path.dirname(process.execPath);
    }
  }
  return cwd;
}

export function createCjsResolver({ globalVariables }: ResolverCreatorOptions): Resolver<vmContext> {
  const proxy = createSandbox(globalVariables);
  return {
    context: proxy,
    execScript(entry) {
      return new Promise((resolve, reject) => {
        const http = require('http');
        const request: ClientRequest = http.get(entry, (res: IncomingMessage) => {
          const { statusCode } = res;

          if (statusCode !== 200) {
            warning(!debug, `[@vue-async/module-loader] script had a problem to create, entry：${entry}`);
            reject(new Error(`script load error, statusCode: ${statusCode}`));
          }
          res.setEncoding('utf8');
          res.setTimeout(10000);

          let rawData = '';
          res.on('data', (chunk) => {
            rawData += chunk;
          });

          res.on('end', () => {
            try {
              // https://github.com/nodejs/node/blob/6add5b31fcc4ae45a8603f886477c544a99e0188/lib/internal/bootstrap_node.js#L415
              const exports = (function evalScript(name: string, body: string) {
                const Module = require('module');
                const path = require('path');
                const cwd = tryGetCwd(path);
                // @ts-ignore
                const _module = new Module(name);
                _module.filename = path.join(cwd, name);
                _module.paths = Module._nodeModulePaths(cwd);
                const script = `global.__filename = ${JSON.stringify(name)};
                global.exports = exports;
                global.module = module;
                global.__dirname = __dirname;
                global.require = require;
                return require("vm").runInThisContext(${JSON.stringify(body)}, {
                  filename: ${JSON.stringify(name)},
                  displayErrors: true
                });`;
                _module._compile(script, `${name}-wrapper`);
                return _module.exports;
              })(entry.substr(entry.lastIndexOf('/') + 1), rawData.toString());

              resolve(exports);
            } catch (err: any) {
              warning(!debug, `[@vue-async/module-loader] script had a problem to create, entry：${entry}`);
              reject(new Error(`script load error, error: ${err.message}`));
            }
          });
        });

        request.on('error', (err) => {
          warning(!debug, `[@vue-async/module-loader] http.request error, entry：${entry}`);
          reject(new Error(`script load error, error: ${err.message}`));
        });
      });
    },
    addStyles(styles: string[]) {
      // load css
      if (styles.length) {
        // TODO: do something
      }
      return Promise.resolve();
    },
    removeStyles(styles: string[]) {
      // unload css
      if (styles.length) {
        // TODO: do something
      }

      // remove css
      return Promise.resolve();
    },
  };
}
