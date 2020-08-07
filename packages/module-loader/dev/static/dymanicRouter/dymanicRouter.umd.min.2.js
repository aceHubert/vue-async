(('undefined' !== typeof self ? self : this)['webpackJsonpdymanicRouter'] =
  ('undefined' !== typeof self ? self : this)['webpackJsonpdymanicRouter'] || []).push([
  [2],
  {
    2877: function (e, t, n) {
      'use strict';
      function s(e, t, n, s, o, i, r, a) {
        var c,
          f = 'function' === typeof e ? e.options : e;
        if (
          (t && ((f.render = t), (f.staticRenderFns = n), (f._compiled = !0)),
          s && (f.functional = !0),
          i && (f._scopeId = 'data-v-' + i),
          r
            ? ((c = function (e) {
                (e =
                  e ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext)),
                  e || 'undefined' === typeof __VUE_SSR_CONTEXT__ || (e = __VUE_SSR_CONTEXT__),
                  o && o.call(this, e),
                  e && e._registeredComponents && e._registeredComponents.add(r);
              }),
              (f._ssrRegister = c))
            : o &&
              (c = a
                ? function () {
                    o.call(this, (f.functional ? this.parent : this).$root.$options.shadowRoot);
                  }
                : o),
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
        return s;
      });
    },
    '6a7e': function (e, t, n) {},
    '88c6': function (e, t, n) {
      'use strict';
      n.r(t);
      var s = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t;
          return n(
            'div',
            { staticClass: 'page-b' },
            [
              n('h1', { staticClass: 'title' }, [e._v('Page B')]),
              n('router-link', { attrs: { to: '/' } }, [e._v('to index')]),
            ],
            1,
          );
        },
        o = [],
        i = (n('6a7e'), { name: 'page-b' }),
        r = i,
        a = n('2877'),
        c = Object(a['a'])(r, s, o, !1, null, null, null);
      t['default'] = c.exports;
    },
  },
]);
