(('undefined' !== typeof self ? self : this)['webpackJsonpdymanicRouter'] =
  ('undefined' !== typeof self ? self : this)['webpackJsonpdymanicRouter'] || []).push([
  [1],
  {
    '25c9': function (e, t, n) {
      'use strict';
      n.r(t);
      var o = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t;
          return n(
            'div',
            { staticClass: 'page-a' },
            [
              n('h1', { staticClass: 'title' }, [e._v('Page A')]),
              n('router-link', { attrs: { to: { name: 'remote-page-b' } } }, [e._v('to pageB')]),
            ],
            1,
          );
        },
        s = [],
        r = (n('b3a6'), { name: 'page-a' }),
        i = r,
        a = n('2877'),
        c = Object(a['a'])(i, o, s, !1, null, null, null);
      t['default'] = c.exports;
    },
    2877: function (e, t, n) {
      'use strict';
      function o(e, t, n, o, s, r, i, a) {
        var c,
          f = 'function' === typeof e ? e.options : e;
        if (
          (t && ((f.render = t), (f.staticRenderFns = n), (f._compiled = !0)),
          o && (f.functional = !0),
          r && (f._scopeId = 'data-v-' + r),
          i
            ? ((c = function (e) {
                (e =
                  e ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext)),
                  e || 'undefined' === typeof __VUE_SSR_CONTEXT__ || (e = __VUE_SSR_CONTEXT__),
                  s && s.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(i);
              }),
              (f._ssrRegister = c))
            : s &&
              (c = a
                ? function () {
                    s.call(this, (f.functional ? this.parent : this).$root.$options.shadowRoot);
                  }
                : s),
          c)
        )
          if (f.functional) {
            f._injectStyles = c;
            var u = f.render;
            f.render = function (e, t) {
              return c.call(t), u(e, t);
            };
          } else {
            var l = f.beforeCreate;
            f.beforeCreate = l ? [].concat(l, c) : [c];
          }
        return { exports: e, options: f };
      }
      n.d(t, 'a', function () {
        return o;
      });
    },
    b3a6: function (e, t, n) {},
  },
]);
