((typeof self !== 'undefined' ? self : this)['webpackJsonpdymanicRouter'] =
  (typeof self !== 'undefined' ? self : this)['webpackJsonpdymanicRouter'] || []).push([
  [1],
  {
    /***/ '25c9': /***/ function (module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__);

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"4888ae4d-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dymanicRouter/pages/pageA.vue?vue&type=template&id=1879a3c8&
      var render = function () {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          'div',
          [
            _c('h1', [_vm._v('Page A')]),
            _c('router-link', { attrs: { to: { name: 'remote-page-b' } } }, [_vm._v('to pageB')]),
          ],
          1,
        );
      };
      var staticRenderFns = [];

      // CONCATENATED MODULE: ./src/dymanicRouter/pages/pageA.vue?vue&type=template&id=1879a3c8&

      // CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/dymanicRouter/pages/pageA.vue?vue&type=script&lang=js&
      //
      //
      //
      //
      //
      //
      //
      /* harmony default export */ var pageAvue_type_script_lang_js_ = {
        name: 'page-a',
      };
      // CONCATENATED MODULE: ./src/dymanicRouter/pages/pageA.vue?vue&type=script&lang=js&
      /* harmony default export */ var pages_pageAvue_type_script_lang_js_ = pageAvue_type_script_lang_js_;
      // EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
      var componentNormalizer = __webpack_require__('2877');

      // CONCATENATED MODULE: ./src/dymanicRouter/pages/pageA.vue

      /* normalize component */

      var component = Object(componentNormalizer['a' /* default */])(
        pages_pageAvue_type_script_lang_js_,
        render,
        staticRenderFns,
        false,
        null,
        null,
        null,
      );

      /* harmony default export */ var pageA = (__webpack_exports__['default'] = component.exports);

      /***/
    },

    /***/ '2877': /***/ function (module, __webpack_exports__, __webpack_require__) {
      'use strict';
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, 'a', function () {
        return normalizeComponent;
      });
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

      /***/
    },
  },
]);
