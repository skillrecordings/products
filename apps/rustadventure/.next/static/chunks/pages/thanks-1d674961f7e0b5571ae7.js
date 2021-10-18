;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [104],
  {
    7586: function (e, n, c) {
      'use strict'
      c.r(n),
        c.d(n, {
          __N_SSP: function () {
            return d
          },
        })
      var t = c(29901),
        r = c(22239),
        s = c(8118),
        a = c(99333),
        i = c.n(a),
        o = c(74965),
        l = c(61250),
        u = c(73656),
        d = !0
      n.default = function (e) {
        var n = e.displayEmail,
          c = (0, o.useViewer)().refreshViewer
        t.useEffect(function () {
          null === c || void 0 === c || c()
        }, [])
        var a = n && 'undefined' !== n ? '**'.concat(n, '**') : '',
          d = '# Thank you for purchasing '
            .concat(s.Z.defaultTitle, '. Please check your inbox.\n')
            .concat(
              a ? '## '.concat(a) : '',
              '\nAs a final step to access the course you need\nto check your inbox ',
            )
            .concat(
              a ? '('.concat(a, ')') : '',
              ' where you will find an email from `',
            )
            .concat(
              u.env.NEXT_PUBLIC_SUPPORT_EMAIL,
              '`\nwith a link to access your purchase and start learning.\n',
            ),
          h = function () {
            return (0, l.jsx)('svg', {
              height: '16',
              width: '16',
              viewBox: '0 0 16 16',
              xmlns: 'http://www.w3.org/2000/svg',
              children: (0, l.jsx)('g', {
                fill: '#fff',
                children: (0, l.jsx)('path', {
                  d: 'M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z',
                }),
              }),
            })
          },
          f = 'https://twitter.com/intent/tweet/?text=Just purchased '
            .concat(s.Z.siteUrl, ' by @')
            .concat(s.Z.twitter.handle),
          w = function () {
            return (0, l.jsxs)(l.Fragment, {
              children: [
                (0, l.jsx)('hr', {
                  className: 'mt-8 dark:border-gray-900 border-gray-100',
                }),
                (0, l.jsxs)('div', {
                  className: 'py-8',
                  children: [
                    (0, l.jsxs)('div', {
                      className: 'pb-4 font-semibold',
                      children: [
                        'Please consider telling your friends about ',
                        s.Z.siteUrl,
                        ', it would help me to get a word out. :)',
                      ],
                    }),
                    (0, l.jsxs)('a', {
                      href: f,
                      rel: 'noopener noreferrer',
                      target: '_blank',
                      className:
                        'text-white rounded-md inline-flex items-center px-3 py-2',
                      style: {background: '#2c90dc'},
                      children: [
                        (0, l.jsx)(h, {}),
                        ' ',
                        (0, l.jsx)('span', {
                          className: 'pl-2 font-medium',
                          children: 'Share with your friends!',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          }
        return (0, l.jsx)(r.Z, {
          meta: {title: 'Thank you!'},
          children: (0, l.jsxs)('div', {
            className: 'max-w-screen-sm mx-auto',
            children: [
              (0, l.jsx)(i(), {
                children: d,
                className: 'prose dark:prose-dark lg:prose-lg max-w-none',
              }),
              (0, l.jsx)(w, {}),
            ],
          }),
        })
      }
    },
    57286: function (e, n, c) {
      ;(window.__NEXT_P = window.__NEXT_P || []).push([
        '/thanks',
        function () {
          return c(7586)
        },
      ])
    },
  },
  function (e) {
    e.O(0, [358, 333, 239, 888, 179], function () {
      return (n = 57286), e((e.s = n))
      var n
    })
    var n = e.O()
    _N_E = n
  },
])
