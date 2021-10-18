;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [161],
  {
    76923: function (t, e, n) {
      'use strict'
      n.r(e),
        n.d(e, {
          firstName: function () {
            return l
          },
          email: function () {
            return f
          },
          default: function () {
            return d
          },
        })
      var r = n(4389),
        o = n(47549),
        a = (n(29901), n(57522)),
        s = n(8118),
        u = n(22239),
        c = n(64682),
        i = ['components'],
        l = s.Z.openGraph.profile.firstName,
        f = s.Z.email,
        m = {firstName: l},
        p = function (t) {
          var e = t.children
          return (0, a.kt)(
            u.Z,
            {meta: {title: 'Confirm your subscription'}},
            (0, a.kt)(
              'div',
              {class: 'max-w-2xl text-center space-y-5 mx-auto py-14'},
              (0, a.kt)(
                'div',
                {className: 'sm:w-40 w-32 mx-auto pb-4'},
                (0, a.kt)(c.EY, null),
              ),
              e,
              (0, a.kt)(
                'div',
                {class: 'flex flex-col pt-6 text-sm opacity-80 text-gray-900'},
                'Thanks,',
                (0, a.kt)('br', null),
                (0, a.kt)(c.Pc, {className: 'w-16 mx-auto pt-2'}),
              ),
            ),
          )
        }
      function d(t) {
        var e = t.components,
          n = (0, o.Z)(t, i)
        return (0, a.kt)(
          p,
          (0, r.Z)({}, m, n, {components: e, mdxType: 'MDXLayout'}),
          (0, a.kt)(
            'h1',
            {
              class:
                'uppercase sm:text-base text-sm font-medium tracking-wide text-brand-orange-600',
            },
            'Just one last step and you are subscribed...',
          ),
          (0, a.kt)(
            'h2',
            {class: 'font-bold lg:text-3xl sm:text-2xl text-xl'},
            "Please check your inbox for an email that just got sent. You'll need to click the confirmation link to receive any further emails.",
          ),
          (0, a.kt)(
            'p',
            {class: 'opacity-80 prose'},
            "If you don't see the email after a few minutes, you might check your spam folder or other filters and add ",
            (0, a.kt)('code', null, f),
            ' to your contacts.',
          ),
        )
      }
      d.isMDXComponent = !0
    },
    83277: function (t, e, n) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/confirm',
        function () {
          return n(76923)
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
          var s = Object.getOwnPropertySymbols(t)
          for (o = 0; o < s.length; o++)
            (n = s[o]),
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
      return (e = 83277), t((t.s = e))
      var e
    })
    var e = t.O()
    _N_E = e
  },
])
