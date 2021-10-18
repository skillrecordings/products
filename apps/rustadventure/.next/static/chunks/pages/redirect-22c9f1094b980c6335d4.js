;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [284],
  {
    20916: function (e, r, t) {
      'use strict'
      t.r(r)
      var n = t(41669),
        c = (t(29901), t(22239)),
        o = t(61250)
      function u(e, r) {
        var t = Object.keys(e)
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e)
          r &&
            (n = n.filter(function (r) {
              return Object.getOwnPropertyDescriptor(e, r).enumerable
            })),
            t.push.apply(t, n)
        }
        return t
      }
      function i(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t = null != arguments[r] ? arguments[r] : {}
          r % 2
            ? u(Object(t), !0).forEach(function (r) {
                ;(0, n.Z)(e, r, t[r])
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
            : u(Object(t)).forEach(function (r) {
                Object.defineProperty(
                  e,
                  r,
                  Object.getOwnPropertyDescriptor(t, r),
                )
              })
        }
        return e
      }
      var f = function () {
        return null
      }
      ;(f.getLayout = function (e, r) {
        return (0, o.jsx)(c.Z, {children: (0, o.jsx)(e, i({}, r))})
      }),
        (r.default = f)
    },
    21907: function (e, r, t) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/redirect',
        function () {
          return t(20916)
        },
      ])
    },
  },
  function (e) {
    e.O(0, [358, 239, 888, 179], function () {
      return (r = 21907), e((e.s = r))
      var r
    })
    var r = e.O()
    _N_E = r
  },
])
