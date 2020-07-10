(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof exports === 'object') exports['dymanicComponent'] = factory();
  else root['dymanicComponent'] = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  return /******/ (function (modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {}; // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports;
        /******/
      } // Create a new module (and put it into the cache)
      /******/ /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {},
        /******/
      }); // Execute the module function
      /******/
      /******/ /******/ modules[moduleId].call(module.exports, module, module.exports, __webpack_require__); // Flag the module as loaded
      /******/
      /******/ /******/ module.l = true; // Return the exports of the module
      /******/
      /******/ /******/ return module.exports;
      /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules; // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function (exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, { enumerable: true, get: getter });
        /******/
      }
      /******/
    }; // define __esModule on exports
    /******/
    /******/ /******/ __webpack_require__.r = function (exports) {
      /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        /******/
      }
      /******/ Object.defineProperty(exports, '__esModule', { value: true });
      /******/
    }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
    /******/
    /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function (value, mode) {
      /******/ if (mode & 1) value = __webpack_require__(value);
      /******/ if (mode & 8) return value;
      /******/ if (mode & 4 && typeof value === 'object' && value && value.__esModule) return value;
      /******/ var ns = Object.create(null);
      /******/ __webpack_require__.r(ns);
      /******/ Object.defineProperty(ns, 'default', { enumerable: true, value: value });
      /******/ if (mode & 2 && typeof value != 'string')
        for (var key in value)
          __webpack_require__.d(
            ns,
            key,
            function (key) {
              return value[key];
            }.bind(null, key),
          );
      /******/ return ns;
      /******/
    }; // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function (module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module['default'];
            }
          : /******/ function getModuleExports() {
              return module;
            };
      /******/ __webpack_require__.d(getter, 'a', getter);
      /******/ return getter;
      /******/
    }; // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    }; // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports
    /******/
    /******/
    /******/ /******/ return __webpack_require__((__webpack_require__.s = 'fb15'));
    /******/
  })(
    /************************************************************************/
    /******/ {
      /***/ '8875': /***/ function (module, exports, __webpack_require__) {
        var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__; // addapted from the document.currentScript polyfill by Adam Miller
        // MIT license
        // source: https://github.com/amiller-gh/currentScript-polyfill

        // added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

        (function (root, factory) {
          if (true) {
            !((__WEBPACK_AMD_DEFINE_ARRAY__ = []),
            (__WEBPACK_AMD_DEFINE_FACTORY__ = factory),
            (__WEBPACK_AMD_DEFINE_RESULT__ =
              typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function'
                ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)
                : __WEBPACK_AMD_DEFINE_FACTORY__),
            __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
          } else {
          }
        })(typeof self !== 'undefined' ? self : this, function () {
          function getCurrentScript() {
            if (document.currentScript) {
              return document.currentScript;
            }

            // IE 8-10 support script readyState
            // IE 11+ & Firefox support stack trace
            try {
              throw new Error();
            } catch (err) {
              // Find the second match for the "at" string to get file src url from stack.
              var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/gi,
                ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/gi,
                stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
                scriptLocation = (stackDetails && stackDetails[1]) || false,
                line = (stackDetails && stackDetails[2]) || false,
                currentLocation = document.location.href.replace(document.location.hash, ''),
                pageSource,
                inlineScriptSourceRegExp,
                inlineScriptSource,
                scripts = document.getElementsByTagName('script'); // Live NodeList collection

              if (scriptLocation === currentLocation) {
                pageSource = document.documentElement.outerHTML;
                inlineScriptSourceRegExp = new RegExp(
                  '(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*',
                  'i',
                );
                inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
              }

              for (var i = 0; i < scripts.length; i++) {
                // If ready state is interactive, return the script tag
                if (scripts[i].readyState === 'interactive') {
                  return scripts[i];
                }

                // If src matches, return the script tag
                if (scripts[i].src === scriptLocation) {
                  return scripts[i];
                }

                // If inline source matches, return the script tag
                if (
                  scriptLocation === currentLocation &&
                  scripts[i].innerHTML &&
                  scripts[i].innerHTML.trim() === inlineScriptSource
                ) {
                  return scripts[i];
                }
              }

              // If no match, return null
              return null;
            }
          }

          return getCurrentScript;
        });

        /***/
      },

      /***/ fb15: /***/ function (module, __webpack_exports__, __webpack_require__) {
        'use strict';
        __webpack_require__.r(__webpack_exports__);

        // CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
        // This file is imported into lib/wc client bundles.

        if (typeof window !== 'undefined') {
          var currentScript = window.document.currentScript;
          if (true) {
            var getCurrentScript = __webpack_require__('8875');
            currentScript = getCurrentScript();

            // for backward compatibility, because previously we directly included the polyfill
            if (!('currentScript' in document)) {
              Object.defineProperty(document, 'currentScript', { get: getCurrentScript });
            }
          }

          var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
          if (src) {
            __webpack_require__.p = src[1]; // eslint-disable-line
          }
        }

        // Indicate to webpack that this file can be concatenated
        /* harmony default export */ var setPublicPath = null;

        // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"4888ae4d-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dymanicComponent/components/pluginA.vue?vue&type=template&id=28bc7948&
        var render = function () {
          var _vm = this;
          var _h = _vm.$createElement;
          var _c = _vm._self._c || _h;
          return _c('h1', [_vm._v('Plugin A from remote')]);
        };
        var staticRenderFns = [];

        // CONCATENATED MODULE: ./src/dymanicComponent/components/pluginA.vue?vue&type=template&id=28bc7948&

        // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dymanicComponent/components/pluginA.vue?vue&type=script&lang=js&
        //
        //
        //
        //
        /* harmony default export */ var pluginAvue_type_script_lang_js_ = {
          name: 'plugin-a',
        };
        // CONCATENATED MODULE: ./src/dymanicComponent/components/pluginA.vue?vue&type=script&lang=js&
        /* harmony default export */ var components_pluginAvue_type_script_lang_js_ = pluginAvue_type_script_lang_js_;
        // CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
        /* globals __VUE_SSR_CONTEXT__ */

        // IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
        // This module is a runtime utility for cleaner component module output and will
        // be included in the final webpack user bundle.

        function normalizeComponent(
          scriptExports,
          render,
          staticRenderFns,
          functionalTemplate,
          injectStyles,
          scopeId,
          moduleIdentifier /* server only */,
          shadowMode /* vue-cli only */,
        ) {
          // Vue.extend constructor export interop
          var options = typeof scriptExports === 'function' ? scriptExports.options : scriptExports;

          // render functions
          if (render) {
            options.render = render;
            options.staticRenderFns = staticRenderFns;
            options._compiled = true;
          }

          // functional template
          if (functionalTemplate) {
            options.functional = true;
          }

          // scopedId
          if (scopeId) {
            options._scopeId = 'data-v-' + scopeId;
          }

          var hook;
          if (moduleIdentifier) {
            // server build
            hook = function (context) {
              // 2.3 injection
              context =
                context || // cached call
                (this.$vnode && this.$vnode.ssrContext) || // stateful
                (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (injectStyles) {
                injectStyles.call(this, context);
              }
              // register component module identifier for async chunk inferrence
              if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
              }
            };
            // used by ssr in case component is cached and beforeCreate
            // never gets called
            options._ssrRegister = hook;
          } else if (injectStyles) {
            hook = shadowMode
              ? function () {
                  injectStyles.call(this, (options.functional ? this.parent : this).$root.$options.shadowRoot);
                }
              : injectStyles;
          }

          if (hook) {
            if (options.functional) {
              // for template-only hot-reload because in that case the render fn doesn't
              // go through the normalizer
              options._injectStyles = hook;
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
              };
            } else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
          }

          return {
            exports: scriptExports,
            options: options,
          };
        }

        // CONCATENATED MODULE: ./src/dymanicComponent/components/pluginA.vue

        /* normalize component */

        var component = normalizeComponent(
          components_pluginAvue_type_script_lang_js_,
          render,
          staticRenderFns,
          false,
          null,
          null,
          null,
        );

        /* harmony default export */ var pluginA = component.exports;
        // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"4888ae4d-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dymanicComponent/components/pluginB.vue?vue&type=template&id=ddfca9c2&
        var pluginBvue_type_template_id_ddfca9c2_render = function () {
          var _vm = this;
          var _h = _vm.$createElement;
          var _c = _vm._self._c || _h;
          return _c('h1', [_vm._v('Plugin B from remote')]);
        };
        var pluginBvue_type_template_id_ddfca9c2_staticRenderFns = [];

        // CONCATENATED MODULE: ./src/dymanicComponent/components/pluginB.vue?vue&type=template&id=ddfca9c2&

        // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dymanicComponent/components/pluginB.vue?vue&type=script&lang=js&
        //
        //
        //
        //
        /* harmony default export */ var pluginBvue_type_script_lang_js_ = {
          name: 'plugin-b',
        };
        // CONCATENATED MODULE: ./src/dymanicComponent/components/pluginB.vue?vue&type=script&lang=js&
        /* harmony default export */ var components_pluginBvue_type_script_lang_js_ = pluginBvue_type_script_lang_js_;
        // CONCATENATED MODULE: ./src/dymanicComponent/components/pluginB.vue

        /* normalize component */

        var pluginB_component = normalizeComponent(
          components_pluginBvue_type_script_lang_js_,
          pluginBvue_type_template_id_ddfca9c2_render,
          pluginBvue_type_template_id_ddfca9c2_staticRenderFns,
          false,
          null,
          null,
          null,
        );

        /* harmony default export */ var pluginB = pluginB_component.exports;
        // CONCATENATED MODULE: ./src/dymanicComponent/index.js

        // 导出模块函数
        // 参数Vue: vue构造对象
        // 本函数中的this指向主程序 vue root实例的引用

        /* harmony default export */ var dymanicComponent = function (Vue) {
          // 动态添加组件
          // 组件为对象时 component 为必须的，其它参数与主程序协议一致
          this.$dynamicComponent.add(pluginA, 'dashboard');
          this.$dynamicComponent.add(
            {
              component: pluginB,
              cols: 2,
              icon: 'mdi-home',
              title: '自定义标题',
              type: 'card',
            },
            'dashboard',
          ); // 其他逻辑
        };
        // CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js

        /* harmony default export */ var entry_lib = (__webpack_exports__['default'] = dymanicComponent);

        /***/
      },

      /******/
    },
  )['default'];
});
