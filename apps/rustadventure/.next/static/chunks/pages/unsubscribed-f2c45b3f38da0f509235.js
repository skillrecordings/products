;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [742],
  {
    34288: function (n, e, t) {
      'use strict'
      t.r(e),
        t.d(e, {
          firstName: function () {
            return c
          },
          productTitle: function () {
            return l
          },
          Message: function () {
            return f
          },
          default: function () {
            return d
          },
        })
      var r = t(4389),
        u = t(47549),
        o = (t(29901), t(57522)),
        i = t(8118),
        s = t(22239),
        a = ['components'],
        c = i.Z.openGraph.profile.firstName,
        l = i.Z.defaultTitle,
        f = function () {
          return (0, o.kt)(
            'p',
            null,
            "You've been removed from the ",
            l,
            " email list and won't receive any more emails about it.",
          )
        },
        p = {firstName: c, Message: f},
        m = function (n) {
          var e = n.children
          return (0, o.kt)(
            s.Z,
            null,
            (0, o.kt)(
              'div',
              {
                className:
                  'prose dark:prose-dark prose-lg max-w-md mx-auto py-24',
              },
              e,
            ),
          )
        }
      function d(n) {
        var e = n.components,
          t = (0, u.Z)(n, a)
        return (0, o.kt)(
          m,
          (0, r.Z)({}, p, t, {components: e, mdxType: 'MDXLayout'}),
          (0, o.kt)('h1', null, 'Unsubscribed'),
          (0, o.kt)(f, {mdxType: 'Message'}),
          (0, o.kt)(
            'div',
            {className: 'italic'},
            'Thanks,',
            (0, o.kt)('br', null),
            c,
          ),
        )
      }
      d.isMDXComponent = !0
    },
    38049: function (n, e, t) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/unsubscribed',
        function () {
          return t(34288)
        },
      ])
    },
    47549: function (n, e, t) {
      'use strict'
      t.d(e, {
        Z: function () {
          return u
        },
      })
      var r = t(35404)
      function u(n, e) {
        if (null == n) return {}
        var t,
          u,
          o = (0, r.Z)(n, e)
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(n)
          for (u = 0; u < i.length; u++)
            (t = i[u]),
              e.indexOf(t) >= 0 ||
                (Object.prototype.propertyIsEnumerable.call(n, t) &&
                  (o[t] = n[t]))
        }
        return o
      }
    },
  },
  function (n) {
    n.O(0, [358, 239, 888, 179], function () {
      return (e = 38049), n((n.s = e))
      var e
    })
    var e = n.O()
    _N_E = e
  },
])
