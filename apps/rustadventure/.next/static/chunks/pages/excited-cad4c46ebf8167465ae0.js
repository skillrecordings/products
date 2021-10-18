;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [642],
  {
    44979: function (t, n, e) {
      'use strict'
      e.r(n),
        e.d(n, {
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
            return k
          },
        })
      var r = e(4389),
        o = e(47549),
        u = (e(29901), e(57522)),
        i = e(8118),
        a = e(22239),
        s = ['components'],
        c = i.Z.openGraph.profile.firstName,
        l = i.Z.defaultTitle,
        f = function () {
          return (0, u.kt)(
            'p',
            null,
            "It's great that you want to get started. I'm excited to share ",
            l,
            ' ',
            'with you.',
          )
        },
        p = {firstName: c, Message: f},
        d = function (t) {
          var n = t.children
          return (0, u.kt)(
            a.Z,
            null,
            (0, u.kt)(
              'div',
              {className: 'prose dark:prose-dark prose-lg mx-auto py-24'},
              n,
            ),
          )
        }
      function k(t) {
        var n = t.components,
          e = (0, o.Z)(t, s)
        return (0, u.kt)(
          d,
          (0, r.Z)({}, p, e, {components: n, mdxType: 'MDXLayout'}),
          (0, u.kt)('h1', null, 'Check Your Inbox!'),
          (0, u.kt)(f, {mdxType: 'Message'}),
          (0, u.kt)(
            'div',
            {className: 'italic'},
            'Thanks,',
            (0, u.kt)('br', null),
            c,
          ),
        )
      }
      k.isMDXComponent = !0
    },
    15626: function (t, n, e) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/excited',
        function () {
          return e(44979)
        },
      ])
    },
    47549: function (t, n, e) {
      'use strict'
      e.d(n, {
        Z: function () {
          return o
        },
      })
      var r = e(35404)
      function o(t, n) {
        if (null == t) return {}
        var e,
          o,
          u = (0, r.Z)(t, n)
        if (Object.getOwnPropertySymbols) {
          var i = Object.getOwnPropertySymbols(t)
          for (o = 0; o < i.length; o++)
            (e = i[o]),
              n.indexOf(e) >= 0 ||
                (Object.prototype.propertyIsEnumerable.call(t, e) &&
                  (u[e] = t[e]))
        }
        return u
      }
    },
  },
  function (t) {
    t.O(0, [358, 239, 888, 179], function () {
      return (n = 15626), t((t.s = n))
      var n
    })
    var n = t.O()
    _N_E = n
  },
])
