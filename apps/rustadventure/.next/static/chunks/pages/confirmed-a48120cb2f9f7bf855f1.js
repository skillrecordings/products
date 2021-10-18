;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [377],
  {
    70858: function (t, e, n) {
      'use strict'
      n.r(e),
        n.d(e, {
          product: function () {
            return l
          },
          name: function () {
            return f
          },
          firstName: function () {
            return m
          },
          default: function () {
            return x
          },
        })
      var r = n(4389),
        o = n(47549),
        a = (n(29901), n(57522)),
        u = n(8118),
        i = n(22239),
        s = n(64682),
        c = ['components'],
        l = u.Z.defaultTitle,
        f = u.Z.author,
        m = u.Z.openGraph.profile.firstName,
        p = {product: l},
        d = function (t) {
          var e = t.children
          return (0, a.kt)(
            i.Z,
            {meta: {title: 'Subscription confirmed'}},
            (0, a.kt)(
              'div',
              {class: 'max-w-lg text-center space-y-5 mx-auto py-14'},
              (0, a.kt)(
                'div',
                {className: 'sm:w-40 w-32 mx-auto pb-4'},
                (0, a.kt)(s.T$, null),
              ),
              e,
              (0, a.kt)(
                'div',
                {class: 'flex flex-col pt-6 text-sm opacity-80 text-gray-900'},
                'Thanks,',
                (0, a.kt)('br', null),
                (0, a.kt)(s.Pc, {className: 'w-16 mx-auto pt-2'}),
              ),
            ),
          )
        }
      function x(t) {
        var e = t.components,
          n = (0, o.Z)(t, c)
        return (0, a.kt)(
          d,
          (0, r.Z)({}, p, n, {components: e, mdxType: 'MDXLayout'}),
          (0, a.kt)(
            'h1',
            {
              class:
                'uppercase sm:text-base text-sm font-medium tracking-wide text-brand-orange-600',
            },
            'Confirmed!',
          ),
          (0, a.kt)(
            'h2',
            {class: 'font-bold lg:text-3xl sm:text-2xl text-xl'},
            "You'll receive emails from me (",
            f,
            ') about Rust.',
          ),
          (0, a.kt)(
            'p',
            {class: 'opacity-80 prose'},
            "Every email we send will have a handy unsubscribe link at the bottom. Please feel free to use it if you don't want to receive emails about this!",
          ),
        )
      }
      x.isMDXComponent = !0
    },
    37941: function (t, e, n) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/confirmed',
        function () {
          return n(70858)
        },
      ])
    },
    47549: function (t, e, n) {
      'use strict'
      n.d(e, {
        Z: function () {
          return o
        },
      })
      var r = n(35404)
      function o(t, e) {
        if (null == t) return {}
        var n,
          o,
          a = (0, r.Z)(t, e)
        if (Object.getOwnPropertySymbols) {
          var u = Object.getOwnPropertySymbols(t)
          for (o = 0; o < u.length; o++)
            (n = u[o]),
              e.indexOf(n) >= 0 ||
                (Object.prototype.propertyIsEnumerable.call(t, n) &&
                  (a[n] = t[n]))
        }
        return a
      }
    },
  },
  function (t) {
    t.O(0, [358, 239, 888, 179], function () {
      return (e = 37941), t((t.s = e))
      var e
    })
    var e = t.O()
    _N_E = e
  },
])
