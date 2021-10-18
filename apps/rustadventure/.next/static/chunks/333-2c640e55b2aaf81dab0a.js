;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [333],
  {
    69344: function (e) {
      'use strict'
      e.exports = function (e) {
        if (e) throw e
      }
    },
    48692: function (e, n) {
      'use strict'
      ;(n.parse = function (e) {
        var n,
          t = [],
          r = String(e || ''),
          i = r.indexOf(','),
          o = 0,
          l = !1
        for (; !l; )
          -1 === i && ((i = r.length), (l = !0)),
            (!(n = r.slice(o, i).trim()) && l) || t.push(n),
            (o = i + 1),
            (i = r.indexOf(',', o))
        return t
      }),
        (n.stringify = function (e, n) {
          var t = n || {},
            r = !1 === t.padLeft ? '' : ' ',
            i = t.padRight ? ' ' : ''
          '' === e[e.length - 1] && (e = e.concat(''))
          return e.join(i + ',' + r).trim()
        })
    },
    93405: function (e) {
      'use strict'
      var n = Object.prototype.hasOwnProperty,
        t = Object.prototype.toString,
        r = Object.defineProperty,
        i = Object.getOwnPropertyDescriptor,
        o = function (e) {
          return 'function' === typeof Array.isArray
            ? Array.isArray(e)
            : '[object Array]' === t.call(e)
        },
        l = function (e) {
          if (!e || '[object Object]' !== t.call(e)) return !1
          var r,
            i = n.call(e, 'constructor'),
            o =
              e.constructor &&
              e.constructor.prototype &&
              n.call(e.constructor.prototype, 'isPrototypeOf')
          if (e.constructor && !i && !o) return !1
          for (r in e);
          return 'undefined' === typeof r || n.call(e, r)
        },
        u = function (e, n) {
          r && '__proto__' === n.name
            ? r(e, n.name, {
                enumerable: !0,
                configurable: !0,
                value: n.newValue,
                writable: !0,
              })
            : (e[n.name] = n.newValue)
        },
        a = function (e, t) {
          if ('__proto__' === t) {
            if (!n.call(e, t)) return
            if (i) return i(e, t).value
          }
          return e[t]
        }
      e.exports = function e() {
        var n,
          t,
          r,
          i,
          s,
          c,
          f = arguments[0],
          p = 1,
          d = arguments.length,
          h = !1
        for (
          'boolean' === typeof f &&
            ((h = f), (f = arguments[1] || {}), (p = 2)),
            (null == f || ('object' !== typeof f && 'function' !== typeof f)) &&
              (f = {});
          p < d;
          ++p
        )
          if (null != (n = arguments[p]))
            for (t in n)
              (r = a(f, t)),
                f !== (i = a(n, t)) &&
                  (h && i && (l(i) || (s = o(i)))
                    ? (s
                        ? ((s = !1), (c = r && o(r) ? r : []))
                        : (c = r && l(r) ? r : {}),
                      u(f, {name: t, newValue: e(h, c, i)}))
                    : 'undefined' !== typeof i && u(f, {name: t, newValue: i}))
        return f
      }
    },
    90158: function (e) {
      var n = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,
        t = /\n/g,
        r = /^\s*/,
        i = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,
        o = /^:\s*/,
        l = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,
        u = /^[;\s]*/,
        a = /^\s+|\s+$/g,
        s = ''
      function c(e) {
        return e ? e.replace(a, s) : s
      }
      e.exports = function (e, a) {
        if ('string' !== typeof e)
          throw new TypeError('First argument must be a string')
        if (!e) return []
        a = a || {}
        var f = 1,
          p = 1
        function d(e) {
          var n = e.match(t)
          n && (f += n.length)
          var r = e.lastIndexOf('\n')
          p = ~r ? e.length - r : p + e.length
        }
        function h() {
          var e = {line: f, column: p}
          return function (n) {
            return (n.position = new m(e)), y(), n
          }
        }
        function m(e) {
          ;(this.start = e),
            (this.end = {line: f, column: p}),
            (this.source = a.source)
        }
        m.prototype.content = e
        var g = []
        function v(n) {
          var t = new Error(a.source + ':' + f + ':' + p + ': ' + n)
          if (
            ((t.reason = n),
            (t.filename = a.source),
            (t.line = f),
            (t.column = p),
            (t.source = e),
            !a.silent)
          )
            throw t
          g.push(t)
        }
        function x(n) {
          var t = n.exec(e)
          if (t) {
            var r = t[0]
            return d(r), (e = e.slice(r.length)), t
          }
        }
        function y() {
          x(r)
        }
        function k(e) {
          var n
          for (e = e || []; (n = b()); ) !1 !== n && e.push(n)
          return e
        }
        function b() {
          var n = h()
          if ('/' == e.charAt(0) && '*' == e.charAt(1)) {
            for (
              var t = 2;
              s != e.charAt(t) &&
              ('*' != e.charAt(t) || '/' != e.charAt(t + 1));

            )
              ++t
            if (((t += 2), s === e.charAt(t - 1)))
              return v('End of comment missing')
            var r = e.slice(2, t - 2)
            return (
              (p += 2),
              d(r),
              (e = e.slice(t)),
              (p += 2),
              n({type: 'comment', comment: r})
            )
          }
        }
        function w() {
          var e = h(),
            t = x(i)
          if (t) {
            if ((b(), !x(o))) return v("property missing ':'")
            var r = x(l),
              a = e({
                type: 'declaration',
                property: c(t[0].replace(n, s)),
                value: r ? c(r[0].replace(n, s)) : s,
              })
            return x(u), a
          }
        }
        return (
          y(),
          (function () {
            var e,
              n = []
            for (k(n); (e = w()); ) !1 !== e && (n.push(e), k(n))
            return n
          })()
        )
      }
    },
    84853: function (e) {
      e.exports = function (e) {
        return (
          null != e &&
          null != e.constructor &&
          'function' === typeof e.constructor.isBuffer &&
          e.constructor.isBuffer(e)
        )
      }
    },
    42125: function (e) {
      'use strict'
      e.exports = (e) => {
        if ('[object Object]' !== Object.prototype.toString.call(e)) return !1
        const n = Object.getPrototypeOf(e)
        return null === n || n === Object.prototype
      }
    },
    49721: function (e, n, t) {
      'use strict'
      var r = t(99273)
      e.exports = function (e, n) {
        return (function (e) {
          return n
          function n(n) {
            var t = n && o(n)
            return t && i.call(e, t) ? e[t] : null
          }
        })(
          (function (e) {
            var n = {}
            if (!e || !e.type)
              throw new Error('mdast-util-definitions expected node')
            return r(e, 'definition', t), n
            function t(e) {
              var t = o(e.identifier)
              i.call(n, t) || (n[t] = e)
            }
          })(e),
        )
      }
      var i = {}.hasOwnProperty
      function o(e) {
        return e.toUpperCase()
      }
    },
    50110: function (e, n, t) {
      'use strict'
      e.exports = function (e, n, t) {
        'string' !== typeof n && ((t = n), (n = void 0))
        return (function (e) {
          var n = e || {},
            t = (function (e, n) {
              var t = -1
              for (; ++t < n.length; ) d(e, n[t])
              return e
            })(
              {
                transforms: [],
                canContainEols: [
                  'emphasis',
                  'fragment',
                  'heading',
                  'paragraph',
                  'strong',
                ],
                enter: {
                  autolink: v(pe),
                  autolinkProtocol: _,
                  autolinkEmail: _,
                  atxHeading: v(ae),
                  blockQuote: v(re),
                  characterEscape: _,
                  characterReference: _,
                  codeFenced: v(ie),
                  codeFencedFenceInfo: x,
                  codeFencedFenceMeta: x,
                  codeIndented: v(ie, x),
                  codeText: v(oe, x),
                  codeTextData: _,
                  data: _,
                  codeFlowValue: _,
                  definition: v(le),
                  definitionDestinationString: x,
                  definitionLabelString: x,
                  definitionTitleString: x,
                  emphasis: v(ue),
                  hardBreakEscape: v(se),
                  hardBreakTrailing: v(se),
                  htmlFlow: v(ce, x),
                  htmlFlowData: _,
                  htmlText: v(ce, x),
                  htmlTextData: _,
                  image: v(fe),
                  label: x,
                  link: v(pe),
                  listItem: v(he),
                  listItemValue: E,
                  listOrdered: v(de, S),
                  listUnordered: v(de),
                  paragraph: v(me),
                  reference: Z,
                  referenceString: x,
                  resourceDestinationString: x,
                  resourceTitleString: x,
                  setextHeading: v(ae),
                  strong: v(ge),
                  thematicBreak: v(xe),
                },
                exit: {
                  atxHeading: k(),
                  atxHeadingSequence: L,
                  autolink: k(),
                  autolinkEmail: te,
                  autolinkProtocol: ne,
                  blockQuote: k(),
                  characterEscapeValue: R,
                  characterReferenceMarkerHexadecimal: G,
                  characterReferenceMarkerNumeric: G,
                  characterReferenceValue: ee,
                  codeFenced: k(T),
                  codeFencedFence: P,
                  codeFencedFenceInfo: C,
                  codeFencedFenceMeta: F,
                  codeFlowValue: R,
                  codeIndented: k(A),
                  codeText: k(q),
                  codeTextData: R,
                  data: R,
                  definition: k(),
                  definitionDestinationString: I,
                  definitionLabelString: O,
                  definitionTitleString: D,
                  emphasis: k(),
                  hardBreakEscape: k(H),
                  hardBreakTrailing: k(H),
                  htmlFlow: k(U),
                  htmlFlowData: R,
                  htmlText: k(N),
                  htmlTextData: R,
                  image: k($),
                  label: Q,
                  labelText: W,
                  lineEnding: j,
                  link: k(V),
                  listItem: k(),
                  listOrdered: k(),
                  listUnordered: k(),
                  paragraph: k(),
                  referenceString: J,
                  resourceDestinationString: K,
                  resourceTitleString: X,
                  resource: Y,
                  setextHeading: k(B),
                  setextHeadingLineSequence: z,
                  setextHeadingText: M,
                  strong: k(),
                  thematicBreak: k(),
                },
              },
              n.mdastExtensions || [],
            ),
            a = {}
          return s
          function s(e) {
            for (
              var n,
                r = {type: 'root', children: []},
                l = [],
                u = [],
                a = -1,
                s = {
                  stack: [r],
                  tokenStack: l,
                  config: t,
                  enter: y,
                  exit: b,
                  buffer: x,
                  resume: w,
                  setData: h,
                  getData: m,
                };
              ++a < e.length;

            )
              ('listOrdered' !== e[a][1].type &&
                'listUnordered' !== e[a][1].type) ||
                ('enter' === e[a][0] ? u.push(a) : (a = c(e, u.pop(a), a)))
            for (a = -1; ++a < e.length; )
              (n = t[e[a][0]]),
                o.call(n, e[a][1].type) &&
                  n[e[a][1].type].call(
                    i({sliceSerialize: e[a][2].sliceSerialize}, s),
                    e[a][1],
                  )
            if (l.length)
              throw new Error(
                'Cannot close document, a token (`' +
                  l[l.length - 1].type +
                  '`, ' +
                  p({start: l[l.length - 1].start, end: l[l.length - 1].end}) +
                  ') is still open',
              )
            for (
              r.position = {
                start: g(
                  e.length ? e[0][1].start : {line: 1, column: 1, offset: 0},
                ),
                end: g(
                  e.length
                    ? e[e.length - 2][1].end
                    : {line: 1, column: 1, offset: 0},
                ),
              },
                a = -1;
              ++a < t.transforms.length;

            )
              r = t.transforms[a](r) || r
            return r
          }
          function c(e, n, t) {
            for (var r, i, o, l, u, a, s, c = n - 1, f = -1, p = !1; ++c <= t; )
              if (
                ('listUnordered' === (u = e[c])[1].type ||
                'listOrdered' === u[1].type ||
                'blockQuote' === u[1].type
                  ? ('enter' === u[0] ? f++ : f--, (s = void 0))
                  : 'lineEndingBlank' === u[1].type
                  ? 'enter' === u[0] &&
                    (!r || s || f || a || (a = c), (s = void 0))
                  : 'linePrefix' === u[1].type ||
                    'listItemValue' === u[1].type ||
                    'listItemMarker' === u[1].type ||
                    'listItemPrefix' === u[1].type ||
                    'listItemPrefixWhitespace' === u[1].type ||
                    (s = void 0),
                (!f && 'enter' === u[0] && 'listItemPrefix' === u[1].type) ||
                  (-1 === f &&
                    'exit' === u[0] &&
                    ('listUnordered' === u[1].type ||
                      'listOrdered' === u[1].type)))
              ) {
                if (r) {
                  for (i = c, o = void 0; i--; )
                    if (
                      'lineEnding' === (l = e[i])[1].type ||
                      'lineEndingBlank' === l[1].type
                    ) {
                      if ('exit' === l[0]) continue
                      o && ((e[o][1].type = 'lineEndingBlank'), (p = !0)),
                        (l[1].type = 'lineEnding'),
                        (o = i)
                    } else if (
                      'linePrefix' !== l[1].type &&
                      'blockQuotePrefix' !== l[1].type &&
                      'blockQuotePrefixWhitespace' !== l[1].type &&
                      'blockQuoteMarker' !== l[1].type &&
                      'listItemIndent' !== l[1].type
                    )
                      break
                  a && (!o || a < o) && (r._spread = !0),
                    (r.end = g(o ? e[o][1].start : u[1].end)),
                    e.splice(o || c, 0, ['exit', r, u[2]]),
                    c++,
                    t++
                }
                'listItemPrefix' === u[1].type &&
                  ((r = {type: 'listItem', _spread: !1, start: g(u[1].start)}),
                  e.splice(c, 0, ['enter', r, u[2]]),
                  c++,
                  t++,
                  (a = void 0),
                  (s = !0))
              }
            return (e[n][1]._spread = p), t
          }
          function h(e, n) {
            a[e] = n
          }
          function m(e) {
            return a[e]
          }
          function g(e) {
            return {line: e.line, column: e.column, offset: e.offset}
          }
          function v(e, n) {
            return t
            function t(t) {
              y.call(this, e(t), t), n && n.call(this, t)
            }
          }
          function x() {
            this.stack.push({type: 'fragment', children: []})
          }
          function y(e, n) {
            return (
              this.stack[this.stack.length - 1].children.push(e),
              this.stack.push(e),
              this.tokenStack.push(n),
              (e.position = {start: g(n.start)}),
              e
            )
          }
          function k(e) {
            return n
            function n(n) {
              e && e.call(this, n), b.call(this, n)
            }
          }
          function b(e) {
            var n = this.stack.pop(),
              t = this.tokenStack.pop()
            if (!t)
              throw new Error(
                'Cannot close `' +
                  e.type +
                  '` (' +
                  p({start: e.start, end: e.end}) +
                  '): it\u2019s not open',
              )
            if (t.type !== e.type)
              throw new Error(
                'Cannot close `' +
                  e.type +
                  '` (' +
                  p({start: e.start, end: e.end}) +
                  '): a different token (`' +
                  t.type +
                  '`, ' +
                  p({start: t.start, end: t.end}) +
                  ') is open',
              )
            return (n.position.end = g(e.end)), n
          }
          function w() {
            return r(this.stack.pop())
          }
          function S() {
            h('expectingFirstListItemValue', !0)
          }
          function E(e) {
            m('expectingFirstListItemValue') &&
              ((this.stack[this.stack.length - 2].start = parseInt(
                this.sliceSerialize(e),
                10,
              )),
              h('expectingFirstListItemValue'))
          }
          function C() {
            var e = this.resume()
            this.stack[this.stack.length - 1].lang = e
          }
          function F() {
            var e = this.resume()
            this.stack[this.stack.length - 1].meta = e
          }
          function P() {
            m('flowCodeInside') || (this.buffer(), h('flowCodeInside', !0))
          }
          function T() {
            var e = this.resume()
            ;(this.stack[this.stack.length - 1].value = e.replace(
              /^(\r?\n|\r)|(\r?\n|\r)$/g,
              '',
            )),
              h('flowCodeInside')
          }
          function A() {
            var e = this.resume()
            this.stack[this.stack.length - 1].value = e
          }
          function O(e) {
            var n = this.resume()
            ;(this.stack[this.stack.length - 1].label = n),
              (this.stack[this.stack.length - 1].identifier = l(
                this.sliceSerialize(e),
              ).toLowerCase())
          }
          function D() {
            var e = this.resume()
            this.stack[this.stack.length - 1].title = e
          }
          function I() {
            var e = this.resume()
            this.stack[this.stack.length - 1].url = e
          }
          function L(e) {
            this.stack[this.stack.length - 1].depth ||
              (this.stack[this.stack.length - 1].depth =
                this.sliceSerialize(e).length)
          }
          function M() {
            h('setextHeadingSlurpLineEnding', !0)
          }
          function z(e) {
            this.stack[this.stack.length - 1].depth =
              61 === this.sliceSerialize(e).charCodeAt(0) ? 1 : 2
          }
          function B() {
            h('setextHeadingSlurpLineEnding')
          }
          function _(e) {
            var n = this.stack[this.stack.length - 1].children,
              t = n[n.length - 1]
            ;(t && 'text' === t.type) ||
              (((t = ve()).position = {start: g(e.start)}),
              this.stack[this.stack.length - 1].children.push(t)),
              this.stack.push(t)
          }
          function R(e) {
            var n = this.stack.pop()
            ;(n.value += this.sliceSerialize(e)), (n.position.end = g(e.end))
          }
          function j(e) {
            var n = this.stack[this.stack.length - 1]
            if (m('atHardBreak'))
              return (
                (n.children[n.children.length - 1].position.end = g(e.end)),
                void h('atHardBreak')
              )
            !m('setextHeadingSlurpLineEnding') &&
              t.canContainEols.indexOf(n.type) > -1 &&
              (_.call(this, e), R.call(this, e))
          }
          function H() {
            h('atHardBreak', !0)
          }
          function U() {
            var e = this.resume()
            this.stack[this.stack.length - 1].value = e
          }
          function N() {
            var e = this.resume()
            this.stack[this.stack.length - 1].value = e
          }
          function q() {
            var e = this.resume()
            this.stack[this.stack.length - 1].value = e
          }
          function V() {
            var e = this.stack[this.stack.length - 1]
            m('inReference')
              ? ((e.type += 'Reference'),
                (e.referenceType = m('referenceType') || 'shortcut'),
                delete e.url,
                delete e.title)
              : (delete e.identifier, delete e.label, delete e.referenceType),
              h('referenceType')
          }
          function $() {
            var e = this.stack[this.stack.length - 1]
            m('inReference')
              ? ((e.type += 'Reference'),
                (e.referenceType = m('referenceType') || 'shortcut'),
                delete e.url,
                delete e.title)
              : (delete e.identifier, delete e.label, delete e.referenceType),
              h('referenceType')
          }
          function W(e) {
            this.stack[this.stack.length - 2].identifier = l(
              this.sliceSerialize(e),
            ).toLowerCase()
          }
          function Q() {
            var e = this.stack[this.stack.length - 1],
              n = this.resume()
            ;(this.stack[this.stack.length - 1].label = n),
              h('inReference', !0),
              'link' === this.stack[this.stack.length - 1].type
                ? (this.stack[this.stack.length - 1].children = e.children)
                : (this.stack[this.stack.length - 1].alt = n)
          }
          function K() {
            var e = this.resume()
            this.stack[this.stack.length - 1].url = e
          }
          function X() {
            var e = this.resume()
            this.stack[this.stack.length - 1].title = e
          }
          function Y() {
            h('inReference')
          }
          function Z() {
            h('referenceType', 'collapsed')
          }
          function J(e) {
            var n = this.resume()
            ;(this.stack[this.stack.length - 1].label = n),
              (this.stack[this.stack.length - 1].identifier = l(
                this.sliceSerialize(e),
              ).toLowerCase()),
              h('referenceType', 'full')
          }
          function G(e) {
            h('characterReferenceType', e.type)
          }
          function ee(e) {
            var n,
              t,
              r = this.sliceSerialize(e),
              i = m('characterReferenceType')
            i
              ? ((n = u(r, 'characterReferenceMarkerNumeric' === i ? 10 : 16)),
                h('characterReferenceType'))
              : (n = f(r)),
              ((t = this.stack.pop()).value += n),
              (t.position.end = g(e.end))
          }
          function ne(e) {
            R.call(this, e),
              (this.stack[this.stack.length - 1].url = this.sliceSerialize(e))
          }
          function te(e) {
            R.call(this, e),
              (this.stack[this.stack.length - 1].url =
                'mailto:' + this.sliceSerialize(e))
          }
          function re() {
            return {type: 'blockquote', children: []}
          }
          function ie() {
            return {type: 'code', lang: null, meta: null, value: ''}
          }
          function oe() {
            return {type: 'inlineCode', value: ''}
          }
          function le() {
            return {
              type: 'definition',
              identifier: '',
              label: null,
              title: null,
              url: '',
            }
          }
          function ue() {
            return {type: 'emphasis', children: []}
          }
          function ae() {
            return {type: 'heading', depth: void 0, children: []}
          }
          function se() {
            return {type: 'break'}
          }
          function ce() {
            return {type: 'html', value: ''}
          }
          function fe() {
            return {type: 'image', title: null, url: '', alt: null}
          }
          function pe() {
            return {type: 'link', title: null, url: '', children: []}
          }
          function de(e) {
            return {
              type: 'list',
              ordered: 'listOrdered' === e.type,
              start: null,
              spread: e._spread,
              children: [],
            }
          }
          function he(e) {
            return {
              type: 'listItem',
              spread: e._spread,
              checked: null,
              children: [],
            }
          }
          function me() {
            return {type: 'paragraph', children: []}
          }
          function ge() {
            return {type: 'strong', children: []}
          }
          function ve() {
            return {type: 'text', value: ''}
          }
          function xe() {
            return {type: 'thematicBreak'}
          }
        })(t)(c(a(t).document().write(s()(e, n, !0))))
      }
      var r = t(22162),
        i = t(90399),
        o = t(96200),
        l = t(77158),
        u = t(25256),
        a = t(41401),
        s = t(47435),
        c = t(70450),
        f = t(18889),
        p = t(1839)
      function d(e, n) {
        var t, r
        for (t in n)
          (r = o.call(e, t) ? e[t] : (e[t] = {})),
            'canContainEols' === t || 'transforms' === t
              ? (e[t] = [].concat(r, n[t]))
              : Object.assign(r, n[t])
      }
    },
    67814: function (e, n, t) {
      'use strict'
      e.exports = t(50110)
    },
    7498: function (e, n, t) {
      'use strict'
      e.exports = t(78680)
    },
    60071: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        var t,
          i,
          o = n.children || [],
          l = o.length,
          u = [],
          a = -1
        for (; ++a < l; )
          (t = r(e, o[a], n)) &&
            (a &&
              'break' === o[a - 1].type &&
              (t.value && (t.value = t.value.replace(/^\s+/, '')),
              (i = t.children && t.children[0]) &&
                i.value &&
                (i.value = i.value.replace(/^\s+/, ''))),
            (u = u.concat(t)))
        return u
      }
      var r = t(43358)
    },
    20478: function (e, n, t) {
      'use strict'
      e.exports = function (e) {
        var n,
          t,
          l,
          u,
          a = e.footnoteById,
          s = e.footnoteOrder,
          c = s.length,
          f = -1,
          p = []
        for (; ++f < c; )
          (n = a[s[f].toUpperCase()]) &&
            ((l = n.children.concat()),
            (u = l[l.length - 1]),
            (t = {
              type: 'link',
              url: '#fnref-' + n.identifier,
              data: {hProperties: {className: ['footnote-backref']}},
              children: [{type: 'text', value: '\u21a9'}],
            }),
            (u && 'paragraph' === u.type) ||
              ((u = {type: 'paragraph', children: []}), l.push(u)),
            u.children.push(t),
            p.push({
              type: 'listItem',
              data: {hProperties: {id: 'fn-' + n.identifier}},
              children: l,
              position: n.position,
            }))
        if (0 === p.length) return null
        return e(
          null,
          'div',
          {className: ['footnotes']},
          o([r(e), i(e, {type: 'list', ordered: !0, children: p})], !0),
        )
      }
      var r = t(95987),
        i = t(64411),
        o = t(32837)
    },
    65561: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        return e(n, 'blockquote', r(i(e, n), !0))
      }
      var r = t(32837),
        i = t(60071)
    },
    1475: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        return [e(n, 'br'), r('text', '\n')]
      }
      var r = t(64992)
    },
    3324: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        var t,
          i = n.value ? n.value + '\n' : '',
          o = n.lang && n.lang.match(/^[^ \t]+(?=[ \t]|$)/),
          l = {}
        o && (l.className = ['language-' + o])
        ;(t = e(n, 'code', l, [r('text', i)])),
          n.meta && (t.data = {meta: n.meta})
        return e(n.position, 'pre', [t])
      }
      var r = t(64992)
    },
    3262: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        return e(n, 'del', r(e, n))
      }
      var r = t(60071)
    },
    71691: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        return e(n, 'em', r(e, n))
      }
      var r = t(60071)
    },
    66078: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        var t = e.footnoteOrder,
          i = String(n.identifier)
        ;-1 === t.indexOf(i) && t.push(i)
        return e(n.position, 'sup', {id: 'fnref-' + i}, [
          e(n, 'a', {href: '#fn-' + i, className: ['footnote-ref']}, [
            r('text', n.label || i),
          ]),
        ])
      }
      var r = t(64992)
    },
    66876: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        var t = e.footnoteById,
          i = e.footnoteOrder,
          o = 1
        for (; o in t; ) o++
        return (
          (o = String(o)),
          i.push(o),
          (t[o] = {
            type: 'footnoteDefinition',
            identifier: o,
            children: [{type: 'paragraph', children: n.children}],
            position: n.position,
          }),
          r(e, {type: 'footnoteReference', identifier: o, position: n.position})
        )
      }
      var r = t(66078)
    },
    33472: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        return e(n, 'h' + n.depth, r(e, n))
      }
      var r = t(60071)
    },
    69517: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        return e.dangerous ? e.augment(n, r('raw', n.value)) : null
      }
      var r = t(64992)
    },
    12278: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        var t,
          o = e.definition(n.identifier)
        if (!o) return i(e, n)
        ;(t = {src: r(o.url || ''), alt: n.alt}),
          null !== o.title && void 0 !== o.title && (t.title = o.title)
        return e(n, 'img', t)
      }
      var r = t(77385),
        i = t(28875)
    },
    85166: function (e, n, t) {
      'use strict'
      var r = t(77385)
      e.exports = function (e, n) {
        var t = {src: r(n.url), alt: n.alt}
        null !== n.title && void 0 !== n.title && (t.title = n.title)
        return e(n, 'img', t)
      }
    },
    3828: function (e, n, t) {
      'use strict'
      function r() {
        return null
      }
      e.exports = {
        blockquote: t(65561),
        break: t(1475),
        code: t(3324),
        delete: t(3262),
        emphasis: t(71691),
        footnoteReference: t(66078),
        footnote: t(66876),
        heading: t(33472),
        html: t(69517),
        imageReference: t(12278),
        image: t(85166),
        inlineCode: t(79697),
        linkReference: t(96525),
        link: t(69379),
        listItem: t(85093),
        list: t(64411),
        paragraph: t(53170),
        root: t(61986),
        strong: t(71330),
        table: t(92724),
        text: t(557),
        thematicBreak: t(95987),
        toml: r,
        yaml: r,
        definition: r,
        footnoteDefinition: r,
      }
    },
    79697: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        var t = n.value.replace(/\r?\n|\r/g, ' ')
        return e(n, 'code', [r('text', t)])
      }
      var r = t(64992)
    },
    96525: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        var t,
          l = e.definition(n.identifier)
        if (!l) return i(e, n)
        ;(t = {href: r(l.url || '')}),
          null !== l.title && void 0 !== l.title && (t.title = l.title)
        return e(n, 'a', t, o(e, n))
      }
      var r = t(77385),
        i = t(28875),
        o = t(60071)
    },
    69379: function (e, n, t) {
      'use strict'
      var r = t(77385),
        i = t(60071)
      e.exports = function (e, n) {
        var t = {href: r(n.url)}
        null !== n.title && void 0 !== n.title && (t.title = n.title)
        return e(n, 'a', t, i(e, n))
      }
    },
    85093: function (e, n, t) {
      'use strict'
      e.exports = function (e, n, t) {
        var l,
          u,
          a,
          s = i(e, n),
          c = s[0],
          f = t
            ? (function (e) {
                var n = e.spread,
                  t = e.children,
                  r = t.length,
                  i = -1
                for (; !n && ++i < r; ) n = o(t[i])
                return n
              })(t)
            : o(n),
          p = {},
          d = []
        'boolean' === typeof n.checked &&
          ((c && 'p' === c.tagName) || ((c = e(null, 'p', [])), s.unshift(c)),
          c.children.length > 0 && c.children.unshift(r('text', ' ')),
          c.children.unshift(
            e(null, 'input', {
              type: 'checkbox',
              checked: n.checked,
              disabled: !0,
            }),
          ),
          (p.className = ['task-list-item']))
        ;(l = s.length), (u = -1)
        for (; ++u < l; )
          (a = s[u]),
            (f || 0 !== u || 'p' !== a.tagName) && d.push(r('text', '\n')),
            'p' !== a.tagName || f ? d.push(a) : (d = d.concat(a.children))
        l && (f || 'p' !== a.tagName) && d.push(r('text', '\n'))
        return e(n, 'li', p, d)
      }
      var r = t(64992),
        i = t(60071)
      function o(e) {
        var n = e.spread
        return void 0 === n || null === n ? e.children.length > 1 : n
      }
    },
    64411: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        var t,
          o,
          l = {},
          u = n.ordered ? 'ol' : 'ul',
          a = -1
        'number' === typeof n.start && 1 !== n.start && (l.start = n.start)
        ;(t = i(e, n)), (o = t.length)
        for (; ++a < o; )
          if (
            t[a].properties.className &&
            -1 !== t[a].properties.className.indexOf('task-list-item')
          ) {
            l.className = ['contains-task-list']
            break
          }
        return e(n, u, l, r(t, !0))
      }
      var r = t(32837),
        i = t(60071)
    },
    53170: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        return e(n, 'p', r(e, n))
      }
      var r = t(60071)
    },
    61986: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        return e.augment(n, r('root', i(o(e, n))))
      }
      var r = t(64992),
        i = t(32837),
        o = t(60071)
    },
    71330: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        return e(n, 'strong', r(e, n))
      }
      var r = t(60071)
    },
    92724: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        var t,
          l,
          u,
          a,
          s,
          c = n.children,
          f = c.length,
          p = n.align || [],
          d = p.length,
          h = []
        for (; f--; ) {
          for (
            l = c[f].children,
              a = 0 === f ? 'th' : 'td',
              t = d || l.length,
              u = [];
            t--;

          )
            (s = l[t]), (u[t] = e(s, a, {align: p[t]}, s ? o(e, s) : []))
          h[f] = e(c[f], 'tr', i(u, !0))
        }
        return e(
          n,
          'table',
          i(
            [e(h[0].position, 'thead', i([h[0]], !0))].concat(
              h[1]
                ? e(
                    {start: r.start(h[1]), end: r.end(h[h.length - 1])},
                    'tbody',
                    i(h.slice(1), !0),
                  )
                : [],
            ),
            !0,
          ),
        )
      }
      var r = t(89225),
        i = t(32837),
        o = t(60071)
    },
    557: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        return e.augment(
          n,
          r('text', String(n.value).replace(/[ \t]*(\r?\n|\r)[ \t]*/g, '$1')),
        )
      }
      var r = t(64992)
    },
    95987: function (e) {
      'use strict'
      e.exports = function (e, n) {
        return e(n, 'hr')
      }
    },
    78680: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        var t = (function (e, n) {
            var t = n || {}
            void 0 === t.allowDangerousHTML ||
              p ||
              ((p = !0),
              console.warn(
                'mdast-util-to-hast: deprecation: `allowDangerousHTML` is nonstandard, use `allowDangerousHtml` instead',
              ))
            var r = t.allowDangerousHtml || t.allowDangerousHTML,
              a = {}
            return (
              (d.dangerous = r),
              (d.definition = u(e)),
              (d.footnoteById = a),
              (d.footnoteOrder = []),
              (d.augment = s),
              (d.handlers = Object.assign({}, c, t.handlers)),
              (d.unknownHandler = t.unknownHandler),
              (d.passThrough = t.passThrough),
              i(e, 'footnoteDefinition', h),
              d
            )
            function s(e, n) {
              var t, r
              return (
                e &&
                  e.data &&
                  ((t = e.data).hName &&
                    ('element' !== n.type &&
                      (n = {
                        type: 'element',
                        tagName: '',
                        properties: {},
                        children: [],
                      }),
                    (n.tagName = t.hName)),
                  'element' === n.type &&
                    t.hProperties &&
                    (n.properties = Object.assign(
                      {},
                      n.properties,
                      t.hProperties,
                    )),
                  n.children && t.hChildren && (n.children = t.hChildren)),
                (r = e && e.position ? e : {position: e}),
                l(r) || (n.position = {start: o.start(r), end: o.end(r)}),
                n
              )
            }
            function d(e, n, t, r) {
              return (
                (void 0 !== r && null !== r) ||
                  'object' !== typeof t ||
                  !('length' in t) ||
                  ((r = t), (t = {})),
                s(e, {
                  type: 'element',
                  tagName: n,
                  properties: t || {},
                  children: r || [],
                })
              )
            }
            function h(e) {
              var n = String(e.identifier).toUpperCase()
              f.call(a, n) || (a[n] = e)
            }
          })(e, n),
          d = a(t, e),
          h = s(t)
        h && (d.children = d.children.concat(r('text', '\n'), h))
        return d
      }
      var r = t(64992),
        i = t(99273),
        o = t(89225),
        l = t(96259),
        u = t(49721),
        a = t(43358),
        s = t(20478),
        c = t(3828),
        f = {}.hasOwnProperty,
        p = !1
    },
    43358: function (e, n, t) {
      'use strict'
      e.exports = function (e, n, t) {
        var r,
          i = n && n.type
        if (!i) throw new Error('Expected node, got `' + n + '`')
        r = o.call(e.handlers, i)
          ? e.handlers[i]
          : e.passThrough && e.passThrough.indexOf(i) > -1
          ? u
          : e.unknownHandler
        return ('function' === typeof r ? r : l)(e, n, t)
      }
      var r = t(64992),
        i = t(60071),
        o = {}.hasOwnProperty
      function l(e, n) {
        return (function (e) {
          var n = e.data || {}
          if (
            o.call(n, 'hName') ||
            o.call(n, 'hProperties') ||
            o.call(n, 'hChildren')
          )
            return !1
          return 'value' in e
        })(n)
          ? e.augment(n, r('text', n.value))
          : e(n, 'div', i(e, n))
      }
      function u(e, n) {
        var t
        return n.children
          ? (((t = Object.assign({}, n)).children = i(e, n)), t)
          : n
      }
    },
    28875: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        var t,
          o,
          l,
          u = n.referenceType,
          a = ']'
        'collapsed' === u
          ? (a += '[]')
          : 'full' === u && (a += '[' + (n.label || n.identifier) + ']')
        if ('imageReference' === n.type) return r('text', '![' + n.alt + a)
        ;(t = i(e, n)),
          (o = t[0]) && 'text' === o.type
            ? (o.value = '[' + o.value)
            : t.unshift(r('text', '['))
        ;(l = t[t.length - 1]) && 'text' === l.type
          ? (l.value += a)
          : t.push(r('text', a))
        return t
      }
      var r = t(64992),
        i = t(60071)
    },
    32837: function (e, n, t) {
      'use strict'
      e.exports = function (e, n) {
        var t = [],
          i = -1,
          o = e.length
        n && t.push(r('text', '\n'))
        for (; ++i < o; ) i && t.push(r('text', '\n')), t.push(e[i])
        n && e.length > 0 && t.push(r('text', '\n'))
        return t
      }
      var r = t(64992)
    },
    22162: function (e) {
      'use strict'
      function n(e) {
        return (
          (e &&
            (e.value ||
              e.alt ||
              e.title ||
              ('children' in e && t(e.children)) ||
              ('length' in e && t(e)))) ||
          ''
        )
      }
      function t(e) {
        for (var t = [], r = -1; ++r < e.length; ) t[r] = n(e[r])
        return t.join('')
      }
      e.exports = n
    },
    77385: function (e) {
      'use strict'
      var n = {}
      function t(e, r, i) {
        var o,
          l,
          u,
          a,
          s,
          c = ''
        for (
          'string' !== typeof r && ((i = r), (r = t.defaultChars)),
            'undefined' === typeof i && (i = !0),
            s = (function (e) {
              var t,
                r,
                i = n[e]
              if (i) return i
              for (i = n[e] = [], t = 0; t < 128; t++)
                (r = String.fromCharCode(t)),
                  /^[0-9a-z]$/i.test(r)
                    ? i.push(r)
                    : i.push(
                        '%' + ('0' + t.toString(16).toUpperCase()).slice(-2),
                      )
              for (t = 0; t < e.length; t++) i[e.charCodeAt(t)] = e[t]
              return i
            })(r),
            o = 0,
            l = e.length;
          o < l;
          o++
        )
          if (
            ((u = e.charCodeAt(o)),
            i &&
              37 === u &&
              o + 2 < l &&
              /^[0-9a-f]{2}$/i.test(e.slice(o + 1, o + 3)))
          )
            (c += e.slice(o, o + 3)), (o += 2)
          else if (u < 128) c += s[u]
          else if (u >= 55296 && u <= 57343) {
            if (
              u >= 55296 &&
              u <= 56319 &&
              o + 1 < l &&
              (a = e.charCodeAt(o + 1)) >= 56320 &&
              a <= 57343
            ) {
              ;(c += encodeURIComponent(e[o] + e[o + 1])), o++
              continue
            }
            c += '%EF%BF%BD'
          } else c += encodeURIComponent(e[o])
        return c
      }
      ;(t.defaultChars = ";/?:@&=+$,-_.!~*'()#"),
        (t.componentChars = "-_.!~*'()"),
        (e.exports = t)
    },
    45088: function (e, n, t) {
      'use strict'
      var r = t(64986)(/[A-Za-z]/)
      e.exports = r
    },
    28182: function (e, n, t) {
      'use strict'
      var r = t(64986)(/[\dA-Za-z]/)
      e.exports = r
    },
    90144: function (e, n, t) {
      'use strict'
      var r = t(64986)(/[#-'*+\--9=?A-Z^-~]/)
      e.exports = r
    },
    2878: function (e) {
      'use strict'
      e.exports = function (e) {
        return e < 32 || 127 === e
      }
    },
    30669: function (e, n, t) {
      'use strict'
      var r = t(64986)(/\d/)
      e.exports = r
    },
    55282: function (e, n, t) {
      'use strict'
      var r = t(64986)(/[\dA-Fa-f]/)
      e.exports = r
    },
    87978: function (e, n, t) {
      'use strict'
      var r = t(64986)(/[!-/:-@[-`{-~]/)
      e.exports = r
    },
    64164: function (e) {
      'use strict'
      e.exports = function (e) {
        return e < 0 || 32 === e
      }
    },
    86958: function (e) {
      'use strict'
      e.exports = function (e) {
        return e < -2
      }
    },
    80394: function (e) {
      'use strict'
      e.exports = function (e) {
        return -2 === e || -1 === e || 32 === e
      }
    },
    62743: function (e, n, t) {
      'use strict'
      var r = t(47080),
        i = t(64986)(r)
      e.exports = i
    },
    77749: function (e, n, t) {
      'use strict'
      var r = t(64986)(/\s/)
      e.exports = r
    },
    90399: function (e) {
      'use strict'
      var n = Object.assign
      e.exports = n
    },
    51854: function (e) {
      'use strict'
      var n = String.fromCharCode
      e.exports = n
    },
    96200: function (e) {
      'use strict'
      var n = {}.hasOwnProperty
      e.exports = n
    },
    3178: function (e) {
      'use strict'
      e.exports = [
        'address',
        'article',
        'aside',
        'base',
        'basefont',
        'blockquote',
        'body',
        'caption',
        'center',
        'col',
        'colgroup',
        'dd',
        'details',
        'dialog',
        'dir',
        'div',
        'dl',
        'dt',
        'fieldset',
        'figcaption',
        'figure',
        'footer',
        'form',
        'frame',
        'frameset',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'head',
        'header',
        'hr',
        'html',
        'iframe',
        'legend',
        'li',
        'link',
        'main',
        'menu',
        'menuitem',
        'nav',
        'noframes',
        'ol',
        'optgroup',
        'option',
        'p',
        'param',
        'section',
        'source',
        'summary',
        'table',
        'tbody',
        'td',
        'tfoot',
        'th',
        'thead',
        'title',
        'tr',
        'track',
        'ul',
      ]
    },
    42928: function (e) {
      'use strict'
      e.exports = ['pre', 'script', 'style', 'textarea']
    },
    49233: function (e) {
      'use strict'
      var n = [].splice
      e.exports = n
    },
    47080: function (e) {
      'use strict'
      e.exports =
        /[!-\/:-@\[-`\{-~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/
    },
    26558: function (e, n, t) {
      'use strict'
      Object.defineProperty(n, '__esModule', {value: !0})
      var r = t(70993),
        i = t(36984),
        o = t(3555),
        l = t(3786),
        u = t(18137),
        a = t(95280),
        s = t(41749),
        c = t(34768),
        f = t(98378),
        p = t(11217),
        d = t(80425),
        h = t(15639),
        m = t(74350),
        g = t(48551),
        v = t(80741),
        x = t(86991),
        y = t(19260),
        k = t(68999),
        b = t(86074),
        w = t(56726),
        S = t(83605),
        E = {
          42: b,
          43: b,
          45: b,
          48: b,
          49: b,
          50: b,
          51: b,
          52: b,
          53: b,
          54: b,
          55: b,
          56: b,
          57: b,
          62: l,
        },
        C = {91: p},
        F = {'-2': c, '-1': c, 32: c},
        P = {35: h, 42: S, 45: [w, S], 60: m, 61: w, 95: S, 96: s, 126: s},
        T = {38: a, 92: u},
        A = {
          '-5': k,
          '-4': k,
          '-3': k,
          33: x,
          38: a,
          42: i,
          60: [o, g],
          91: y,
          92: [d, u],
          93: v,
          95: i,
          96: f,
        },
        O = {null: [i, r.resolver]}
      ;(n.contentInitial = C),
        (n.disable = {null: []}),
        (n.document = E),
        (n.flow = P),
        (n.flowInitial = F),
        (n.insideSpan = O),
        (n.string = T),
        (n.text = A)
    },
    53224: function (e, n, t) {
      'use strict'
      Object.defineProperty(n, '__esModule', {value: !0})
      var r = t(86958),
        i = t(23194),
        o = function (e) {
          var n,
            t = e.attempt(
              this.parser.constructs.contentInitial,
              function (n) {
                if (null === n) return void e.consume(n)
                return (
                  e.enter('lineEnding'),
                  e.consume(n),
                  e.exit('lineEnding'),
                  i(e, t, 'linePrefix')
                )
              },
              function (n) {
                return e.enter('paragraph'), o(n)
              },
            )
          return t
          function o(t) {
            var r = e.enter('chunkText', {contentType: 'text', previous: n})
            return n && (n.next = r), (n = r), l(t)
          }
          function l(n) {
            return null === n
              ? (e.exit('chunkText'), e.exit('paragraph'), void e.consume(n))
              : r(n)
              ? (e.consume(n), e.exit('chunkText'), o)
              : (e.consume(n), l)
          }
        }
      n.tokenize = o
    },
    55405: function (e, n, t) {
      'use strict'
      Object.defineProperty(n, '__esModule', {value: !0})
      var r = t(86958),
        i = t(23194),
        o = t(6319),
        l = function (e) {
          var n,
            t,
            i,
            l = this,
            s = [],
            c = 0,
            f = {
              tokenize: function (e, r) {
                var i = 0
                return (n = {}), c
                function c(r) {
                  return i < s.length
                    ? ((l.containerState = s[i][1]),
                      e.attempt(s[i][0].continuation, f, p)(r))
                    : t.currentConstruct && t.currentConstruct.concrete
                    ? ((n.flowContinue = !0), m(r))
                    : ((l.interrupt =
                        t.currentConstruct && t.currentConstruct.interruptible),
                      (l.containerState = {}),
                      e.attempt(u, h, m)(r))
                }
                function f(e) {
                  return i++, l.containerState._closeFlow ? h(e) : c(e)
                }
                function p(n) {
                  return t.currentConstruct && t.currentConstruct.lazy
                    ? ((l.containerState = {}),
                      e.attempt(u, h, e.attempt(a, h, e.check(o, h, d)))(n))
                    : h(n)
                }
                function d(e) {
                  return (
                    (i = s.length), (n.lazy = !0), (n.flowContinue = !0), m(e)
                  )
                }
                function h(e) {
                  return (n.flowEnd = !0), m(e)
                }
                function m(e) {
                  return (
                    (n.continued = i),
                    (l.interrupt = l.containerState = void 0),
                    r(e)
                  )
                }
              },
              partial: !0,
            }
          return p
          function p(n) {
            return c < s.length
              ? ((l.containerState = s[c][1]),
                e.attempt(s[c][0].continuation, d, h)(n))
              : h(n)
          }
          function d(e) {
            return c++, p(e)
          }
          function h(r) {
            return n && n.flowContinue
              ? g(r)
              : ((l.interrupt =
                  t && t.currentConstruct && t.currentConstruct.interruptible),
                (l.containerState = {}),
                e.attempt(u, m, g)(r))
          }
          function m(e) {
            return (
              s.push([l.currentConstruct, l.containerState]),
              (l.containerState = void 0),
              h(e)
            )
          }
          function g(n) {
            return null === n
              ? (k(0, !0), void e.consume(n))
              : ((t = t || l.parser.flow(l.now())),
                e.enter('chunkFlow', {
                  contentType: 'flow',
                  previous: i,
                  _tokenizer: t,
                }),
                v(n))
          }
          function v(n) {
            return null === n
              ? (y(e.exit('chunkFlow')), g(n))
              : r(n)
              ? (e.consume(n), y(e.exit('chunkFlow')), e.check(f, x))
              : (e.consume(n), v)
          }
          function x(e) {
            return k(n.continued, n && n.flowEnd), (c = 0), p(e)
          }
          function y(e) {
            i && (i.next = e),
              (i = e),
              (t.lazy = n && n.lazy),
              t.defineSkip(e.start),
              t.write(l.sliceStream(e))
          }
          function k(n, r) {
            var o = s.length
            for (t && r && (t.write([null]), (i = t = void 0)); o-- > n; )
              (l.containerState = s[o][1]), s[o][0].exit.call(l, e)
            s.length = n
          }
        },
        u = {
          tokenize: function (e, n, t) {
            return i(
              e,
              e.attempt(this.parser.constructs.document, n, t),
              'linePrefix',
              this.parser.constructs.disable.null.indexOf('codeIndented') > -1
                ? void 0
                : 4,
            )
          },
        },
        a = {
          tokenize: function (e, n, t) {
            return i(
              e,
              e.lazy(this.parser.constructs.flow, n, t),
              'linePrefix',
              this.parser.constructs.disable.null.indexOf('codeIndented') > -1
                ? void 0
                : 4,
            )
          },
        }
      n.tokenize = l
    },
    49791: function (e, n, t) {
      'use strict'
      Object.defineProperty(n, '__esModule', {value: !0})
      var r = t(5391),
        i = t(23194),
        o = t(6319),
        l = function (e) {
          var n = this,
            t = e.attempt(
              o,
              function (r) {
                if (null === r) return void e.consume(r)
                return (
                  e.enter('lineEndingBlank'),
                  e.consume(r),
                  e.exit('lineEndingBlank'),
                  (n.currentConstruct = void 0),
                  t
                )
              },
              e.attempt(
                this.parser.constructs.flowInitial,
                l,
                i(
                  e,
                  e.attempt(this.parser.constructs.flow, l, e.attempt(r, l)),
                  'linePrefix',
                ),
              ),
            )
          return t
          function l(r) {
            if (null !== r)
              return (
                e.enter('lineEnding'),
                e.consume(r),
                e.exit('lineEnding'),
                (n.currentConstruct = void 0),
                t
              )
            e.consume(r)
          }
        }
      n.tokenize = l
    },
    70993: function (e, n, t) {
      'use strict'
      Object.defineProperty(n, '__esModule', {value: !0})
      var r = t(90399),
        i = t(24578),
        o = a('text'),
        l = a('string'),
        u = {resolveAll: s()}
      function a(e) {
        return {
          tokenize: function (n) {
            var t = this,
              r = this.parser.constructs[e],
              i = n.attempt(r, o, l)
            return o
            function o(e) {
              return a(e) ? i(e) : l(e)
            }
            function l(e) {
              if (null !== e) return n.enter('data'), n.consume(e), u
              n.consume(e)
            }
            function u(e) {
              return a(e) ? (n.exit('data'), i(e)) : (n.consume(e), u)
            }
            function a(e) {
              var n = r[e],
                i = -1
              if (null === e) return !0
              if (n)
                for (; ++i < n.length; )
                  if (!n[i].previous || n[i].previous.call(t, t.previous))
                    return !0
            }
          },
          resolveAll: s('text' === e ? c : void 0),
        }
      }
      function s(e) {
        return function (n, t) {
          var r,
            i = -1
          for (; ++i <= n.length; )
            void 0 === r
              ? n[i] && 'data' === n[i][1].type && ((r = i), i++)
              : (n[i] && 'data' === n[i][1].type) ||
                (i !== r + 2 &&
                  ((n[r][1].end = n[i - 1][1].end),
                  n.splice(r + 2, i - r - 2),
                  (i = r + 2)),
                (r = void 0))
          return e ? e(n, t) : n
        }
      }
      function c(e, n) {
        for (var t, o, l, u, a, s, c, f, p = -1; ++p <= e.length; )
          if (
            (p === e.length || 'lineEnding' === e[p][1].type) &&
            'data' === e[p - 1][1].type
          ) {
            for (
              o = e[p - 1][1],
                u = (t = n.sliceStream(o)).length,
                a = -1,
                s = 0,
                c = void 0;
              u--;

            )
              if ('string' === typeof (l = t[u])) {
                for (a = l.length; 32 === l.charCodeAt(a - 1); ) s++, a--
                if (a) break
                a = -1
              } else if (-2 === l) (c = !0), s++
              else if (-1 !== l) {
                u++
                break
              }
            s &&
              ((f = {
                type:
                  p === e.length || c || s < 2
                    ? 'lineSuffix'
                    : 'hardBreakTrailing',
                start: {
                  line: o.end.line,
                  column: o.end.column - s,
                  offset: o.end.offset - s,
                  _index: o.start._index + u,
                  _bufferIndex: u ? a : o.start._bufferIndex + a,
                },
                end: i(o.end),
              }),
              (o.end = i(f.start)),
              o.start.offset === o.end.offset
                ? r(o, f)
                : (e.splice(p, 0, ['enter', f, n], ['exit', f, n]), (p += 2))),
              p++
          }
        return e
      }
      ;(n.resolver = u), (n.string = l), (n.text = o)
    },
    41401: function (e, n, t) {
      'use strict'
      var r = t(53224),
        i = t(55405),
        o = t(49791),
        l = t(70993),
        u = t(17633),
        a = t(29525),
        s = t(28044),
        c = t(26558)
      e.exports = function (e) {
        var n = {
          defined: [],
          constructs: u([c].concat(s((e || {}).extensions))),
          content: t(r),
          document: t(i),
          flow: t(o),
          string: t(l.string),
          text: t(l.text),
        }
        return n
        function t(e) {
          return function (t) {
            return a(n, e, t)
          }
        }
      }
    },
    70450: function (e, n, t) {
      'use strict'
      var r = t(45539)
      e.exports = function (e) {
        for (; !r(e); );
        return e
      }
    },
    47435: function (e) {
      'use strict'
      var n = /[\0\t\n\r]/g
      e.exports = function () {
        var e,
          t = !0,
          r = 1,
          i = ''
        return function (o, l, u) {
          var a,
            s,
            c,
            f,
            p,
            d = []
          ;(o = i + o.toString(l)),
            (c = 0),
            (i = ''),
            t && (65279 === o.charCodeAt(0) && c++, (t = void 0))
          for (; c < o.length; ) {
            if (
              ((n.lastIndex = c),
              (a = n.exec(o)),
              (f = a ? a.index : o.length),
              (p = o.charCodeAt(f)),
              !a)
            ) {
              i = o.slice(c)
              break
            }
            if (10 === p && c === f && e) d.push(-3), (e = void 0)
            else if (
              (e && (d.push(-5), (e = void 0)),
              c < f && (d.push(o.slice(c, f)), (r += f - c)),
              0 === p)
            )
              d.push(65533), r++
            else if (9 === p)
              for (s = 4 * Math.ceil(r / 4), d.push(-2); r++ < s; ) d.push(-1)
            else 10 === p ? (d.push(-4), (r = 1)) : ((e = !0), (r = 1))
            c = f + 1
          }
          u && (e && d.push(-5), i && d.push(i), d.push(null))
          return d
        }
      }
    },
    36984: function (e, n, t) {
      'use strict'
      var r = t(7832),
        i = t(62773),
        o = t(80282),
        l = t(67249),
        u = t(95025),
        a = t(24578),
        s = {
          name: 'attention',
          tokenize: function (e, n) {
            var t,
              r = o(this.previous)
            return function (n) {
              return e.enter('attentionSequence'), (t = n), i(n)
            }
            function i(l) {
              var u, a, s, c
              return l === t
                ? (e.consume(l), i)
                : ((u = e.exit('attentionSequence')),
                  (s = !(a = o(l)) || (2 === a && r)),
                  (c = !r || (2 === r && a)),
                  (u._open = 42 === t ? s : s && (r || !c)),
                  (u._close = 42 === t ? c : c && (a || !s)),
                  n(l))
            }
          },
          resolveAll: function (e, n) {
            var t,
              o,
              s,
              c,
              f,
              p,
              d,
              h,
              m = -1
            for (; ++m < e.length; )
              if (
                'enter' === e[m][0] &&
                'attentionSequence' === e[m][1].type &&
                e[m][1]._close
              )
                for (t = m; t--; )
                  if (
                    'exit' === e[t][0] &&
                    'attentionSequence' === e[t][1].type &&
                    e[t][1]._open &&
                    n.sliceSerialize(e[t][1]).charCodeAt(0) ===
                      n.sliceSerialize(e[m][1]).charCodeAt(0)
                  ) {
                    if (
                      (e[t][1]._close || e[m][1]._open) &&
                      (e[m][1].end.offset - e[m][1].start.offset) % 3 &&
                      !(
                        (e[t][1].end.offset -
                          e[t][1].start.offset +
                          e[m][1].end.offset -
                          e[m][1].start.offset) %
                        3
                      )
                    )
                      continue
                    ;(p =
                      e[t][1].end.offset - e[t][1].start.offset > 1 &&
                      e[m][1].end.offset - e[m][1].start.offset > 1
                        ? 2
                        : 1),
                      (c = {
                        type: p > 1 ? 'strongSequence' : 'emphasisSequence',
                        start: l(a(e[t][1].end), -p),
                        end: a(e[t][1].end),
                      }),
                      (f = {
                        type: p > 1 ? 'strongSequence' : 'emphasisSequence',
                        start: a(e[m][1].start),
                        end: l(a(e[m][1].start), p),
                      }),
                      (s = {
                        type: p > 1 ? 'strongText' : 'emphasisText',
                        start: a(e[t][1].end),
                        end: a(e[m][1].start),
                      }),
                      (o = {
                        type: p > 1 ? 'strong' : 'emphasis',
                        start: a(c.start),
                        end: a(f.end),
                      }),
                      (e[t][1].end = a(c.start)),
                      (e[m][1].start = a(f.end)),
                      (d = []),
                      e[t][1].end.offset - e[t][1].start.offset &&
                        (d = r(d, [
                          ['enter', e[t][1], n],
                          ['exit', e[t][1], n],
                        ])),
                      (d = r(d, [
                        ['enter', o, n],
                        ['enter', c, n],
                        ['exit', c, n],
                        ['enter', s, n],
                      ])),
                      (d = r(
                        d,
                        u(
                          n.parser.constructs.insideSpan.null,
                          e.slice(t + 1, m),
                          n,
                        ),
                      )),
                      (d = r(d, [
                        ['exit', s, n],
                        ['enter', f, n],
                        ['exit', f, n],
                        ['exit', o, n],
                      ])),
                      e[m][1].end.offset - e[m][1].start.offset
                        ? ((h = 2),
                          (d = r(d, [
                            ['enter', e[m][1], n],
                            ['exit', e[m][1], n],
                          ])))
                        : (h = 0),
                      i(e, t - 1, m - t + 3, d),
                      (m = t + d.length - h - 2)
                    break
                  }
            m = -1
            for (; ++m < e.length; )
              'attentionSequence' === e[m][1].type && (e[m][1].type = 'data')
            return e
          },
        }
      e.exports = s
    },
    3555: function (e, n, t) {
      'use strict'
      var r = t(45088),
        i = t(28182),
        o = t(90144),
        l = t(2878),
        u = {
          name: 'autolink',
          tokenize: function (e, n, t) {
            var u = 1
            return function (n) {
              return (
                e.enter('autolink'),
                e.enter('autolinkMarker'),
                e.consume(n),
                e.exit('autolinkMarker'),
                e.enter('autolinkProtocol'),
                a
              )
            }
            function a(n) {
              return r(n) ? (e.consume(n), s) : o(n) ? p(n) : t(n)
            }
            function s(e) {
              return 43 === e || 45 === e || 46 === e || i(e) ? c(e) : p(e)
            }
            function c(n) {
              return 58 === n
                ? (e.consume(n), f)
                : (43 === n || 45 === n || 46 === n || i(n)) && u++ < 32
                ? (e.consume(n), c)
                : p(n)
            }
            function f(n) {
              return 62 === n
                ? (e.exit('autolinkProtocol'), g(n))
                : 32 === n || 60 === n || l(n)
                ? t(n)
                : (e.consume(n), f)
            }
            function p(n) {
              return 64 === n
                ? (e.consume(n), (u = 0), d)
                : o(n)
                ? (e.consume(n), p)
                : t(n)
            }
            function d(e) {
              return i(e) ? h(e) : t(e)
            }
            function h(n) {
              return 46 === n
                ? (e.consume(n), (u = 0), d)
                : 62 === n
                ? ((e.exit('autolinkProtocol').type = 'autolinkEmail'), g(n))
                : m(n)
            }
            function m(n) {
              return (45 === n || i(n)) && u++ < 63
                ? (e.consume(n), 45 === n ? m : h)
                : t(n)
            }
            function g(t) {
              return (
                e.enter('autolinkMarker'),
                e.consume(t),
                e.exit('autolinkMarker'),
                e.exit('autolink'),
                n
              )
            }
          },
        }
      e.exports = u
    },
    3786: function (e, n, t) {
      'use strict'
      var r = t(80394),
        i = t(23194),
        o = {
          name: 'blockQuote',
          tokenize: function (e, n, t) {
            var i = this
            return function (n) {
              if (62 === n)
                return (
                  i.containerState.open ||
                    (e.enter('blockQuote', {_container: !0}),
                    (i.containerState.open = !0)),
                  e.enter('blockQuotePrefix'),
                  e.enter('blockQuoteMarker'),
                  e.consume(n),
                  e.exit('blockQuoteMarker'),
                  o
                )
              return t(n)
            }
            function o(t) {
              return r(t)
                ? (e.enter('blockQuotePrefixWhitespace'),
                  e.consume(t),
                  e.exit('blockQuotePrefixWhitespace'),
                  e.exit('blockQuotePrefix'),
                  n)
                : (e.exit('blockQuotePrefix'), n(t))
            }
          },
          continuation: {
            tokenize: function (e, n, t) {
              return i(
                e,
                e.attempt(o, n, t),
                'linePrefix',
                this.parser.constructs.disable.null.indexOf('codeIndented') > -1
                  ? void 0
                  : 4,
              )
            },
          },
          exit: function (e) {
            e.exit('blockQuote')
          },
        }
      e.exports = o
    },
    18137: function (e, n, t) {
      'use strict'
      var r = t(87978),
        i = {
          name: 'characterEscape',
          tokenize: function (e, n, t) {
            return function (n) {
              return (
                e.enter('characterEscape'),
                e.enter('escapeMarker'),
                e.consume(n),
                e.exit('escapeMarker'),
                i
              )
            }
            function i(i) {
              return r(i)
                ? (e.enter('characterEscapeValue'),
                  e.consume(i),
                  e.exit('characterEscapeValue'),
                  e.exit('characterEscape'),
                  n)
                : t(i)
            }
          },
        }
      e.exports = i
    },
    95280: function (e, n, t) {
      'use strict'
      var r = t(18889),
        i = t(28182),
        o = t(30669),
        l = t(55282)
      function u(e) {
        return e && 'object' === typeof e && 'default' in e ? e : {default: e}
      }
      var a = u(r),
        s = {
          name: 'characterReference',
          tokenize: function (e, n, t) {
            var r,
              u,
              s = this,
              c = 0
            return function (n) {
              return (
                e.enter('characterReference'),
                e.enter('characterReferenceMarker'),
                e.consume(n),
                e.exit('characterReferenceMarker'),
                f
              )
            }
            function f(n) {
              return 35 === n
                ? (e.enter('characterReferenceMarkerNumeric'),
                  e.consume(n),
                  e.exit('characterReferenceMarkerNumeric'),
                  p)
                : (e.enter('characterReferenceValue'), (r = 31), (u = i), d(n))
            }
            function p(n) {
              return 88 === n || 120 === n
                ? (e.enter('characterReferenceMarkerHexadecimal'),
                  e.consume(n),
                  e.exit('characterReferenceMarkerHexadecimal'),
                  e.enter('characterReferenceValue'),
                  (r = 6),
                  (u = l),
                  d)
                : (e.enter('characterReferenceValue'), (r = 7), (u = o), d(n))
            }
            function d(o) {
              var l
              return 59 === o && c
                ? ((l = e.exit('characterReferenceValue')),
                  u !== i || a.default(s.sliceSerialize(l))
                    ? (e.enter('characterReferenceMarker'),
                      e.consume(o),
                      e.exit('characterReferenceMarker'),
                      e.exit('characterReference'),
                      n)
                    : t(o))
                : u(o) && c++ < r
                ? (e.consume(o), d)
                : t(o)
            }
          },
        }
      e.exports = s
    },
    41749: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = t(64164),
        o = t(24222),
        l = t(23194),
        u = {
          name: 'codeFenced',
          tokenize: function (e, n, t) {
            var u,
              a = this,
              s = {
                tokenize: function (e, n, t) {
                  var i = 0
                  return l(
                    e,
                    o,
                    'linePrefix',
                    this.parser.constructs.disable.null.indexOf(
                      'codeIndented',
                    ) > -1
                      ? void 0
                      : 4,
                  )
                  function o(n) {
                    return (
                      e.enter('codeFencedFence'),
                      e.enter('codeFencedFenceSequence'),
                      a(n)
                    )
                  }
                  function a(n) {
                    return n === u
                      ? (e.consume(n), i++, a)
                      : i < f
                      ? t(n)
                      : (e.exit('codeFencedFenceSequence'),
                        l(e, s, 'whitespace')(n))
                  }
                  function s(i) {
                    return null === i || r(i)
                      ? (e.exit('codeFencedFence'), n(i))
                      : t(i)
                  }
                },
                partial: !0,
              },
              c = o(this.events, 'linePrefix'),
              f = 0
            return function (n) {
              return (
                e.enter('codeFenced'),
                e.enter('codeFencedFence'),
                e.enter('codeFencedFenceSequence'),
                (u = n),
                p(n)
              )
            }
            function p(n) {
              return n === u
                ? (e.consume(n), f++, p)
                : (e.exit('codeFencedFenceSequence'),
                  f < 3 ? t(n) : l(e, d, 'whitespace')(n))
            }
            function d(n) {
              return null === n || r(n)
                ? v(n)
                : (e.enter('codeFencedFenceInfo'),
                  e.enter('chunkString', {contentType: 'string'}),
                  h(n))
            }
            function h(n) {
              return null === n || i(n)
                ? (e.exit('chunkString'),
                  e.exit('codeFencedFenceInfo'),
                  l(e, m, 'whitespace')(n))
                : 96 === n && n === u
                ? t(n)
                : (e.consume(n), h)
            }
            function m(n) {
              return null === n || r(n)
                ? v(n)
                : (e.enter('codeFencedFenceMeta'),
                  e.enter('chunkString', {contentType: 'string'}),
                  g(n))
            }
            function g(n) {
              return null === n || r(n)
                ? (e.exit('chunkString'), e.exit('codeFencedFenceMeta'), v(n))
                : 96 === n && n === u
                ? t(n)
                : (e.consume(n), g)
            }
            function v(t) {
              return e.exit('codeFencedFence'), a.interrupt ? n(t) : x(t)
            }
            function x(n) {
              return null === n
                ? k(n)
                : r(n)
                ? (e.enter('lineEnding'),
                  e.consume(n),
                  e.exit('lineEnding'),
                  e.attempt(s, k, c ? l(e, x, 'linePrefix', c + 1) : x))
                : (e.enter('codeFlowValue'), y(n))
            }
            function y(n) {
              return null === n || r(n)
                ? (e.exit('codeFlowValue'), x(n))
                : (e.consume(n), y)
            }
            function k(t) {
              return e.exit('codeFenced'), n(t)
            }
          },
          concrete: !0,
        }
      e.exports = u
    },
    34768: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = t(62773),
        o = t(24222),
        l = t(23194),
        u = {
          name: 'codeIndented',
          tokenize: function (e, n, t) {
            return e.attempt(a, i, t)
            function i(t) {
              return null === t
                ? n(t)
                : r(t)
                ? e.attempt(a, i, n)(t)
                : (e.enter('codeFlowValue'), o(t))
            }
            function o(n) {
              return null === n || r(n)
                ? (e.exit('codeFlowValue'), i(n))
                : (e.consume(n), o)
            }
          },
          resolve: function (e, n) {
            var t = {
              type: 'codeIndented',
              start: e[0][1].start,
              end: e[e.length - 1][1].end,
            }
            return (
              i(e, 0, 0, [['enter', t, n]]),
              i(e, e.length, 0, [['exit', t, n]]),
              e
            )
          },
        },
        a = {
          tokenize: function (e, n, t) {
            var i = this
            return l(
              e,
              function u(a) {
                if (r(a))
                  return (
                    e.enter('lineEnding'),
                    e.consume(a),
                    e.exit('lineEnding'),
                    l(e, u, 'linePrefix', 5)
                  )
                return o(i.events, 'linePrefix') < 4 ? t(a) : n(a)
              },
              'linePrefix',
              5,
            )
          },
          partial: !0,
        }
      e.exports = u
    },
    98378: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = {
          name: 'codeText',
          tokenize: function (e, n, t) {
            var i,
              o,
              l = 0
            return function (n) {
              return e.enter('codeText'), e.enter('codeTextSequence'), u(n)
            }
            function u(n) {
              return 96 === n
                ? (e.consume(n), l++, u)
                : (e.exit('codeTextSequence'), a(n))
            }
            function a(n) {
              return null === n
                ? t(n)
                : 96 === n
                ? ((o = e.enter('codeTextSequence')), (i = 0), c(n))
                : 32 === n
                ? (e.enter('space'), e.consume(n), e.exit('space'), a)
                : r(n)
                ? (e.enter('lineEnding'), e.consume(n), e.exit('lineEnding'), a)
                : (e.enter('codeTextData'), s(n))
            }
            function s(n) {
              return null === n || 32 === n || 96 === n || r(n)
                ? (e.exit('codeTextData'), a(n))
                : (e.consume(n), s)
            }
            function c(t) {
              return 96 === t
                ? (e.consume(t), i++, c)
                : i === l
                ? (e.exit('codeTextSequence'), e.exit('codeText'), n(t))
                : ((o.type = 'codeTextData'), s(t))
            }
          },
          resolve: function (e) {
            var n,
              t,
              r = e.length - 4,
              i = 3
            if (
              ('lineEnding' === e[i][1].type || 'space' === e[i][1].type) &&
              ('lineEnding' === e[r][1].type || 'space' === e[r][1].type)
            )
              for (n = i; ++n < r; )
                if ('codeTextData' === e[n][1].type) {
                  ;(e[r][1].type = e[i][1].type = 'codeTextPadding'),
                    (i += 2),
                    (r -= 2)
                  break
                }
            ;(n = i - 1), r++
            for (; ++n <= r; )
              void 0 === t
                ? n !== r && 'lineEnding' !== e[n][1].type && (t = n)
                : (n !== r && 'lineEnding' !== e[n][1].type) ||
                  ((e[t][1].type = 'codeTextData'),
                  n !== t + 2 &&
                    ((e[t][1].end = e[n - 1][1].end),
                    e.splice(t + 2, n - t - 2),
                    (r -= n - t - 2),
                    (n = t + 2)),
                  (t = void 0))
            return e
          },
          previous: function (e) {
            return (
              96 !== e ||
              'characterEscape' === this.events[this.events.length - 1][1].type
            )
          },
        }
      e.exports = i
    },
    5391: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = t(24222),
        o = t(45539),
        l = t(23194),
        u = {
          tokenize: function (e, n) {
            var t
            return function (n) {
              return (
                e.enter('content'),
                (t = e.enter('chunkContent', {contentType: 'content'})),
                i(n)
              )
            }
            function i(n) {
              return null === n
                ? o(n)
                : r(n)
                ? e.check(a, l, o)(n)
                : (e.consume(n), i)
            }
            function o(t) {
              return e.exit('chunkContent'), e.exit('content'), n(t)
            }
            function l(n) {
              return (
                e.consume(n),
                e.exit('chunkContent'),
                (t = t.next =
                  e.enter('chunkContent', {
                    contentType: 'content',
                    previous: t,
                  })),
                i
              )
            }
          },
          resolve: function (e) {
            return o(e), e
          },
          interruptible: !0,
          lazy: !0,
        },
        a = {
          tokenize: function (e, n, t) {
            var o = this
            return function (n) {
              return (
                e.enter('lineEnding'),
                e.consume(n),
                e.exit('lineEnding'),
                l(e, u, 'linePrefix')
              )
            }
            function u(l) {
              return null === l || r(l)
                ? t(l)
                : o.parser.constructs.disable.null.indexOf('codeIndented') >
                    -1 || i(o.events, 'linePrefix') < 4
                ? e.interrupt(o.parser.constructs.flow, t, n)(l)
                : n(l)
            }
          },
          partial: !0,
        }
      e.exports = u
    },
    11217: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = t(64164),
        o = t(77158),
        l = t(98540),
        u = t(43998),
        a = t(23194),
        s = t(86355),
        c = t(8671),
        f = {
          name: 'definition',
          tokenize: function (e, n, t) {
            var i,
              c = this
            return function (n) {
              return (
                e.enter('definition'),
                u.call(
                  c,
                  e,
                  f,
                  t,
                  'definitionLabel',
                  'definitionLabelMarker',
                  'definitionLabelString',
                )(n)
              )
            }
            function f(n) {
              return (
                (i = o(
                  c
                    .sliceSerialize(c.events[c.events.length - 1][1])
                    .slice(1, -1),
                )),
                58 === n
                  ? (e.enter('definitionMarker'),
                    e.consume(n),
                    e.exit('definitionMarker'),
                    s(
                      e,
                      l(
                        e,
                        e.attempt(
                          p,
                          a(e, d, 'whitespace'),
                          a(e, d, 'whitespace'),
                        ),
                        t,
                        'definitionDestination',
                        'definitionDestinationLiteral',
                        'definitionDestinationLiteralMarker',
                        'definitionDestinationRaw',
                        'definitionDestinationString',
                      ),
                    ))
                  : t(n)
              )
            }
            function d(o) {
              return null === o || r(o)
                ? (e.exit('definition'),
                  c.parser.defined.indexOf(i) < 0 && c.parser.defined.push(i),
                  n(o))
                : t(o)
            }
          },
        },
        p = {
          tokenize: function (e, n, t) {
            return function (n) {
              return i(n) ? s(e, o)(n) : t(n)
            }
            function o(n) {
              return 34 === n || 39 === n || 40 === n
                ? c(
                    e,
                    a(e, l, 'whitespace'),
                    t,
                    'definitionTitle',
                    'definitionTitleMarker',
                    'definitionTitleString',
                  )(n)
                : t(n)
            }
            function l(e) {
              return null === e || r(e) ? n(e) : t(e)
            }
          },
          partial: !0,
        }
      e.exports = f
    },
    98540: function (e, n, t) {
      'use strict'
      var r = t(2878),
        i = t(64164),
        o = t(86958)
      e.exports = function (e, n, t, l, u, a, s, c, f) {
        var p = f || 1 / 0,
          d = 0
        return function (n) {
          if (60 === n)
            return (
              e.enter(l), e.enter(u), e.enter(a), e.consume(n), e.exit(a), h
            )
          if (r(n) || 41 === n) return t(n)
          return (
            e.enter(l),
            e.enter(s),
            e.enter(c),
            e.enter('chunkString', {contentType: 'string'}),
            v(n)
          )
        }
        function h(t) {
          return 62 === t
            ? (e.enter(a), e.consume(t), e.exit(a), e.exit(u), e.exit(l), n)
            : (e.enter(c),
              e.enter('chunkString', {contentType: 'string'}),
              m(t))
        }
        function m(n) {
          return 62 === n
            ? (e.exit('chunkString'), e.exit(c), h(n))
            : null === n || 60 === n || o(n)
            ? t(n)
            : (e.consume(n), 92 === n ? g : m)
        }
        function g(n) {
          return 60 === n || 62 === n || 92 === n ? (e.consume(n), m) : m(n)
        }
        function v(o) {
          return 40 === o
            ? ++d > p
              ? t(o)
              : (e.consume(o), v)
            : 41 === o
            ? d--
              ? (e.consume(o), v)
              : (e.exit('chunkString'), e.exit(c), e.exit(s), e.exit(l), n(o))
            : null === o || i(o)
            ? d
              ? t(o)
              : (e.exit('chunkString'), e.exit(c), e.exit(s), e.exit(l), n(o))
            : r(o)
            ? t(o)
            : (e.consume(o), 92 === o ? x : v)
        }
        function x(n) {
          return 40 === n || 41 === n || 92 === n ? (e.consume(n), v) : v(n)
        }
      }
    },
    43998: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = t(80394)
      e.exports = function (e, n, t, o, l, u) {
        var a,
          s = this,
          c = 0
        return function (n) {
          return e.enter(o), e.enter(l), e.consume(n), e.exit(l), e.enter(u), f
        }
        function f(i) {
          return null === i ||
            91 === i ||
            (93 === i && !a) ||
            (94 === i &&
              !c &&
              '_hiddenFootnoteSupport' in s.parser.constructs) ||
            c > 999
            ? t(i)
            : 93 === i
            ? (e.exit(u), e.enter(l), e.consume(i), e.exit(l), e.exit(o), n)
            : r(i)
            ? (e.enter('lineEnding'), e.consume(i), e.exit('lineEnding'), f)
            : (e.enter('chunkString', {contentType: 'string'}), p(i))
        }
        function p(n) {
          return null === n || 91 === n || 93 === n || r(n) || c++ > 999
            ? (e.exit('chunkString'), f(n))
            : (e.consume(n), (a = a || !i(n)), 92 === n ? d : p)
        }
        function d(n) {
          return 91 === n || 92 === n || 93 === n
            ? (e.consume(n), c++, p)
            : p(n)
        }
      }
    },
    23194: function (e, n, t) {
      'use strict'
      var r = t(80394)
      e.exports = function (e, n, t, i) {
        var o = i ? i - 1 : 1 / 0,
          l = 0
        return function (i) {
          if (r(i)) return e.enter(t), u(i)
          return n(i)
        }
        function u(i) {
          return r(i) && l++ < o ? (e.consume(i), u) : (e.exit(t), n(i))
        }
      }
    },
    8671: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = t(23194)
      e.exports = function (e, n, t, o, l, u) {
        var a
        return function (n) {
          return (
            e.enter(o),
            e.enter(l),
            e.consume(n),
            e.exit(l),
            (a = 40 === n ? 41 : n),
            s
          )
        }
        function s(t) {
          return t === a
            ? (e.enter(l), e.consume(t), e.exit(l), e.exit(o), n)
            : (e.enter(u), c(t))
        }
        function c(n) {
          return n === a
            ? (e.exit(u), s(a))
            : null === n
            ? t(n)
            : r(n)
            ? (e.enter('lineEnding'),
              e.consume(n),
              e.exit('lineEnding'),
              i(e, c, 'linePrefix'))
            : (e.enter('chunkString', {contentType: 'string'}), f(n))
        }
        function f(n) {
          return n === a || null === n || r(n)
            ? (e.exit('chunkString'), c(n))
            : (e.consume(n), 92 === n ? p : f)
        }
        function p(n) {
          return n === a || 92 === n ? (e.consume(n), f) : f(n)
        }
      }
    },
    86355: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = t(80394),
        o = t(23194)
      e.exports = function (e, n) {
        var t
        return function l(u) {
          if (r(u))
            return (
              e.enter('lineEnding'),
              e.consume(u),
              e.exit('lineEnding'),
              (t = !0),
              l
            )
          if (i(u)) return o(e, l, t ? 'linePrefix' : 'lineSuffix')(u)
          return n(u)
        }
      }
    },
    80425: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = {
          name: 'hardBreakEscape',
          tokenize: function (e, n, t) {
            return function (n) {
              return (
                e.enter('hardBreakEscape'),
                e.enter('escapeMarker'),
                e.consume(n),
                i
              )
            }
            function i(i) {
              return r(i)
                ? (e.exit('escapeMarker'), e.exit('hardBreakEscape'), n(i))
                : t(i)
            }
          },
        }
      e.exports = i
    },
    15639: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = t(64164),
        o = t(80394),
        l = t(62773),
        u = t(23194),
        a = {
          name: 'headingAtx',
          tokenize: function (e, n, t) {
            var l = this,
              a = 0
            return function (n) {
              return e.enter('atxHeading'), e.enter('atxHeadingSequence'), s(n)
            }
            function s(r) {
              return 35 === r && a++ < 6
                ? (e.consume(r), s)
                : null === r || i(r)
                ? (e.exit('atxHeadingSequence'), l.interrupt ? n(r) : c(r))
                : t(r)
            }
            function c(t) {
              return 35 === t
                ? (e.enter('atxHeadingSequence'), f(t))
                : null === t || r(t)
                ? (e.exit('atxHeading'), n(t))
                : o(t)
                ? u(e, c, 'whitespace')(t)
                : (e.enter('atxHeadingText'), p(t))
            }
            function f(n) {
              return 35 === n
                ? (e.consume(n), f)
                : (e.exit('atxHeadingSequence'), c(n))
            }
            function p(n) {
              return null === n || 35 === n || i(n)
                ? (e.exit('atxHeadingText'), c(n))
                : (e.consume(n), p)
            }
          },
          resolve: function (e, n) {
            var t,
              r,
              i = e.length - 2,
              o = 3
            'whitespace' === e[o][1].type && (o += 2)
            i - 2 > o && 'whitespace' === e[i][1].type && (i -= 2)
            'atxHeadingSequence' === e[i][1].type &&
              (o === i - 1 ||
                (i - 4 > o && 'whitespace' === e[i - 2][1].type)) &&
              (i -= o + 1 === i ? 2 : 4)
            i > o &&
              ((t = {
                type: 'atxHeadingText',
                start: e[o][1].start,
                end: e[i][1].end,
              }),
              (r = {
                type: 'chunkText',
                start: e[o][1].start,
                end: e[i][1].end,
                contentType: 'text',
              }),
              l(e, o, i - o + 1, [
                ['enter', t, n],
                ['enter', r, n],
                ['exit', r, n],
                ['exit', t, n],
              ]))
            return e
          },
        }
      e.exports = a
    },
    74350: function (e, n, t) {
      'use strict'
      var r = t(45088),
        i = t(28182),
        o = t(86958),
        l = t(64164),
        u = t(80394),
        a = t(51854),
        s = t(3178),
        c = t(42928),
        f = t(6319),
        p = {
          name: 'htmlFlow',
          tokenize: function (e, n, t) {
            var f,
              p,
              h,
              m,
              g,
              v = this
            return function (n) {
              return (
                e.enter('htmlFlow'), e.enter('htmlFlowData'), e.consume(n), x
              )
            }
            function x(i) {
              return 33 === i
                ? (e.consume(i), y)
                : 47 === i
                ? (e.consume(i), w)
                : 63 === i
                ? (e.consume(i), (f = 3), v.interrupt ? n : N)
                : r(i)
                ? (e.consume(i), (h = a(i)), (p = !0), S)
                : t(i)
            }
            function y(i) {
              return 45 === i
                ? (e.consume(i), (f = 2), k)
                : 91 === i
                ? (e.consume(i), (f = 5), (h = 'CDATA['), (m = 0), b)
                : r(i)
                ? (e.consume(i), (f = 4), v.interrupt ? n : N)
                : t(i)
            }
            function k(r) {
              return 45 === r ? (e.consume(r), v.interrupt ? n : N) : t(r)
            }
            function b(r) {
              return r === h.charCodeAt(m++)
                ? (e.consume(r), m === h.length ? (v.interrupt ? n : z) : b)
                : t(r)
            }
            function w(n) {
              return r(n) ? (e.consume(n), (h = a(n)), S) : t(n)
            }
            function S(r) {
              return null === r || 47 === r || 62 === r || l(r)
                ? 47 !== r && p && c.indexOf(h.toLowerCase()) > -1
                  ? ((f = 1), v.interrupt ? n(r) : z(r))
                  : s.indexOf(h.toLowerCase()) > -1
                  ? ((f = 6),
                    47 === r ? (e.consume(r), E) : v.interrupt ? n(r) : z(r))
                  : ((f = 7), v.interrupt ? t(r) : p ? F(r) : C(r))
                : 45 === r || i(r)
                ? (e.consume(r), (h += a(r)), S)
                : t(r)
            }
            function E(r) {
              return 62 === r ? (e.consume(r), v.interrupt ? n : z) : t(r)
            }
            function C(n) {
              return u(n) ? (e.consume(n), C) : L(n)
            }
            function F(n) {
              return 47 === n
                ? (e.consume(n), L)
                : 58 === n || 95 === n || r(n)
                ? (e.consume(n), P)
                : u(n)
                ? (e.consume(n), F)
                : L(n)
            }
            function P(n) {
              return 45 === n || 46 === n || 58 === n || 95 === n || i(n)
                ? (e.consume(n), P)
                : T(n)
            }
            function T(n) {
              return 61 === n
                ? (e.consume(n), A)
                : u(n)
                ? (e.consume(n), T)
                : F(n)
            }
            function A(n) {
              return null === n || 60 === n || 61 === n || 62 === n || 96 === n
                ? t(n)
                : 34 === n || 39 === n
                ? (e.consume(n), (g = n), O)
                : u(n)
                ? (e.consume(n), A)
                : ((g = void 0), D(n))
            }
            function O(n) {
              return n === g
                ? (e.consume(n), I)
                : null === n || o(n)
                ? t(n)
                : (e.consume(n), O)
            }
            function D(n) {
              return null === n ||
                34 === n ||
                39 === n ||
                60 === n ||
                61 === n ||
                62 === n ||
                96 === n ||
                l(n)
                ? T(n)
                : (e.consume(n), D)
            }
            function I(e) {
              return 47 === e || 62 === e || u(e) ? F(e) : t(e)
            }
            function L(n) {
              return 62 === n ? (e.consume(n), M) : t(n)
            }
            function M(n) {
              return u(n) ? (e.consume(n), M) : null === n || o(n) ? z(n) : t(n)
            }
            function z(n) {
              return 45 === n && 2 === f
                ? (e.consume(n), R)
                : 60 === n && 1 === f
                ? (e.consume(n), j)
                : 62 === n && 4 === f
                ? (e.consume(n), q)
                : 63 === n && 3 === f
                ? (e.consume(n), N)
                : 93 === n && 5 === f
                ? (e.consume(n), U)
                : !o(n) || (6 !== f && 7 !== f)
                ? null === n || o(n)
                  ? B(n)
                  : (e.consume(n), z)
                : e.check(d, q, B)(n)
            }
            function B(n) {
              return e.exit('htmlFlowData'), _(n)
            }
            function _(n) {
              return null === n
                ? V(n)
                : o(n)
                ? (e.enter('lineEnding'), e.consume(n), e.exit('lineEnding'), _)
                : (e.enter('htmlFlowData'), z(n))
            }
            function R(n) {
              return 45 === n ? (e.consume(n), N) : z(n)
            }
            function j(n) {
              return 47 === n ? (e.consume(n), (h = ''), H) : z(n)
            }
            function H(n) {
              return 62 === n && c.indexOf(h.toLowerCase()) > -1
                ? (e.consume(n), q)
                : r(n) && h.length < 8
                ? (e.consume(n), (h += a(n)), H)
                : z(n)
            }
            function U(n) {
              return 93 === n ? (e.consume(n), N) : z(n)
            }
            function N(n) {
              return 62 === n ? (e.consume(n), q) : z(n)
            }
            function q(n) {
              return null === n || o(n)
                ? (e.exit('htmlFlowData'), V(n))
                : (e.consume(n), q)
            }
            function V(t) {
              return e.exit('htmlFlow'), n(t)
            }
          },
          resolveTo: function (e) {
            var n = e.length
            for (
              ;
              n-- && ('enter' !== e[n][0] || 'htmlFlow' !== e[n][1].type);

            );
            n > 1 &&
              'linePrefix' === e[n - 2][1].type &&
              ((e[n][1].start = e[n - 2][1].start),
              (e[n + 1][1].start = e[n - 2][1].start),
              e.splice(n - 2, 2))
            return e
          },
          concrete: !0,
        },
        d = {
          tokenize: function (e, n, t) {
            return function (r) {
              return (
                e.exit('htmlFlowData'),
                e.enter('lineEndingBlank'),
                e.consume(r),
                e.exit('lineEndingBlank'),
                e.attempt(f, n, t)
              )
            }
          },
          partial: !0,
        }
      e.exports = p
    },
    48551: function (e, n, t) {
      'use strict'
      var r = t(45088),
        i = t(28182),
        o = t(86958),
        l = t(64164),
        u = t(80394),
        a = t(23194),
        s = {
          name: 'htmlText',
          tokenize: function (e, n, t) {
            var s,
              c,
              f,
              p,
              d = this
            return function (n) {
              return (
                e.enter('htmlText'), e.enter('htmlTextData'), e.consume(n), h
              )
            }
            function h(n) {
              return 33 === n
                ? (e.consume(n), m)
                : 47 === n
                ? (e.consume(n), T)
                : 63 === n
                ? (e.consume(n), F)
                : r(n)
                ? (e.consume(n), D)
                : t(n)
            }
            function m(n) {
              return 45 === n
                ? (e.consume(n), g)
                : 91 === n
                ? (e.consume(n), (c = 'CDATA['), (f = 0), b)
                : r(n)
                ? (e.consume(n), C)
                : t(n)
            }
            function g(n) {
              return 45 === n ? (e.consume(n), v) : t(n)
            }
            function v(n) {
              return null === n || 62 === n
                ? t(n)
                : 45 === n
                ? (e.consume(n), x)
                : y(n)
            }
            function x(e) {
              return null === e || 62 === e ? t(e) : y(e)
            }
            function y(n) {
              return null === n
                ? t(n)
                : 45 === n
                ? (e.consume(n), k)
                : o(n)
                ? ((p = y), j(n))
                : (e.consume(n), y)
            }
            function k(n) {
              return 45 === n ? (e.consume(n), U) : y(n)
            }
            function b(n) {
              return n === c.charCodeAt(f++)
                ? (e.consume(n), f === c.length ? w : b)
                : t(n)
            }
            function w(n) {
              return null === n
                ? t(n)
                : 93 === n
                ? (e.consume(n), S)
                : o(n)
                ? ((p = w), j(n))
                : (e.consume(n), w)
            }
            function S(n) {
              return 93 === n ? (e.consume(n), E) : w(n)
            }
            function E(n) {
              return 62 === n ? U(n) : 93 === n ? (e.consume(n), E) : w(n)
            }
            function C(n) {
              return null === n || 62 === n
                ? U(n)
                : o(n)
                ? ((p = C), j(n))
                : (e.consume(n), C)
            }
            function F(n) {
              return null === n
                ? t(n)
                : 63 === n
                ? (e.consume(n), P)
                : o(n)
                ? ((p = F), j(n))
                : (e.consume(n), F)
            }
            function P(e) {
              return 62 === e ? U(e) : F(e)
            }
            function T(n) {
              return r(n) ? (e.consume(n), A) : t(n)
            }
            function A(n) {
              return 45 === n || i(n) ? (e.consume(n), A) : O(n)
            }
            function O(n) {
              return o(n) ? ((p = O), j(n)) : u(n) ? (e.consume(n), O) : U(n)
            }
            function D(n) {
              return 45 === n || i(n)
                ? (e.consume(n), D)
                : 47 === n || 62 === n || l(n)
                ? I(n)
                : t(n)
            }
            function I(n) {
              return 47 === n
                ? (e.consume(n), U)
                : 58 === n || 95 === n || r(n)
                ? (e.consume(n), L)
                : o(n)
                ? ((p = I), j(n))
                : u(n)
                ? (e.consume(n), I)
                : U(n)
            }
            function L(n) {
              return 45 === n || 46 === n || 58 === n || 95 === n || i(n)
                ? (e.consume(n), L)
                : M(n)
            }
            function M(n) {
              return 61 === n
                ? (e.consume(n), z)
                : o(n)
                ? ((p = M), j(n))
                : u(n)
                ? (e.consume(n), M)
                : I(n)
            }
            function z(n) {
              return null === n || 60 === n || 61 === n || 62 === n || 96 === n
                ? t(n)
                : 34 === n || 39 === n
                ? (e.consume(n), (s = n), B)
                : o(n)
                ? ((p = z), j(n))
                : u(n)
                ? (e.consume(n), z)
                : (e.consume(n), (s = void 0), R)
            }
            function B(n) {
              return n === s
                ? (e.consume(n), _)
                : null === n
                ? t(n)
                : o(n)
                ? ((p = B), j(n))
                : (e.consume(n), B)
            }
            function _(e) {
              return 62 === e || 47 === e || l(e) ? I(e) : t(e)
            }
            function R(n) {
              return null === n ||
                34 === n ||
                39 === n ||
                60 === n ||
                61 === n ||
                96 === n
                ? t(n)
                : 62 === n || l(n)
                ? I(n)
                : (e.consume(n), R)
            }
            function j(n) {
              return (
                e.exit('htmlTextData'),
                e.enter('lineEnding'),
                e.consume(n),
                e.exit('lineEnding'),
                a(
                  e,
                  H,
                  'linePrefix',
                  d.parser.constructs.disable.null.indexOf('codeIndented') > -1
                    ? void 0
                    : 4,
                )
              )
            }
            function H(n) {
              return e.enter('htmlTextData'), p(n)
            }
            function U(r) {
              return 62 === r
                ? (e.consume(r), e.exit('htmlTextData'), e.exit('htmlText'), n)
                : t(r)
            }
          },
        }
      e.exports = s
    },
    80741: function (e, n, t) {
      'use strict'
      var r = t(64164),
        i = t(7832),
        o = t(62773),
        l = t(77158),
        u = t(95025),
        a = t(24578),
        s = t(98540),
        c = t(43998),
        f = t(8671),
        p = t(86355),
        d = {
          name: 'labelEnd',
          tokenize: function (e, n, t) {
            var r,
              i,
              o = this,
              u = o.events.length
            for (; u--; )
              if (
                ('labelImage' === o.events[u][1].type ||
                  'labelLink' === o.events[u][1].type) &&
                !o.events[u][1]._balanced
              ) {
                r = o.events[u][1]
                break
              }
            return function (n) {
              if (!r) return t(n)
              return r._inactive
                ? s(n)
                : ((i =
                    o.parser.defined.indexOf(
                      l(o.sliceSerialize({start: r.end, end: o.now()})),
                    ) > -1),
                  e.enter('labelEnd'),
                  e.enter('labelMarker'),
                  e.consume(n),
                  e.exit('labelMarker'),
                  e.exit('labelEnd'),
                  a)
            }
            function a(t) {
              return 40 === t
                ? e.attempt(h, n, i ? n : s)(t)
                : 91 === t
                ? e.attempt(m, n, i ? e.attempt(g, n, s) : s)(t)
                : i
                ? n(t)
                : s(t)
            }
            function s(e) {
              return (r._balanced = !0), t(e)
            }
          },
          resolveTo: function (e, n) {
            var t,
              r,
              l,
              s,
              c,
              f,
              p,
              d = e.length,
              h = 0
            for (; d--; )
              if (((s = e[d][1]), c)) {
                if (
                  'link' === s.type ||
                  ('labelLink' === s.type && s._inactive)
                )
                  break
                'enter' === e[d][0] &&
                  'labelLink' === s.type &&
                  (s._inactive = !0)
              } else if (f) {
                if (
                  'enter' === e[d][0] &&
                  ('labelImage' === s.type || 'labelLink' === s.type) &&
                  !s._balanced &&
                  ((c = d), 'labelLink' !== s.type)
                ) {
                  h = 2
                  break
                }
              } else 'labelEnd' === s.type && (f = d)
            return (
              (t = {
                type: 'labelLink' === e[c][1].type ? 'link' : 'image',
                start: a(e[c][1].start),
                end: a(e[e.length - 1][1].end),
              }),
              (r = {
                type: 'label',
                start: a(e[c][1].start),
                end: a(e[f][1].end),
              }),
              (l = {
                type: 'labelText',
                start: a(e[c + h + 2][1].end),
                end: a(e[f - 2][1].start),
              }),
              (p = i(
                (p = [
                  ['enter', t, n],
                  ['enter', r, n],
                ]),
                e.slice(c + 1, c + h + 3),
              )),
              (p = i(p, [['enter', l, n]])),
              (p = i(
                p,
                u(
                  n.parser.constructs.insideSpan.null,
                  e.slice(c + h + 4, f - 3),
                  n,
                ),
              )),
              (p = i(p, [['exit', l, n], e[f - 2], e[f - 1], ['exit', r, n]])),
              (p = i(p, e.slice(f + 1))),
              (p = i(p, [['exit', t, n]])),
              o(e, c, e.length, p),
              e
            )
          },
          resolveAll: function (e) {
            var n,
              t = -1
            for (; ++t < e.length; )
              (n = e[t][1])._used ||
                ('labelImage' !== n.type &&
                  'labelLink' !== n.type &&
                  'labelEnd' !== n.type) ||
                (e.splice(t + 1, 'labelImage' === n.type ? 4 : 2),
                (n.type = 'data'),
                t++)
            return e
          },
        },
        h = {
          tokenize: function (e, n, t) {
            return function (n) {
              return (
                e.enter('resource'),
                e.enter('resourceMarker'),
                e.consume(n),
                e.exit('resourceMarker'),
                p(e, i)
              )
            }
            function i(n) {
              return 41 === n
                ? u(n)
                : s(
                    e,
                    o,
                    t,
                    'resourceDestination',
                    'resourceDestinationLiteral',
                    'resourceDestinationLiteralMarker',
                    'resourceDestinationRaw',
                    'resourceDestinationString',
                    3,
                  )(n)
            }
            function o(n) {
              return r(n) ? p(e, l)(n) : u(n)
            }
            function l(n) {
              return 34 === n || 39 === n || 40 === n
                ? f(
                    e,
                    p(e, u),
                    t,
                    'resourceTitle',
                    'resourceTitleMarker',
                    'resourceTitleString',
                  )(n)
                : u(n)
            }
            function u(r) {
              return 41 === r
                ? (e.enter('resourceMarker'),
                  e.consume(r),
                  e.exit('resourceMarker'),
                  e.exit('resource'),
                  n)
                : t(r)
            }
          },
        },
        m = {
          tokenize: function (e, n, t) {
            var r = this
            return function (n) {
              return c.call(
                r,
                e,
                i,
                t,
                'reference',
                'referenceMarker',
                'referenceString',
              )(n)
            }
            function i(e) {
              return r.parser.defined.indexOf(
                l(
                  r
                    .sliceSerialize(r.events[r.events.length - 1][1])
                    .slice(1, -1),
                ),
              ) < 0
                ? t(e)
                : n(e)
            }
          },
        },
        g = {
          tokenize: function (e, n, t) {
            return function (n) {
              return (
                e.enter('reference'),
                e.enter('referenceMarker'),
                e.consume(n),
                e.exit('referenceMarker'),
                r
              )
            }
            function r(r) {
              return 93 === r
                ? (e.enter('referenceMarker'),
                  e.consume(r),
                  e.exit('referenceMarker'),
                  e.exit('reference'),
                  n)
                : t(r)
            }
          },
        }
      e.exports = d
    },
    86991: function (e, n, t) {
      'use strict'
      var r = {
        name: 'labelStartImage',
        tokenize: function (e, n, t) {
          var r = this
          return function (n) {
            return (
              e.enter('labelImage'),
              e.enter('labelImageMarker'),
              e.consume(n),
              e.exit('labelImageMarker'),
              i
            )
          }
          function i(n) {
            return 91 === n
              ? (e.enter('labelMarker'),
                e.consume(n),
                e.exit('labelMarker'),
                e.exit('labelImage'),
                o)
              : t(n)
          }
          function o(e) {
            return 94 === e && '_hiddenFootnoteSupport' in r.parser.constructs
              ? t(e)
              : n(e)
          }
        },
        resolveAll: t(80741).resolveAll,
      }
      e.exports = r
    },
    19260: function (e, n, t) {
      'use strict'
      var r = {
        name: 'labelStartLink',
        tokenize: function (e, n, t) {
          var r = this
          return function (n) {
            return (
              e.enter('labelLink'),
              e.enter('labelMarker'),
              e.consume(n),
              e.exit('labelMarker'),
              e.exit('labelLink'),
              i
            )
          }
          function i(e) {
            return 94 === e && '_hiddenFootnoteSupport' in r.parser.constructs
              ? t(e)
              : n(e)
          }
        },
        resolveAll: t(80741).resolveAll,
      }
      e.exports = r
    },
    68999: function (e, n, t) {
      'use strict'
      var r = t(23194),
        i = {
          name: 'lineEnding',
          tokenize: function (e, n) {
            return function (t) {
              return (
                e.enter('lineEnding'),
                e.consume(t),
                e.exit('lineEnding'),
                r(e, n, 'linePrefix')
              )
            }
          },
        }
      e.exports = i
    },
    86074: function (e, n, t) {
      'use strict'
      var r = t(30669),
        i = t(80394),
        o = t(24222),
        l = t(22527),
        u = t(23194),
        a = t(6319),
        s = t(83605),
        c = {
          name: 'list',
          tokenize: function (e, n, t) {
            var u = this,
              c = o(u.events, 'linePrefix'),
              p = 0
            return function (n) {
              var i =
                u.containerState.type ||
                (42 === n || 43 === n || 45 === n
                  ? 'listUnordered'
                  : 'listOrdered')
              if (
                'listUnordered' === i
                  ? !u.containerState.marker || n === u.containerState.marker
                  : r(n)
              ) {
                if (
                  (u.containerState.type ||
                    ((u.containerState.type = i), e.enter(i, {_container: !0})),
                  'listUnordered' === i)
                )
                  return (
                    e.enter('listItemPrefix'),
                    42 === n || 45 === n ? e.check(s, t, h)(n) : h(n)
                  )
                if (!u.interrupt || 49 === n)
                  return (
                    e.enter('listItemPrefix'), e.enter('listItemValue'), d(n)
                  )
              }
              return t(n)
            }
            function d(n) {
              return r(n) && ++p < 10
                ? (e.consume(n), d)
                : (!u.interrupt || p < 2) &&
                  (u.containerState.marker
                    ? n === u.containerState.marker
                    : 41 === n || 46 === n)
                ? (e.exit('listItemValue'), h(n))
                : t(n)
            }
            function h(n) {
              return (
                e.enter('listItemMarker'),
                e.consume(n),
                e.exit('listItemMarker'),
                (u.containerState.marker = u.containerState.marker || n),
                e.check(a, u.interrupt ? t : m, e.attempt(f, v, g))
              )
            }
            function m(e) {
              return (u.containerState.initialBlankLine = !0), c++, v(e)
            }
            function g(n) {
              return i(n)
                ? (e.enter('listItemPrefixWhitespace'),
                  e.consume(n),
                  e.exit('listItemPrefixWhitespace'),
                  v)
                : t(n)
            }
            function v(t) {
              return (
                (u.containerState.size =
                  c + l(u.sliceStream(e.exit('listItemPrefix')))),
                n(t)
              )
            }
          },
          continuation: {
            tokenize: function (e, n, t) {
              var r = this
              return (
                (r.containerState._closeFlow = void 0),
                e.check(
                  a,
                  function (t) {
                    return (
                      (r.containerState.furtherBlankLines =
                        r.containerState.furtherBlankLines ||
                        r.containerState.initialBlankLine),
                      u(e, n, 'listItemIndent', r.containerState.size + 1)(t)
                    )
                  },
                  function (t) {
                    if (r.containerState.furtherBlankLines || !i(t))
                      return (
                        (r.containerState.furtherBlankLines =
                          r.containerState.initialBlankLine =
                            void 0),
                        o(t)
                      )
                    return (
                      (r.containerState.furtherBlankLines =
                        r.containerState.initialBlankLine =
                          void 0),
                      e.attempt(p, n, o)(t)
                    )
                  },
                )
              )
              function o(i) {
                return (
                  (r.containerState._closeFlow = !0),
                  (r.interrupt = void 0),
                  u(
                    e,
                    e.attempt(c, n, t),
                    'linePrefix',
                    r.parser.constructs.disable.null.indexOf('codeIndented') >
                      -1
                      ? void 0
                      : 4,
                  )(i)
                )
              }
            },
          },
          exit: function (e) {
            e.exit(this.containerState.type)
          },
        },
        f = {
          tokenize: function (e, n, t) {
            var r = this
            return u(
              e,
              function (e) {
                return i(e) || !o(r.events, 'listItemPrefixWhitespace')
                  ? t(e)
                  : n(e)
              },
              'listItemPrefixWhitespace',
              r.parser.constructs.disable.null.indexOf('codeIndented') > -1
                ? void 0
                : 5,
            )
          },
          partial: !0,
        },
        p = {
          tokenize: function (e, n, t) {
            var r = this
            return u(
              e,
              function (e) {
                return o(r.events, 'listItemIndent') === r.containerState.size
                  ? n(e)
                  : t(e)
              },
              'listItemIndent',
              r.containerState.size + 1,
            )
          },
          partial: !0,
        }
      e.exports = c
    },
    6319: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = t(23194),
        o = {
          tokenize: function (e, n, t) {
            return i(
              e,
              function (e) {
                return null === e || r(e) ? n(e) : t(e)
              },
              'linePrefix',
            )
          },
          partial: !0,
        }
      e.exports = o
    },
    56726: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = t(24578),
        o = t(23194),
        l = {
          name: 'setextUnderline',
          tokenize: function (e, n, t) {
            var i,
              l,
              u = this,
              a = u.events.length
            for (; a--; )
              if (
                'lineEnding' !== u.events[a][1].type &&
                'linePrefix' !== u.events[a][1].type &&
                'content' !== u.events[a][1].type
              ) {
                l = 'paragraph' === u.events[a][1].type
                break
              }
            return function (n) {
              if (!u.lazy && (u.interrupt || l))
                return (
                  e.enter('setextHeadingLine'),
                  e.enter('setextHeadingLineSequence'),
                  (i = n),
                  s(n)
                )
              return t(n)
            }
            function s(n) {
              return n === i
                ? (e.consume(n), s)
                : (e.exit('setextHeadingLineSequence'),
                  o(e, c, 'lineSuffix')(n))
            }
            function c(i) {
              return null === i || r(i)
                ? (e.exit('setextHeadingLine'), n(i))
                : t(i)
            }
          },
          resolveTo: function (e, n) {
            var t,
              r,
              o,
              l,
              u = e.length
            for (; u--; )
              if ('enter' === e[u][0]) {
                if ('content' === e[u][1].type) {
                  t = u
                  break
                }
                'paragraph' === e[u][1].type && (r = u)
              } else
                'content' === e[u][1].type && e.splice(u, 1),
                  o || 'definition' !== e[u][1].type || (o = u)
            ;(l = {
              type: 'setextHeading',
              start: i(e[r][1].start),
              end: i(e[e.length - 1][1].end),
            }),
              (e[r][1].type = 'setextHeadingText'),
              o
                ? (e.splice(r, 0, ['enter', l, n]),
                  e.splice(o + 1, 0, ['exit', e[t][1], n]),
                  (e[t][1].end = i(e[o][1].end)))
                : (e[t][1] = l)
            return e.push(['exit', l, n]), e
          },
        }
      e.exports = l
    },
    83605: function (e, n, t) {
      'use strict'
      var r = t(86958),
        i = t(80394),
        o = t(23194),
        l = {
          name: 'thematicBreak',
          tokenize: function (e, n, t) {
            var l,
              u = 0
            return function (n) {
              return e.enter('thematicBreak'), (l = n), a(n)
            }
            function a(c) {
              return c === l
                ? (e.enter('thematicBreakSequence'), s(c))
                : i(c)
                ? o(e, a, 'whitespace')(c)
                : u < 3 || (null !== c && !r(c))
                ? t(c)
                : (e.exit('thematicBreak'), n(c))
            }
            function s(n) {
              return n === l
                ? (e.consume(n), u++, s)
                : (e.exit('thematicBreakSequence'), a(n))
            }
          },
        }
      e.exports = l
    },
    7832: function (e, n, t) {
      'use strict'
      var r = t(62773)
      e.exports = function (e, n) {
        return e.length ? (r(e, e.length, 0, n), e) : n
      }
    },
    62773: function (e, n, t) {
      'use strict'
      var r = t(49233)
      e.exports = function (e, n, t, i) {
        var o,
          l = e.length,
          u = 0
        if (
          ((n = n < 0 ? (-n > l ? 0 : l + n) : n > l ? l : n),
          (t = t > 0 ? t : 0),
          i.length < 1e4)
        )
          (o = Array.from(i)).unshift(n, t), r.apply(e, o)
        else
          for (t && r.apply(e, [n, t]); u < i.length; )
            (o = i.slice(u, u + 1e4)).unshift(n, 0),
              r.apply(e, o),
              (u += 1e4),
              (n += 1e4)
      }
    },
    80282: function (e, n, t) {
      'use strict'
      var r = t(64164),
        i = t(62743),
        o = t(77749)
      e.exports = function (e) {
        return null === e || r(e) || o(e) ? 1 : i(e) ? 2 : void 0
      }
    },
    17633: function (e, n, t) {
      'use strict'
      var r = t(96200),
        i = t(62773),
        o = t(28044)
      function l(e, n) {
        var t, i, l, a
        for (t in n)
          for (a in ((i = r.call(e, t) ? e[t] : (e[t] = {})), (l = n[t])))
            i[a] = u(o(l[a]), r.call(i, a) ? i[a] : [])
      }
      function u(e, n) {
        for (var t = -1, r = []; ++t < e.length; )
          ('after' === e[t].add ? n : r).push(e[t])
        return i(n, 0, 0, r), n
      }
      e.exports = function (e) {
        for (var n = {}, t = -1; ++t < e.length; ) l(n, e[t])
        return n
      }
    },
    29525: function (e, n, t) {
      'use strict'
      var r = t(90399),
        i = t(86958),
        o = t(7832),
        l = t(62773),
        u = t(28044),
        a = t(95025),
        s = t(84758),
        c = t(24578),
        f = t(66833)
      e.exports = function (e, n, t) {
        var p = t ? c(t) : {line: 1, column: 1, offset: 0},
          d = {},
          h = [],
          m = [],
          g = [],
          v = {
            consume: function (e) {
              i(e)
                ? (p.line++,
                  (p.column = 1),
                  (p.offset += -3 === e ? 2 : 1),
                  P())
                : -1 !== e && (p.column++, p.offset++)
              p._bufferIndex < 0
                ? p._index++
                : (p._bufferIndex++,
                  p._bufferIndex === m[p._index].length &&
                    ((p._bufferIndex = -1), p._index++))
              x.previous = e
            },
            enter: function (e, n) {
              var t = n || {}
              return (
                (t.type = e),
                (t.start = b()),
                x.events.push(['enter', t, x]),
                g.push(t),
                t
              )
            },
            exit: function (e) {
              var n = g.pop()
              return (n.end = b()), x.events.push(['exit', n, x]), n
            },
            attempt: C(function (e, n) {
              F(e, n.from)
            }),
            check: C(E),
            interrupt: C(E, {interrupt: !0}),
            lazy: C(E, {lazy: !0}),
          },
          x = {
            previous: null,
            events: [],
            parser: e,
            sliceStream: k,
            sliceSerialize: function (e) {
              return s(k(e))
            },
            now: b,
            defineSkip: function (e) {
              ;(d[e.line] = e.column), P()
            },
            write: function (e) {
              if (((m = o(m, e)), w(), null !== m[m.length - 1])) return []
              return F(n, 0), (x.events = a(h, x.events, x)), x.events
            },
          },
          y = n.tokenize.call(x, v)
        return (
          n.resolveAll && h.push(n), (p._index = 0), (p._bufferIndex = -1), x
        )
        function k(e) {
          return f(m, e)
        }
        function b() {
          return c(p)
        }
        function w() {
          for (var e, n; p._index < m.length; )
            if ('string' === typeof (n = m[p._index]))
              for (
                e = p._index, p._bufferIndex < 0 && (p._bufferIndex = 0);
                p._index === e && p._bufferIndex < n.length;

              )
                S(n.charCodeAt(p._bufferIndex))
            else S(n)
        }
        function S(e) {
          y = y(e)
        }
        function E(e, n) {
          n.restore()
        }
        function C(e, n) {
          return function (t, i, o) {
            var l, a, s, c
            return t.tokenize || 'length' in t
              ? f(u(t))
              : function (e) {
                  if (e in t || null in t)
                    return f(t.null ? u(t[e]).concat(u(t.null)) : t[e])(e)
                  return o(e)
                }
            function f(e) {
              return (l = e), d(e[(a = 0)])
            }
            function d(e) {
              return function (t) {
                ;(c = (function () {
                  var e = b(),
                    n = x.previous,
                    t = x.currentConstruct,
                    r = x.events.length,
                    i = Array.from(g)
                  return {restore: o, from: r}
                  function o() {
                    ;(p = e),
                      (x.previous = n),
                      (x.currentConstruct = t),
                      (x.events.length = r),
                      (g = i),
                      P()
                  }
                })()),
                  (s = e),
                  e.partial || (x.currentConstruct = e)
                if (
                  e.name &&
                  x.parser.constructs.disable.null.indexOf(e.name) > -1
                )
                  return m()
                return e.tokenize.call(n ? r({}, x, n) : x, v, h, m)(t)
              }
            }
            function h(n) {
              return e(s, c), i
            }
            function m(e) {
              return c.restore(), ++a < l.length ? d(l[a]) : o
            }
          }
        }
        function F(e, n) {
          e.resolveAll && h.indexOf(e) < 0 && h.push(e),
            e.resolve &&
              l(
                x.events,
                n,
                x.events.length - n,
                e.resolve(x.events.slice(n), x),
              ),
            e.resolveTo && (x.events = e.resolveTo(x.events, x))
        }
        function P() {
          p.line in d &&
            p.column < 2 &&
            ((p.column = d[p.line]), (p.offset += d[p.line] - 1))
        }
      }
    },
    28044: function (e) {
      'use strict'
      e.exports = function (e) {
        return null === e || void 0 === e ? [] : 'length' in e ? e : [e]
      }
    },
    67249: function (e) {
      'use strict'
      e.exports = function (e, n) {
        return (e.column += n), (e.offset += n), (e._bufferIndex += n), e
      }
    },
    77158: function (e) {
      'use strict'
      e.exports = function (e) {
        return e
          .replace(/[\t\n\r ]+/g, ' ')
          .replace(/^ | $/g, '')
          .toLowerCase()
          .toUpperCase()
      }
    },
    24222: function (e, n, t) {
      'use strict'
      var r = t(22527)
      e.exports = function (e, n) {
        var t = e[e.length - 1]
        return t && t[1].type === n ? r(t[2].sliceStream(t[1])) : 0
      }
    },
    64986: function (e, n, t) {
      'use strict'
      var r = t(51854)
      e.exports = function (e) {
        return function (n) {
          return e.test(r(n))
        }
      }
    },
    95025: function (e) {
      'use strict'
      e.exports = function (e, n, t) {
        for (var r, i = [], o = -1; ++o < e.length; )
          (r = e[o].resolveAll) &&
            i.indexOf(r) < 0 &&
            ((n = r(n, t)), i.push(r))
        return n
      }
    },
    25256: function (e, n, t) {
      'use strict'
      var r = t(51854)
      e.exports = function (e, n) {
        var t = parseInt(e, n)
        return t < 9 ||
          11 === t ||
          (t > 13 && t < 32) ||
          (t > 126 && t < 160) ||
          (t > 55295 && t < 57344) ||
          (t > 64975 && t < 65008) ||
          65535 === (65535 & t) ||
          65534 === (65535 & t) ||
          t > 1114111
          ? '\ufffd'
          : r(t)
      }
    },
    84758: function (e, n, t) {
      'use strict'
      var r = t(51854)
      e.exports = function (e) {
        for (var n, t, i, o = -1, l = []; ++o < e.length; ) {
          if ('string' === typeof (n = e[o])) t = n
          else if (-5 === n) t = '\r'
          else if (-4 === n) t = '\n'
          else if (-3 === n) t = '\r\n'
          else if (-2 === n) t = '\t'
          else if (-1 === n) {
            if (i) continue
            t = ' '
          } else t = r(n)
          ;(i = -2 === n), l.push(t)
        }
        return l.join('')
      }
    },
    24578: function (e, n, t) {
      'use strict'
      var r = t(90399)
      e.exports = function (e) {
        return r({}, e)
      }
    },
    22527: function (e) {
      'use strict'
      e.exports = function (e) {
        for (var n = -1, t = 0; ++n < e.length; )
          t += 'string' === typeof e[n] ? e[n].length : 1
        return t
      }
    },
    66833: function (e) {
      'use strict'
      e.exports = function (e, n) {
        var t,
          r = n.start._index,
          i = n.start._bufferIndex,
          o = n.end._index,
          l = n.end._bufferIndex
        return (
          r === o
            ? (t = [e[r].slice(i, l)])
            : ((t = e.slice(r, o)),
              i > -1 && (t[0] = t[0].slice(i)),
              l > 0 && t.push(e[o].slice(0, l))),
          t
        )
      }
    },
    45539: function (e, n, t) {
      'use strict'
      var r = t(90399),
        i = t(62773),
        o = t(24578)
      function l(e, n) {
        for (
          var t,
            r,
            o,
            l,
            u,
            a,
            s = e[n][1],
            c = e[n][2],
            f = n - 1,
            p = [],
            d = s._tokenizer || c.parser[s.contentType](s.start),
            h = d.events,
            m = [],
            g = {};
          s;

        ) {
          for (; e[++f][1] !== s; );
          p.push(f),
            s._tokenizer ||
              ((t = c.sliceStream(s)),
              s.next || t.push(null),
              r && d.defineSkip(s.start),
              s.isInFirstContentOfListItem &&
                (d._gfmTasklistFirstContentOfListItem = !0),
              d.write(t),
              s.isInFirstContentOfListItem &&
                (d._gfmTasklistFirstContentOfListItem = void 0)),
            (r = s),
            (s = s.next)
        }
        for (s = r, o = h.length; o--; )
          'enter' === h[o][0]
            ? (l = !0)
            : l &&
              h[o][1].type === h[o - 1][1].type &&
              h[o][1].start.line !== h[o][1].end.line &&
              (v(h.slice(o + 1, u)),
              (s._tokenizer = s.next = void 0),
              (s = s.previous),
              (u = o + 1))
        for (
          d.events = s._tokenizer = s.next = void 0,
            v(h.slice(0, u)),
            o = -1,
            a = 0;
          ++o < m.length;

        )
          (g[a + m[o][0]] = a + m[o][1]), (a += m[o][1] - m[o][0] - 1)
        return g
        function v(n) {
          var t = p.pop()
          m.unshift([t, t + n.length - 1]), i(e, t, 2, n)
        }
      }
      e.exports = function (e) {
        for (var n, t, u, a, s, c, f, p = {}, d = -1; ++d < e.length; ) {
          for (; d in p; ) d = p[d]
          if (
            ((n = e[d]),
            d &&
              'chunkFlow' === n[1].type &&
              'listItemPrefix' === e[d - 1][1].type &&
              ((u = 0) < (c = n[1]._tokenizer.events).length &&
                'lineEndingBlank' === c[u][1].type &&
                (u += 2),
              u < c.length && 'content' === c[u][1].type))
          )
            for (; ++u < c.length && 'content' !== c[u][1].type; )
              'chunkText' === c[u][1].type &&
                ((c[u][1].isInFirstContentOfListItem = !0), u++)
          if ('enter' === n[0])
            n[1].contentType && (r(p, l(e, d)), (d = p[d]), (f = !0))
          else if (n[1]._container || n[1]._movePreviousLineEndings) {
            for (
              u = d, t = void 0;
              u-- &&
              ('lineEnding' === (a = e[u])[1].type ||
                'lineEndingBlank' === a[1].type);

            )
              'enter' === a[0] &&
                (t && (e[t][1].type = 'lineEndingBlank'),
                (a[1].type = 'lineEnding'),
                (t = u))
            t &&
              ((n[1].end = o(e[t][1].start)),
              (s = e.slice(t, d)).unshift(n),
              i(e, t, d - t + 1, s))
          }
        }
        return !f
      }
    },
    18889: function (e) {
      'use strict'
      var n
      e.exports = function (e) {
        var t,
          r = '&' + e + ';'
        if (
          (((n = n || document.createElement('i')).innerHTML = r),
          59 === (t = n.textContent).charCodeAt(t.length - 1) && 'semi' !== e)
        )
          return !1
        return t !== r && t
      }
    },
    58277: function (e, n, t) {
      'use strict'
      var r = t(43147)
      function i() {}
      function o() {}
      ;(o.resetWarningCache = i),
        (e.exports = function () {
          function e(e, n, t, i, o, l) {
            if (l !== r) {
              var u = new Error(
                'Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types',
              )
              throw ((u.name = 'Invariant Violation'), u)
            }
          }
          function n() {
            return e
          }
          e.isRequired = e
          var t = {
            array: e,
            bool: e,
            func: e,
            number: e,
            object: e,
            string: e,
            symbol: e,
            any: e,
            arrayOf: n,
            element: e,
            elementType: e,
            instanceOf: n,
            node: e,
            objectOf: n,
            oneOf: n,
            oneOfType: n,
            shape: n,
            exact: n,
            checkPropTypes: o,
            resetWarningCache: i,
          }
          return (t.PropTypes = t), t
        })
    },
    69480: function (e, n, t) {
      e.exports = t(58277)()
    },
    43147: function (e) {
      'use strict'
      e.exports = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'
    },
    92113: function (e, n, t) {
      'use strict'
      var r = t(13725),
        i = t(51252),
        o = t(31364),
        l = 'data'
      e.exports = function (e, n) {
        var t = r(n),
          p = n,
          d = o
        if (t in e.normal) return e.property[e.normal[t]]
        t.length > 4 &&
          t.slice(0, 4) === l &&
          u.test(n) &&
          ('-' === n.charAt(4)
            ? (p = (function (e) {
                var n = e.slice(5).replace(a, f)
                return l + n.charAt(0).toUpperCase() + n.slice(1)
              })(n))
            : (n = (function (e) {
                var n = e.slice(4)
                if (a.test(n)) return e
                '-' !== (n = n.replace(s, c)).charAt(0) && (n = '-' + n)
                return l + n
              })(n)),
          (d = i))
        return new d(p, n)
      }
      var u = /^data[-\w.:]+$/i,
        a = /-[a-z]/g,
        s = /[A-Z]/g
      function c(e) {
        return '-' + e.toLowerCase()
      }
      function f(e) {
        return e.charAt(1).toUpperCase()
      }
    },
    85318: function (e, n, t) {
      'use strict'
      var r = t(14470),
        i = t(90148),
        o = t(26407),
        l = t(75335),
        u = t(75107),
        a = t(42320)
      e.exports = r([o, i, l, u, a])
    },
    75107: function (e, n, t) {
      'use strict'
      var r = t(66280),
        i = t(94525),
        o = r.booleanish,
        l = r.number,
        u = r.spaceSeparated
      e.exports = i({
        transform: function (e, n) {
          return 'role' === n ? n : 'aria-' + n.slice(4).toLowerCase()
        },
        properties: {
          ariaActiveDescendant: null,
          ariaAtomic: o,
          ariaAutoComplete: null,
          ariaBusy: o,
          ariaChecked: o,
          ariaColCount: l,
          ariaColIndex: l,
          ariaColSpan: l,
          ariaControls: u,
          ariaCurrent: null,
          ariaDescribedBy: u,
          ariaDetails: null,
          ariaDisabled: o,
          ariaDropEffect: u,
          ariaErrorMessage: null,
          ariaExpanded: o,
          ariaFlowTo: u,
          ariaGrabbed: o,
          ariaHasPopup: null,
          ariaHidden: o,
          ariaInvalid: null,
          ariaKeyShortcuts: null,
          ariaLabel: null,
          ariaLabelledBy: u,
          ariaLevel: l,
          ariaLive: null,
          ariaModal: o,
          ariaMultiLine: o,
          ariaMultiSelectable: o,
          ariaOrientation: null,
          ariaOwns: u,
          ariaPlaceholder: null,
          ariaPosInSet: l,
          ariaPressed: o,
          ariaReadOnly: o,
          ariaRelevant: null,
          ariaRequired: o,
          ariaRoleDescription: u,
          ariaRowCount: l,
          ariaRowIndex: l,
          ariaRowSpan: l,
          ariaSelected: o,
          ariaSetSize: l,
          ariaSort: null,
          ariaValueMax: l,
          ariaValueMin: l,
          ariaValueNow: l,
          ariaValueText: null,
          role: null,
        },
      })
    },
    42320: function (e, n, t) {
      'use strict'
      var r = t(66280),
        i = t(94525),
        o = t(28874),
        l = r.boolean,
        u = r.overloadedBoolean,
        a = r.booleanish,
        s = r.number,
        c = r.spaceSeparated,
        f = r.commaSeparated
      e.exports = i({
        space: 'html',
        attributes: {
          acceptcharset: 'accept-charset',
          classname: 'class',
          htmlfor: 'for',
          httpequiv: 'http-equiv',
        },
        transform: o,
        mustUseProperty: ['checked', 'multiple', 'muted', 'selected'],
        properties: {
          abbr: null,
          accept: f,
          acceptCharset: c,
          accessKey: c,
          action: null,
          allow: null,
          allowFullScreen: l,
          allowPaymentRequest: l,
          allowUserMedia: l,
          alt: null,
          as: null,
          async: l,
          autoCapitalize: null,
          autoComplete: c,
          autoFocus: l,
          autoPlay: l,
          capture: l,
          charSet: null,
          checked: l,
          cite: null,
          className: c,
          cols: s,
          colSpan: null,
          content: null,
          contentEditable: a,
          controls: l,
          controlsList: c,
          coords: s | f,
          crossOrigin: null,
          data: null,
          dateTime: null,
          decoding: null,
          default: l,
          defer: l,
          dir: null,
          dirName: null,
          disabled: l,
          download: u,
          draggable: a,
          encType: null,
          enterKeyHint: null,
          form: null,
          formAction: null,
          formEncType: null,
          formMethod: null,
          formNoValidate: l,
          formTarget: null,
          headers: c,
          height: s,
          hidden: l,
          high: s,
          href: null,
          hrefLang: null,
          htmlFor: c,
          httpEquiv: c,
          id: null,
          imageSizes: null,
          imageSrcSet: f,
          inputMode: null,
          integrity: null,
          is: null,
          isMap: l,
          itemId: null,
          itemProp: c,
          itemRef: c,
          itemScope: l,
          itemType: c,
          kind: null,
          label: null,
          lang: null,
          language: null,
          list: null,
          loading: null,
          loop: l,
          low: s,
          manifest: null,
          max: null,
          maxLength: s,
          media: null,
          method: null,
          min: null,
          minLength: s,
          multiple: l,
          muted: l,
          name: null,
          nonce: null,
          noModule: l,
          noValidate: l,
          onAbort: null,
          onAfterPrint: null,
          onAuxClick: null,
          onBeforePrint: null,
          onBeforeUnload: null,
          onBlur: null,
          onCancel: null,
          onCanPlay: null,
          onCanPlayThrough: null,
          onChange: null,
          onClick: null,
          onClose: null,
          onContextMenu: null,
          onCopy: null,
          onCueChange: null,
          onCut: null,
          onDblClick: null,
          onDrag: null,
          onDragEnd: null,
          onDragEnter: null,
          onDragExit: null,
          onDragLeave: null,
          onDragOver: null,
          onDragStart: null,
          onDrop: null,
          onDurationChange: null,
          onEmptied: null,
          onEnded: null,
          onError: null,
          onFocus: null,
          onFormData: null,
          onHashChange: null,
          onInput: null,
          onInvalid: null,
          onKeyDown: null,
          onKeyPress: null,
          onKeyUp: null,
          onLanguageChange: null,
          onLoad: null,
          onLoadedData: null,
          onLoadedMetadata: null,
          onLoadEnd: null,
          onLoadStart: null,
          onMessage: null,
          onMessageError: null,
          onMouseDown: null,
          onMouseEnter: null,
          onMouseLeave: null,
          onMouseMove: null,
          onMouseOut: null,
          onMouseOver: null,
          onMouseUp: null,
          onOffline: null,
          onOnline: null,
          onPageHide: null,
          onPageShow: null,
          onPaste: null,
          onPause: null,
          onPlay: null,
          onPlaying: null,
          onPopState: null,
          onProgress: null,
          onRateChange: null,
          onRejectionHandled: null,
          onReset: null,
          onResize: null,
          onScroll: null,
          onSecurityPolicyViolation: null,
          onSeeked: null,
          onSeeking: null,
          onSelect: null,
          onSlotChange: null,
          onStalled: null,
          onStorage: null,
          onSubmit: null,
          onSuspend: null,
          onTimeUpdate: null,
          onToggle: null,
          onUnhandledRejection: null,
          onUnload: null,
          onVolumeChange: null,
          onWaiting: null,
          onWheel: null,
          open: l,
          optimum: s,
          pattern: null,
          ping: c,
          placeholder: null,
          playsInline: l,
          poster: null,
          preload: null,
          readOnly: l,
          referrerPolicy: null,
          rel: c,
          required: l,
          reversed: l,
          rows: s,
          rowSpan: s,
          sandbox: c,
          scope: null,
          scoped: l,
          seamless: l,
          selected: l,
          shape: null,
          size: s,
          sizes: null,
          slot: null,
          span: s,
          spellCheck: a,
          src: null,
          srcDoc: null,
          srcLang: null,
          srcSet: f,
          start: s,
          step: null,
          style: null,
          tabIndex: s,
          target: null,
          title: null,
          translate: null,
          type: null,
          typeMustMatch: l,
          useMap: null,
          value: a,
          width: s,
          wrap: null,
          align: null,
          aLink: null,
          archive: c,
          axis: null,
          background: null,
          bgColor: null,
          border: s,
          borderColor: null,
          bottomMargin: s,
          cellPadding: null,
          cellSpacing: null,
          char: null,
          charOff: null,
          classId: null,
          clear: null,
          code: null,
          codeBase: null,
          codeType: null,
          color: null,
          compact: l,
          declare: l,
          event: null,
          face: null,
          frame: null,
          frameBorder: null,
          hSpace: s,
          leftMargin: s,
          link: null,
          longDesc: null,
          lowSrc: null,
          marginHeight: s,
          marginWidth: s,
          noResize: l,
          noHref: l,
          noShade: l,
          noWrap: l,
          object: null,
          profile: null,
          prompt: null,
          rev: null,
          rightMargin: s,
          rules: null,
          scheme: null,
          scrolling: a,
          standby: null,
          summary: null,
          text: null,
          topMargin: s,
          valueType: null,
          version: null,
          vAlign: null,
          vLink: null,
          vSpace: s,
          allowTransparency: null,
          autoCorrect: null,
          autoSave: null,
          disablePictureInPicture: l,
          disableRemotePlayback: l,
          prefix: null,
          property: null,
          results: s,
          security: null,
          unselectable: null,
        },
      })
    },
    2132: function (e, n, t) {
      'use strict'
      var r = t(66280),
        i = t(94525),
        o = t(83626),
        l = r.boolean,
        u = r.number,
        a = r.spaceSeparated,
        s = r.commaSeparated,
        c = r.commaOrSpaceSeparated
      e.exports = i({
        space: 'svg',
        attributes: {
          accentHeight: 'accent-height',
          alignmentBaseline: 'alignment-baseline',
          arabicForm: 'arabic-form',
          baselineShift: 'baseline-shift',
          capHeight: 'cap-height',
          className: 'class',
          clipPath: 'clip-path',
          clipRule: 'clip-rule',
          colorInterpolation: 'color-interpolation',
          colorInterpolationFilters: 'color-interpolation-filters',
          colorProfile: 'color-profile',
          colorRendering: 'color-rendering',
          crossOrigin: 'crossorigin',
          dataType: 'datatype',
          dominantBaseline: 'dominant-baseline',
          enableBackground: 'enable-background',
          fillOpacity: 'fill-opacity',
          fillRule: 'fill-rule',
          floodColor: 'flood-color',
          floodOpacity: 'flood-opacity',
          fontFamily: 'font-family',
          fontSize: 'font-size',
          fontSizeAdjust: 'font-size-adjust',
          fontStretch: 'font-stretch',
          fontStyle: 'font-style',
          fontVariant: 'font-variant',
          fontWeight: 'font-weight',
          glyphName: 'glyph-name',
          glyphOrientationHorizontal: 'glyph-orientation-horizontal',
          glyphOrientationVertical: 'glyph-orientation-vertical',
          hrefLang: 'hreflang',
          horizAdvX: 'horiz-adv-x',
          horizOriginX: 'horiz-origin-x',
          horizOriginY: 'horiz-origin-y',
          imageRendering: 'image-rendering',
          letterSpacing: 'letter-spacing',
          lightingColor: 'lighting-color',
          markerEnd: 'marker-end',
          markerMid: 'marker-mid',
          markerStart: 'marker-start',
          navDown: 'nav-down',
          navDownLeft: 'nav-down-left',
          navDownRight: 'nav-down-right',
          navLeft: 'nav-left',
          navNext: 'nav-next',
          navPrev: 'nav-prev',
          navRight: 'nav-right',
          navUp: 'nav-up',
          navUpLeft: 'nav-up-left',
          navUpRight: 'nav-up-right',
          onAbort: 'onabort',
          onActivate: 'onactivate',
          onAfterPrint: 'onafterprint',
          onBeforePrint: 'onbeforeprint',
          onBegin: 'onbegin',
          onCancel: 'oncancel',
          onCanPlay: 'oncanplay',
          onCanPlayThrough: 'oncanplaythrough',
          onChange: 'onchange',
          onClick: 'onclick',
          onClose: 'onclose',
          onCopy: 'oncopy',
          onCueChange: 'oncuechange',
          onCut: 'oncut',
          onDblClick: 'ondblclick',
          onDrag: 'ondrag',
          onDragEnd: 'ondragend',
          onDragEnter: 'ondragenter',
          onDragExit: 'ondragexit',
          onDragLeave: 'ondragleave',
          onDragOver: 'ondragover',
          onDragStart: 'ondragstart',
          onDrop: 'ondrop',
          onDurationChange: 'ondurationchange',
          onEmptied: 'onemptied',
          onEnd: 'onend',
          onEnded: 'onended',
          onError: 'onerror',
          onFocus: 'onfocus',
          onFocusIn: 'onfocusin',
          onFocusOut: 'onfocusout',
          onHashChange: 'onhashchange',
          onInput: 'oninput',
          onInvalid: 'oninvalid',
          onKeyDown: 'onkeydown',
          onKeyPress: 'onkeypress',
          onKeyUp: 'onkeyup',
          onLoad: 'onload',
          onLoadedData: 'onloadeddata',
          onLoadedMetadata: 'onloadedmetadata',
          onLoadStart: 'onloadstart',
          onMessage: 'onmessage',
          onMouseDown: 'onmousedown',
          onMouseEnter: 'onmouseenter',
          onMouseLeave: 'onmouseleave',
          onMouseMove: 'onmousemove',
          onMouseOut: 'onmouseout',
          onMouseOver: 'onmouseover',
          onMouseUp: 'onmouseup',
          onMouseWheel: 'onmousewheel',
          onOffline: 'onoffline',
          onOnline: 'ononline',
          onPageHide: 'onpagehide',
          onPageShow: 'onpageshow',
          onPaste: 'onpaste',
          onPause: 'onpause',
          onPlay: 'onplay',
          onPlaying: 'onplaying',
          onPopState: 'onpopstate',
          onProgress: 'onprogress',
          onRateChange: 'onratechange',
          onRepeat: 'onrepeat',
          onReset: 'onreset',
          onResize: 'onresize',
          onScroll: 'onscroll',
          onSeeked: 'onseeked',
          onSeeking: 'onseeking',
          onSelect: 'onselect',
          onShow: 'onshow',
          onStalled: 'onstalled',
          onStorage: 'onstorage',
          onSubmit: 'onsubmit',
          onSuspend: 'onsuspend',
          onTimeUpdate: 'ontimeupdate',
          onToggle: 'ontoggle',
          onUnload: 'onunload',
          onVolumeChange: 'onvolumechange',
          onWaiting: 'onwaiting',
          onZoom: 'onzoom',
          overlinePosition: 'overline-position',
          overlineThickness: 'overline-thickness',
          paintOrder: 'paint-order',
          panose1: 'panose-1',
          pointerEvents: 'pointer-events',
          referrerPolicy: 'referrerpolicy',
          renderingIntent: 'rendering-intent',
          shapeRendering: 'shape-rendering',
          stopColor: 'stop-color',
          stopOpacity: 'stop-opacity',
          strikethroughPosition: 'strikethrough-position',
          strikethroughThickness: 'strikethrough-thickness',
          strokeDashArray: 'stroke-dasharray',
          strokeDashOffset: 'stroke-dashoffset',
          strokeLineCap: 'stroke-linecap',
          strokeLineJoin: 'stroke-linejoin',
          strokeMiterLimit: 'stroke-miterlimit',
          strokeOpacity: 'stroke-opacity',
          strokeWidth: 'stroke-width',
          tabIndex: 'tabindex',
          textAnchor: 'text-anchor',
          textDecoration: 'text-decoration',
          textRendering: 'text-rendering',
          typeOf: 'typeof',
          underlinePosition: 'underline-position',
          underlineThickness: 'underline-thickness',
          unicodeBidi: 'unicode-bidi',
          unicodeRange: 'unicode-range',
          unitsPerEm: 'units-per-em',
          vAlphabetic: 'v-alphabetic',
          vHanging: 'v-hanging',
          vIdeographic: 'v-ideographic',
          vMathematical: 'v-mathematical',
          vectorEffect: 'vector-effect',
          vertAdvY: 'vert-adv-y',
          vertOriginX: 'vert-origin-x',
          vertOriginY: 'vert-origin-y',
          wordSpacing: 'word-spacing',
          writingMode: 'writing-mode',
          xHeight: 'x-height',
          playbackOrder: 'playbackorder',
          timelineBegin: 'timelinebegin',
        },
        transform: o,
        properties: {
          about: c,
          accentHeight: u,
          accumulate: null,
          additive: null,
          alignmentBaseline: null,
          alphabetic: u,
          amplitude: u,
          arabicForm: null,
          ascent: u,
          attributeName: null,
          attributeType: null,
          azimuth: u,
          bandwidth: null,
          baselineShift: null,
          baseFrequency: null,
          baseProfile: null,
          bbox: null,
          begin: null,
          bias: u,
          by: null,
          calcMode: null,
          capHeight: u,
          className: a,
          clip: null,
          clipPath: null,
          clipPathUnits: null,
          clipRule: null,
          color: null,
          colorInterpolation: null,
          colorInterpolationFilters: null,
          colorProfile: null,
          colorRendering: null,
          content: null,
          contentScriptType: null,
          contentStyleType: null,
          crossOrigin: null,
          cursor: null,
          cx: null,
          cy: null,
          d: null,
          dataType: null,
          defaultAction: null,
          descent: u,
          diffuseConstant: u,
          direction: null,
          display: null,
          dur: null,
          divisor: u,
          dominantBaseline: null,
          download: l,
          dx: null,
          dy: null,
          edgeMode: null,
          editable: null,
          elevation: u,
          enableBackground: null,
          end: null,
          event: null,
          exponent: u,
          externalResourcesRequired: null,
          fill: null,
          fillOpacity: u,
          fillRule: null,
          filter: null,
          filterRes: null,
          filterUnits: null,
          floodColor: null,
          floodOpacity: null,
          focusable: null,
          focusHighlight: null,
          fontFamily: null,
          fontSize: null,
          fontSizeAdjust: null,
          fontStretch: null,
          fontStyle: null,
          fontVariant: null,
          fontWeight: null,
          format: null,
          fr: null,
          from: null,
          fx: null,
          fy: null,
          g1: s,
          g2: s,
          glyphName: s,
          glyphOrientationHorizontal: null,
          glyphOrientationVertical: null,
          glyphRef: null,
          gradientTransform: null,
          gradientUnits: null,
          handler: null,
          hanging: u,
          hatchContentUnits: null,
          hatchUnits: null,
          height: null,
          href: null,
          hrefLang: null,
          horizAdvX: u,
          horizOriginX: u,
          horizOriginY: u,
          id: null,
          ideographic: u,
          imageRendering: null,
          initialVisibility: null,
          in: null,
          in2: null,
          intercept: u,
          k: u,
          k1: u,
          k2: u,
          k3: u,
          k4: u,
          kernelMatrix: c,
          kernelUnitLength: null,
          keyPoints: null,
          keySplines: null,
          keyTimes: null,
          kerning: null,
          lang: null,
          lengthAdjust: null,
          letterSpacing: null,
          lightingColor: null,
          limitingConeAngle: u,
          local: null,
          markerEnd: null,
          markerMid: null,
          markerStart: null,
          markerHeight: null,
          markerUnits: null,
          markerWidth: null,
          mask: null,
          maskContentUnits: null,
          maskUnits: null,
          mathematical: null,
          max: null,
          media: null,
          mediaCharacterEncoding: null,
          mediaContentEncodings: null,
          mediaSize: u,
          mediaTime: null,
          method: null,
          min: null,
          mode: null,
          name: null,
          navDown: null,
          navDownLeft: null,
          navDownRight: null,
          navLeft: null,
          navNext: null,
          navPrev: null,
          navRight: null,
          navUp: null,
          navUpLeft: null,
          navUpRight: null,
          numOctaves: null,
          observer: null,
          offset: null,
          onAbort: null,
          onActivate: null,
          onAfterPrint: null,
          onBeforePrint: null,
          onBegin: null,
          onCancel: null,
          onCanPlay: null,
          onCanPlayThrough: null,
          onChange: null,
          onClick: null,
          onClose: null,
          onCopy: null,
          onCueChange: null,
          onCut: null,
          onDblClick: null,
          onDrag: null,
          onDragEnd: null,
          onDragEnter: null,
          onDragExit: null,
          onDragLeave: null,
          onDragOver: null,
          onDragStart: null,
          onDrop: null,
          onDurationChange: null,
          onEmptied: null,
          onEnd: null,
          onEnded: null,
          onError: null,
          onFocus: null,
          onFocusIn: null,
          onFocusOut: null,
          onHashChange: null,
          onInput: null,
          onInvalid: null,
          onKeyDown: null,
          onKeyPress: null,
          onKeyUp: null,
          onLoad: null,
          onLoadedData: null,
          onLoadedMetadata: null,
          onLoadStart: null,
          onMessage: null,
          onMouseDown: null,
          onMouseEnter: null,
          onMouseLeave: null,
          onMouseMove: null,
          onMouseOut: null,
          onMouseOver: null,
          onMouseUp: null,
          onMouseWheel: null,
          onOffline: null,
          onOnline: null,
          onPageHide: null,
          onPageShow: null,
          onPaste: null,
          onPause: null,
          onPlay: null,
          onPlaying: null,
          onPopState: null,
          onProgress: null,
          onRateChange: null,
          onRepeat: null,
          onReset: null,
          onResize: null,
          onScroll: null,
          onSeeked: null,
          onSeeking: null,
          onSelect: null,
          onShow: null,
          onStalled: null,
          onStorage: null,
          onSubmit: null,
          onSuspend: null,
          onTimeUpdate: null,
          onToggle: null,
          onUnload: null,
          onVolumeChange: null,
          onWaiting: null,
          onZoom: null,
          opacity: null,
          operator: null,
          order: null,
          orient: null,
          orientation: null,
          origin: null,
          overflow: null,
          overlay: null,
          overlinePosition: u,
          overlineThickness: u,
          paintOrder: null,
          panose1: null,
          path: null,
          pathLength: u,
          patternContentUnits: null,
          patternTransform: null,
          patternUnits: null,
          phase: null,
          ping: a,
          pitch: null,
          playbackOrder: null,
          pointerEvents: null,
          points: null,
          pointsAtX: u,
          pointsAtY: u,
          pointsAtZ: u,
          preserveAlpha: null,
          preserveAspectRatio: null,
          primitiveUnits: null,
          propagate: null,
          property: c,
          r: null,
          radius: null,
          referrerPolicy: null,
          refX: null,
          refY: null,
          rel: c,
          rev: c,
          renderingIntent: null,
          repeatCount: null,
          repeatDur: null,
          requiredExtensions: c,
          requiredFeatures: c,
          requiredFonts: c,
          requiredFormats: c,
          resource: null,
          restart: null,
          result: null,
          rotate: null,
          rx: null,
          ry: null,
          scale: null,
          seed: null,
          shapeRendering: null,
          side: null,
          slope: null,
          snapshotTime: null,
          specularConstant: u,
          specularExponent: u,
          spreadMethod: null,
          spacing: null,
          startOffset: null,
          stdDeviation: null,
          stemh: null,
          stemv: null,
          stitchTiles: null,
          stopColor: null,
          stopOpacity: null,
          strikethroughPosition: u,
          strikethroughThickness: u,
          string: null,
          stroke: null,
          strokeDashArray: c,
          strokeDashOffset: null,
          strokeLineCap: null,
          strokeLineJoin: null,
          strokeMiterLimit: u,
          strokeOpacity: u,
          strokeWidth: null,
          style: null,
          surfaceScale: u,
          syncBehavior: null,
          syncBehaviorDefault: null,
          syncMaster: null,
          syncTolerance: null,
          syncToleranceDefault: null,
          systemLanguage: c,
          tabIndex: u,
          tableValues: null,
          target: null,
          targetX: u,
          targetY: u,
          textAnchor: null,
          textDecoration: null,
          textRendering: null,
          textLength: null,
          timelineBegin: null,
          title: null,
          transformBehavior: null,
          type: null,
          typeOf: c,
          to: null,
          transform: null,
          u1: null,
          u2: null,
          underlinePosition: u,
          underlineThickness: u,
          unicode: null,
          unicodeBidi: null,
          unicodeRange: null,
          unitsPerEm: u,
          values: null,
          vAlphabetic: u,
          vMathematical: u,
          vectorEffect: null,
          vHanging: u,
          vIdeographic: u,
          version: null,
          vertAdvY: u,
          vertOriginX: u,
          vertOriginY: u,
          viewBox: null,
          viewTarget: null,
          visibility: null,
          width: null,
          widths: null,
          wordSpacing: null,
          writingMode: null,
          x: null,
          x1: null,
          x2: null,
          xChannelSelector: null,
          xHeight: u,
          y: null,
          y1: null,
          y2: null,
          yChannelSelector: null,
          z: null,
          zoomAndPan: null,
        },
      })
    },
    28874: function (e, n, t) {
      'use strict'
      var r = t(83626)
      e.exports = function (e, n) {
        return r(e, n.toLowerCase())
      }
    },
    83626: function (e) {
      'use strict'
      e.exports = function (e, n) {
        return n in e ? e[n] : n
      }
    },
    94525: function (e, n, t) {
      'use strict'
      var r = t(13725),
        i = t(69725),
        o = t(51252)
      e.exports = function (e) {
        var n,
          t,
          l = e.space,
          u = e.mustUseProperty || [],
          a = e.attributes || {},
          s = e.properties,
          c = e.transform,
          f = {},
          p = {}
        for (n in s)
          (t = new o(n, c(a, n), s[n], l)),
            -1 !== u.indexOf(n) && (t.mustUseProperty = !0),
            (f[n] = t),
            (p[r(n)] = n),
            (p[r(t.attribute)] = n)
        return new i(f, p, l)
      }
    },
    51252: function (e, n, t) {
      'use strict'
      var r = t(31364),
        i = t(66280)
      ;(e.exports = u), (u.prototype = new r()), (u.prototype.defined = !0)
      var o = [
          'boolean',
          'booleanish',
          'overloadedBoolean',
          'number',
          'commaSeparated',
          'spaceSeparated',
          'commaOrSpaceSeparated',
        ],
        l = o.length
      function u(e, n, t, u) {
        var s,
          c = -1
        for (a(this, 'space', u), r.call(this, e, n); ++c < l; )
          a(this, (s = o[c]), (t & i[s]) === i[s])
      }
      function a(e, n, t) {
        t && (e[n] = t)
      }
    },
    31364: function (e) {
      'use strict'
      e.exports = t
      var n = t.prototype
      function t(e, n) {
        ;(this.property = e), (this.attribute = n)
      }
      ;(n.space = null),
        (n.attribute = null),
        (n.property = null),
        (n.boolean = !1),
        (n.booleanish = !1),
        (n.overloadedBoolean = !1),
        (n.number = !1),
        (n.commaSeparated = !1),
        (n.spaceSeparated = !1),
        (n.commaOrSpaceSeparated = !1),
        (n.mustUseProperty = !1),
        (n.defined = !1)
    },
    14470: function (e, n, t) {
      'use strict'
      var r = t(31693),
        i = t(69725)
      e.exports = function (e) {
        var n,
          t,
          o = e.length,
          l = [],
          u = [],
          a = -1
        for (; ++a < o; )
          (n = e[a]), l.push(n.property), u.push(n.normal), (t = n.space)
        return new i(r.apply(null, l), r.apply(null, u), t)
      }
    },
    69725: function (e) {
      'use strict'
      e.exports = t
      var n = t.prototype
      function t(e, n, t) {
        ;(this.property = e), (this.normal = n), t && (this.space = t)
      }
      ;(n.space = null), (n.normal = {}), (n.property = {})
    },
    66280: function (e, n) {
      'use strict'
      var t = 0
      function r() {
        return Math.pow(2, ++t)
      }
      ;(n.boolean = r()),
        (n.booleanish = r()),
        (n.overloadedBoolean = r()),
        (n.number = r()),
        (n.spaceSeparated = r()),
        (n.commaSeparated = r()),
        (n.commaOrSpaceSeparated = r())
    },
    90148: function (e, n, t) {
      'use strict'
      var r = t(94525)
      e.exports = r({
        space: 'xlink',
        transform: function (e, n) {
          return 'xlink:' + n.slice(5).toLowerCase()
        },
        properties: {
          xLinkActuate: null,
          xLinkArcRole: null,
          xLinkHref: null,
          xLinkRole: null,
          xLinkShow: null,
          xLinkTitle: null,
          xLinkType: null,
        },
      })
    },
    26407: function (e, n, t) {
      'use strict'
      var r = t(94525)
      e.exports = r({
        space: 'xml',
        transform: function (e, n) {
          return 'xml:' + n.slice(3).toLowerCase()
        },
        properties: {xmlLang: null, xmlBase: null, xmlSpace: null},
      })
    },
    75335: function (e, n, t) {
      'use strict'
      var r = t(94525),
        i = t(28874)
      e.exports = r({
        space: 'xmlns',
        attributes: {xmlnsxlink: 'xmlns:xlink'},
        transform: i,
        properties: {xmlns: null, xmlnsXLink: null},
      })
    },
    13725: function (e) {
      'use strict'
      e.exports = function (e) {
        return e.toLowerCase()
      }
    },
    81301: function (e, n, t) {
      'use strict'
      var r = t(14470),
        i = t(90148),
        o = t(26407),
        l = t(75335),
        u = t(75107),
        a = t(2132)
      e.exports = r([o, i, l, u, a])
    },
    2226: function (e, n) {
      'use strict'
      var t = 60103,
        r = 60106,
        i = 60107,
        o = 60108,
        l = 60114,
        u = 60109,
        a = 60110,
        s = 60112,
        c = 60113,
        f = 60120,
        p = 60115,
        d = 60116,
        h = 60121,
        m = 60122,
        g = 60117,
        v = 60129,
        x = 60131
      if ('function' === typeof Symbol && Symbol.for) {
        var y = Symbol.for
        ;(t = y('react.element')),
          (r = y('react.portal')),
          (i = y('react.fragment')),
          (o = y('react.strict_mode')),
          (l = y('react.profiler')),
          (u = y('react.provider')),
          (a = y('react.context')),
          (s = y('react.forward_ref')),
          (c = y('react.suspense')),
          (f = y('react.suspense_list')),
          (p = y('react.memo')),
          (d = y('react.lazy')),
          (h = y('react.block')),
          (m = y('react.server.block')),
          (g = y('react.fundamental')),
          (v = y('react.debug_trace_mode')),
          (x = y('react.legacy_hidden'))
      }
      function k(e) {
        if ('object' === typeof e && null !== e) {
          var n = e.$$typeof
          switch (n) {
            case t:
              switch ((e = e.type)) {
                case i:
                case l:
                case o:
                case c:
                case f:
                  return e
                default:
                  switch ((e = e && e.$$typeof)) {
                    case a:
                    case s:
                    case d:
                    case p:
                    case u:
                      return e
                    default:
                      return n
                  }
              }
            case r:
              return n
          }
        }
      }
      var b = u,
        w = t,
        S = s,
        E = i,
        C = d,
        F = p,
        P = r,
        T = l,
        A = o,
        O = c
      ;(n.ContextConsumer = a),
        (n.ContextProvider = b),
        (n.Element = w),
        (n.ForwardRef = S),
        (n.Fragment = E),
        (n.Lazy = C),
        (n.Memo = F),
        (n.Portal = P),
        (n.Profiler = T),
        (n.StrictMode = A),
        (n.Suspense = O),
        (n.isAsyncMode = function () {
          return !1
        }),
        (n.isConcurrentMode = function () {
          return !1
        }),
        (n.isContextConsumer = function (e) {
          return k(e) === a
        }),
        (n.isContextProvider = function (e) {
          return k(e) === u
        }),
        (n.isElement = function (e) {
          return 'object' === typeof e && null !== e && e.$$typeof === t
        }),
        (n.isForwardRef = function (e) {
          return k(e) === s
        }),
        (n.isFragment = function (e) {
          return k(e) === i
        }),
        (n.isLazy = function (e) {
          return k(e) === d
        }),
        (n.isMemo = function (e) {
          return k(e) === p
        }),
        (n.isPortal = function (e) {
          return k(e) === r
        }),
        (n.isProfiler = function (e) {
          return k(e) === l
        }),
        (n.isStrictMode = function (e) {
          return k(e) === o
        }),
        (n.isSuspense = function (e) {
          return k(e) === c
        }),
        (n.isValidElementType = function (e) {
          return (
            'string' === typeof e ||
            'function' === typeof e ||
            e === i ||
            e === l ||
            e === v ||
            e === o ||
            e === c ||
            e === f ||
            e === x ||
            ('object' === typeof e &&
              null !== e &&
              (e.$$typeof === d ||
                e.$$typeof === p ||
                e.$$typeof === u ||
                e.$$typeof === a ||
                e.$$typeof === s ||
                e.$$typeof === g ||
                e.$$typeof === h ||
                e[0] === m))
          )
        }),
        (n.typeOf = k)
    },
    48685: function (e, n, t) {
      'use strict'
      e.exports = t(2226)
    },
    81031: function (e, n, t) {
      'use strict'
      const r = t(29901),
        i = t(48685),
        o = t(81301),
        l = t(92113),
        u = t(89359),
        a = t(40997),
        s = t(48692),
        c = t(14725)
      n.D = d
      const f = {}.hasOwnProperty,
        p = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr'])
      function d(e, n) {
        const t = []
        let r,
          i = -1
        for (; ++i < n.children.length; )
          (r = n.children[i]),
            'element' === r.type
              ? t.push(h(e, r, i, n))
              : 'text' === r.type
              ? ('element' === n.type &&
                  p.has(n.tagName) &&
                  '\n' === r.value) ||
                t.push(r.value)
              : 'raw' !== r.type || e.options.skipHtml || t.push(r.value)
        return t
      }
      function h(e, n, t, l) {
        const u = e.options,
          a = e.schema,
          s = n.tagName,
          c = {}
        let p,
          h = a
        if (
          ('html' === a.space && 'svg' === s && ((h = o), (e.schema = h)),
          n.properties)
        )
          for (p in n.properties)
            f.call(n.properties, p) && g(c, p, n.properties[p], e)
        ;('ol' !== s && 'ul' !== s) || e.listDepth++
        const v = d(e, n)
        ;('ol' !== s && 'ul' !== s) || e.listDepth--, (e.schema = a)
        const x = n.position || {
            start: {line: null, column: null, offset: null},
            end: {line: null, column: null, offset: null},
          },
          y = u.components && f.call(u.components, s) ? u.components[s] : s,
          k = 'string' === typeof y || y === r.Fragment
        if (!i.isValidElementType(y))
          throw new TypeError(
            `Component for name \`${s}\` not defined or is not renderable`,
          )
        if (
          ((c.key = [s, x.start.line, x.start.column, t].join('-')),
          'a' === s &&
            u.linkTarget &&
            (c.target =
              'function' === typeof u.linkTarget
                ? u.linkTarget(c.href, n.children, c.title)
                : u.linkTarget),
          'a' === s &&
            u.transformLinkUri &&
            (c.href = u.transformLinkUri(c.href, n.children, c.title)),
          k ||
            'code' !== s ||
            'element' !== l.type ||
            'pre' === l.tagName ||
            (c.inline = !0),
          k ||
            ('h1' !== s &&
              'h2' !== s &&
              'h3' !== s &&
              'h4' !== s &&
              'h5' !== s &&
              'h6' !== s) ||
            (c.level = parseInt(s.charAt(1), 10)),
          'img' === s &&
            u.transformImageUri &&
            (c.src = u.transformImageUri(c.src, c.alt, c.title)),
          !k && 'li' === s && 'element' === l.type)
        ) {
          const e = (function (e) {
            let n = -1
            for (; ++n < e.children.length; ) {
              const t = e.children[n]
              if ('element' === t.type && 'input' === t.tagName) return t
            }
            return null
          })(n)
          ;(c.checked =
            e && e.properties ? Boolean(e.properties.checked) : null),
            (c.index = m(l, n)),
            (c.ordered = 'ol' === l.tagName)
        }
        var b
        return (
          k ||
            ('ol' !== s && 'ul' !== s) ||
            ((c.ordered = 'ol' === s), (c.depth = e.listDepth)),
          ('td' !== s && 'th' !== s) ||
            (c.align &&
              (c.style || (c.style = {}),
              (c.style.textAlign = c.align),
              delete c.align),
            k || (c.isHeader = 'th' === s)),
          k ||
            'tr' !== s ||
            'element' !== l.type ||
            (c.isHeader = Boolean('thead' === l.tagName)),
          u.sourcePos &&
            (c['data-sourcepos'] = [
              (b = x).start.line,
              ':',
              b.start.column,
              '-',
              b.end.line,
              ':',
              b.end.column,
            ]
              .map((e) => String(e))
              .join('')),
          !k && u.rawSourcePos && (c.sourcePosition = n.position),
          !k &&
            u.includeElementIndex &&
            ((c.index = m(l, n)), (c.siblingCount = m(l))),
          k || (c.node = n),
          v.length > 0 ? r.createElement(y, c, v) : r.createElement(y, c)
        )
      }
      function m(e, n) {
        let t = -1,
          r = 0
        for (; ++t < e.children.length && e.children[t] !== n; )
          'element' === e.children[t].type && r++
        return r
      }
      function g(e, n, t, r) {
        const i = l(r.schema, n)
        let o = t
        null !== o &&
          void 0 !== o &&
          o === o &&
          (o &&
            'object' === typeof o &&
            'length' in o &&
            (o = (i.commaSeparated ? s : a).stringify(o)),
          'style' === i.property &&
            'string' === typeof o &&
            (o = (function (e) {
              const n = {}
              try {
                c(e, t)
              } catch (r) {}
              return n
              function t(e, t) {
                const r = '-ms-' === e.slice(0, 4) ? `ms-${e.slice(4)}` : e
                n[r.replace(/-([a-z])/g, v)] = t
              }
            })(o)),
          i.space && i.property
            ? (e[f.call(u, i.property) ? u[i.property] : i.property] = o)
            : i.attribute && (e[i.attribute] = o))
      }
      function v(e, n) {
        return n.toUpperCase()
      }
    },
    99333: function (e, n, t) {
      'use strict'
      const r = t(29901),
        i = t(59228),
        o = t(42344),
        l = t(26975),
        u = t(85463),
        a = t(69480),
        s = t(85318),
        c = t(35486),
        f = t(11464),
        p = t(81031).D
      e.exports = m
      const d = {}.hasOwnProperty,
        h = {
          renderers: {to: 'components', id: 'change-renderers-to-components'},
          astPlugins: {id: 'remove-buggy-html-in-markdown-parser'},
          allowDangerousHtml: {id: 'remove-buggy-html-in-markdown-parser'},
          escapeHtml: {id: 'remove-buggy-html-in-markdown-parser'},
          source: {to: 'children', id: 'change-source-to-children'},
          allowNode: {
            to: 'allowElement',
            id: 'replace-allownode-allowedtypes-and-disallowedtypes',
          },
          allowedTypes: {
            to: 'allowedElements',
            id: 'replace-allownode-allowedtypes-and-disallowedtypes',
          },
          disallowedTypes: {
            to: 'disallowedElements',
            id: 'replace-allownode-allowedtypes-and-disallowedtypes',
          },
          includeNodeIndex: {
            to: 'includeElementIndex',
            id: 'change-includenodeindex-to-includeelementindex',
          },
        }
      function m(e) {
        for (const r in h)
          if (d.call(h, r) && d.call(e, r)) {
            const e = h[r]
            console.warn(
              `[react-markdown] Warning: please ${
                e.to ? `use \`${e.to}\` instead of` : 'remove'
              } \`${r}\` (see <https://github.com/remarkjs/react-markdown/blob/main/changelog.md#${
                e.id
              }> for more info)`,
            ),
              delete h[r]
          }
        const n = o()
          .use(l)
          .use(e.remarkPlugins || e.plugins || [])
          .use(u, {allowDangerousHtml: !0})
          .use(e.rehypePlugins || [])
          .use(c, e)
        let t
        'string' === typeof e.children
          ? (t = i(e.children))
          : (void 0 !== e.children &&
              null !== e.children &&
              console.warn(
                `[react-markdown] Warning: please pass a string as \`children\` (not: \`${e.children}\`)`,
              ),
            (t = i()))
        const a = n.runSync(n.parse(t), t)
        if ('root' !== a.type) throw new TypeError('Expected a `root` node')
        let f = r.createElement(
          r.Fragment,
          {},
          p({options: e, schema: s, listDepth: 0}, a),
        )
        return (
          e.className &&
            (f = r.createElement('div', {className: e.className}, f)),
          f
        )
      }
      ;(m.defaultProps = {transformLinkUri: f}),
        (m.propTypes = {
          children: a.string,
          className: a.string,
          allowElement: a.func,
          allowedElements: a.arrayOf(a.string),
          disallowedElements: a.arrayOf(a.string),
          unwrapDisallowed: a.bool,
          remarkPlugins: a.arrayOf(
            a.oneOfType([
              a.object,
              a.func,
              a.arrayOf(a.oneOfType([a.object, a.func])),
            ]),
          ),
          rehypePlugins: a.arrayOf(
            a.oneOfType([
              a.object,
              a.func,
              a.arrayOf(a.oneOfType([a.object, a.func])),
            ]),
          ),
          sourcePos: a.bool,
          rawSourcePos: a.bool,
          skipHtml: a.bool,
          includeElementIndex: a.bool,
          transformLinkUri: a.oneOfType([a.func, a.bool]),
          linkTarget: a.oneOfType([a.func, a.string]),
          transformImageUri: a.func,
          components: a.object,
        }),
        (m.uriTransformer = f)
    },
    35486: function (e, n, t) {
      const r = t(99273)
      e.exports = function (e) {
        if (e.allowedElements && e.disallowedElements)
          throw new TypeError(
            'Only one of `allowedElements` and `disallowedElements` should be defined',
          )
        if (e.allowedElements || e.disallowedElements || e.allowElement)
          return (e) => {
            r(e, 'element', n)
          }
        function n(n, t, r) {
          const i = n,
            o = r
          let l
          if (
            (e.allowedElements
              ? (l = !e.allowedElements.includes(i.tagName))
              : e.disallowedElements &&
                (l = e.disallowedElements.includes(i.tagName)),
            !l &&
              e.allowElement &&
              'number' === typeof t &&
              (l = !e.allowElement(i, t, o)),
            l && 'number' === typeof t)
          )
            return (
              e.unwrapDisallowed && i.children
                ? o.children.splice(t, 1, ...i.children)
                : o.children.splice(t, 1),
              t
            )
        }
      }
    },
    11464: function (e) {
      const n = ['http', 'https', 'mailto', 'tel']
      e.exports = function (e) {
        const t = (e || '').trim(),
          r = t.charAt(0)
        if ('#' === r || '/' === r) return t
        const i = t.indexOf(':')
        if (-1 === i) return t
        let o = -1
        for (; ++o < n.length; ) {
          const e = n[o]
          if (i === e.length && t.slice(0, e.length).toLowerCase() === e)
            return t
        }
        if (((o = t.indexOf('?')), -1 !== o && i > o)) return t
        if (((o = t.indexOf('#')), -1 !== o && i > o)) return t
        return 'javascript:void(0)'
      }
    },
    26975: function (e, n, t) {
      'use strict'
      e.exports = function (e) {
        var n = this
        this.Parser = function (t) {
          return r(
            t,
            Object.assign({}, n.data('settings'), e, {
              extensions: n.data('micromarkExtensions') || [],
              mdastExtensions: n.data('fromMarkdownExtensions') || [],
            }),
          )
        }
      }
      var r = t(67814)
    },
    85463: function (e, n, t) {
      'use strict'
      var r = t(7498)
      e.exports = function (e, n) {
        e && !e.process && ((n = e), (e = null))
        return e
          ? (function (e, n) {
              return t
              function t(t, i, o) {
                function l(e) {
                  o(e)
                }
                e.run(r(t, n), i, l)
              }
            })(e, n)
          : (function (e) {
              return n
              function n(n) {
                return r(n, e)
              }
            })(n)
      }
    },
    40997: function (e, n) {
      'use strict'
      ;(n.parse = function (e) {
        var n = String(e || '').trim()
        return '' === n ? [] : n.split(t)
      }),
        (n.stringify = function (e) {
          return e.join(' ').trim()
        })
      var t = /[ \t\n\r\f]+/g
    },
    14725: function (e, n, t) {
      var r = t(90158)
      e.exports = function (e, n) {
        var t,
          i = null
        if (!e || 'string' !== typeof e) return i
        for (
          var o, l, u = r(e), a = 'function' === typeof n, s = 0, c = u.length;
          s < c;
          s++
        )
          (o = (t = u[s]).property),
            (l = t.value),
            a ? n(o, l, t) : l && (i || (i = {}), (i[o] = l))
        return i
      }
    },
    57849: function (e, n, t) {
      'use strict'
      var r = t(34593)
      ;(e.exports = o), (o.wrap = r)
      var i = [].slice
      function o() {
        var e = [],
          n = {
            run: function () {
              var n = -1,
                t = i.call(arguments, 0, -1),
                o = arguments[arguments.length - 1]
              if ('function' !== typeof o)
                throw new Error('Expected function as last argument, not ' + o)
              function l(u) {
                var a = e[++n],
                  s = i.call(arguments, 0),
                  c = s.slice(1),
                  f = t.length,
                  p = -1
                if (u) o(u)
                else {
                  for (; ++p < f; )
                    (null !== c[p] && void 0 !== c[p]) || (c[p] = t[p])
                  ;(t = c),
                    a ? r(a, l).apply(null, t) : o.apply(null, [null].concat(t))
                }
              }
              l.apply(null, [null].concat(t))
            },
            use: function (t) {
              if ('function' !== typeof t)
                throw new Error('Expected `fn` to be a function, not ' + t)
              return e.push(t), n
            },
          }
        return n
      }
    },
    34593: function (e) {
      'use strict'
      var n = [].slice
      e.exports = function (e, t) {
        var r
        return function () {
          var t,
            l = n.call(arguments, 0),
            u = e.length > l.length
          u && l.push(i)
          try {
            t = e.apply(null, l)
          } catch (a) {
            if (u && r) throw a
            return i(a)
          }
          u ||
            (t && 'function' === typeof t.then
              ? t.then(o, i)
              : t instanceof Error
              ? i(t)
              : o(t))
        }
        function i() {
          r || ((r = !0), t.apply(null, arguments))
        }
        function o(e) {
          i(null, e)
        }
      }
    },
    42344: function (e, n, t) {
      'use strict'
      var r = t(69344),
        i = t(84853),
        o = t(93405),
        l = t(42125),
        u = t(57849),
        a = t(59228)
      e.exports = (function e() {
        var n,
          t = [],
          i = u(),
          x = {},
          y = -1
        return (
          (k.data = function (e, t) {
            if ('string' === typeof e)
              return 2 === arguments.length
                ? (m('data', n), (x[e] = t), k)
                : (c.call(x, e) && x[e]) || null
            if (e) return m('data', n), (x = e), k
            return x
          }),
          (k.freeze = b),
          (k.attachers = t),
          (k.use = function (e) {
            var r
            if ((m('use', n), null === e || void 0 === e));
            else if ('function' === typeof e) c.apply(null, arguments)
            else {
              if ('object' !== typeof e)
                throw new Error('Expected usable value, not `' + e + '`')
              'length' in e ? a(e) : i(e)
            }
            r && (x.settings = o(x.settings || {}, r))
            return k
            function i(e) {
              a(e.plugins), e.settings && (r = o(r || {}, e.settings))
            }
            function u(e) {
              if ('function' === typeof e) c(e)
              else {
                if ('object' !== typeof e)
                  throw new Error('Expected usable value, not `' + e + '`')
                'length' in e ? c.apply(null, e) : i(e)
              }
            }
            function a(e) {
              var n = -1
              if (null === e || void 0 === e);
              else {
                if ('object' !== typeof e || !('length' in e))
                  throw new Error('Expected a list of plugins, not `' + e + '`')
                for (; ++n < e.length; ) u(e[n])
              }
            }
            function c(e, n) {
              var r = w(e)
              r
                ? (l(r[1]) && l(n) && (n = o(!0, r[1], n)), (r[1] = n))
                : t.push(s.call(arguments))
            }
          }),
          (k.parse = function (e) {
            var n,
              t = a(e)
            if ((b(), d('parse', (n = k.Parser)), p(n, 'parse')))
              return new n(String(t), t).parse()
            return n(String(t), t)
          }),
          (k.stringify = function (e, n) {
            var t,
              r = a(n)
            if ((b(), h('stringify', (t = k.Compiler)), g(e), p(t, 'compile')))
              return new t(e, r).compile()
            return t(e, r)
          }),
          (k.run = S),
          (k.runSync = function (e, n) {
            var t, i
            return S(e, n, o), v('runSync', 'run', i), t
            function o(e, n) {
              ;(i = !0), (t = n), r(e)
            }
          }),
          (k.process = E),
          (k.processSync = function (e) {
            var n, t
            return (
              b(),
              d('processSync', k.Parser),
              h('processSync', k.Compiler),
              E((n = a(e)), i),
              v('processSync', 'process', t),
              n
            )
            function i(e) {
              ;(t = !0), r(e)
            }
          }),
          k
        )
        function k() {
          for (var n = e(), r = -1; ++r < t.length; ) n.use.apply(null, t[r])
          return n.data(o(!0, {}, x)), n
        }
        function b() {
          var e, r
          if (n) return k
          for (; ++y < t.length; )
            !1 !== (e = t[y])[1] &&
              (!0 === e[1] && (e[1] = void 0),
              'function' === typeof (r = e[0].apply(k, e.slice(1))) && i.use(r))
          return (n = !0), (y = 1 / 0), k
        }
        function w(e) {
          for (var n = -1; ++n < t.length; ) if (t[n][0] === e) return t[n]
        }
        function S(e, n, t) {
          if (
            (g(e),
            b(),
            t || 'function' !== typeof n || ((t = n), (n = null)),
            !t)
          )
            return new Promise(r)
          function r(r, o) {
            i.run(e, a(n), function (n, i, l) {
              ;(i = i || e), n ? o(n) : r ? r(i) : t(null, i, l)
            })
          }
          r(null, t)
        }
        function E(e, n) {
          if ((b(), d('process', k.Parser), h('process', k.Compiler), !n))
            return new Promise(t)
          function t(t, r) {
            var i = a(e)
            f.run(k, {file: i}, function (e) {
              e ? r(e) : t ? t(i) : n(null, i)
            })
          }
          t(null, n)
        }
      })().freeze()
      var s = [].slice,
        c = {}.hasOwnProperty,
        f = u()
          .use(function (e, n) {
            n.tree = e.parse(n.file)
          })
          .use(function (e, n, t) {
            e.run(n.tree, n.file, function (e, r, i) {
              e ? t(e) : ((n.tree = r), (n.file = i), t())
            })
          })
          .use(function (e, n) {
            var t = e.stringify(n.tree, n.file)
            void 0 === t ||
              null === t ||
              ('string' === typeof t || i(t)
                ? ('value' in n.file && (n.file.value = t),
                  (n.file.contents = t))
                : (n.file.result = t))
          })
      function p(e, n) {
        return (
          'function' === typeof e &&
          e.prototype &&
          ((function (e) {
            var n
            for (n in e) return !0
            return !1
          })(e.prototype) ||
            n in e.prototype)
        )
      }
      function d(e, n) {
        if ('function' !== typeof n)
          throw new Error('Cannot `' + e + '` without `Parser`')
      }
      function h(e, n) {
        if ('function' !== typeof n)
          throw new Error('Cannot `' + e + '` without `Compiler`')
      }
      function m(e, n) {
        if (n)
          throw new Error(
            'Cannot invoke `' +
              e +
              '` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`.',
          )
      }
      function g(e) {
        if (!e || 'string' !== typeof e.type)
          throw new Error('Expected node, got `' + e + '`')
      }
      function v(e, n, t) {
        if (!t)
          throw new Error('`' + e + '` finished async. Use `' + n + '` instead')
      }
    },
    64992: function (e) {
      'use strict'
      e.exports = function (e, n, t) {
        var r
        ;(null !== t && void 0 !== t) ||
          ('object' === typeof n && !Array.isArray(n)) ||
          ((t = n), (n = {}))
        ;(r = Object.assign({type: String(e)}, n)),
          Array.isArray(t)
            ? (r.children = t)
            : null !== t && void 0 !== t && (r.value = String(t))
        return r
      }
    },
    96259: function (e) {
      'use strict'
      e.exports = function (e) {
        return (
          !e ||
          !e.position ||
          !e.position.start ||
          !e.position.start.line ||
          !e.position.start.column ||
          !e.position.end ||
          !e.position.end.line ||
          !e.position.end.column
        )
      }
    },
    57328: function (e) {
      'use strict'
      function n(e) {
        if (null == e) return t
        if ('string' === typeof e)
          return (function (e) {
            return n
            function n(n) {
              return Boolean(n && n.type === e)
            }
          })(e)
        if ('object' === typeof e)
          return 'length' in e
            ? (function (e) {
                var t = [],
                  r = -1
                for (; ++r < e.length; ) t[r] = n(e[r])
                return i
                function i() {
                  for (var e = -1; ++e < t.length; )
                    if (t[e].apply(this, arguments)) return !0
                  return !1
                }
              })(e)
            : (function (e) {
                return n
                function n(n) {
                  var t
                  for (t in e) if (n[t] !== e[t]) return !1
                  return !0
                }
              })(e)
        if ('function' === typeof e) return e
        throw new Error('Expected function, string, or object as test')
      }
      function t() {
        return !0
      }
      e.exports = n
    },
    89225: function (e) {
      'use strict'
      var n = i('start'),
        t = i('end')
      function r(e) {
        return {start: n(e), end: t(e)}
      }
      function i(e) {
        return (n.displayName = e), n
        function n(n) {
          var t = (n && n.position && n.position[e]) || {}
          return {
            line: t.line || null,
            column: t.column || null,
            offset: isNaN(t.offset) ? null : t.offset,
          }
        }
      }
      ;(e.exports = r), (r.start = n), (r.end = t)
    },
    1839: function (e) {
      'use strict'
      var n = {}.hasOwnProperty
      function t(e) {
        return (
          (e && 'object' === typeof e) || (e = {}),
          i(e.line) + ':' + i(e.column)
        )
      }
      function r(e) {
        return (
          (e && 'object' === typeof e) || (e = {}), t(e.start) + '-' + t(e.end)
        )
      }
      function i(e) {
        return e && 'number' === typeof e ? e : 1
      }
      e.exports = function (e) {
        if (!e || 'object' !== typeof e) return ''
        if (n.call(e, 'position') || n.call(e, 'type')) return r(e.position)
        if (n.call(e, 'start') || n.call(e, 'end')) return r(e)
        if (n.call(e, 'line') || n.call(e, 'column')) return t(e)
        return ''
      }
    },
    55372: function (e) {
      e.exports = function (e) {
        return e
      }
    },
    40371: function (e, n, t) {
      'use strict'
      e.exports = a
      var r = t(57328),
        i = t(55372),
        o = !0,
        l = 'skip',
        u = !1
      function a(e, n, t, a) {
        var s, c
        'function' === typeof n &&
          'function' !== typeof t &&
          ((a = t), (t = n), (n = null)),
          (c = r(n)),
          (s = a ? -1 : 1),
          (function e(r, f, p) {
            var d,
              h = 'object' === typeof r && null !== r ? r : {}
            'string' === typeof h.type &&
              ((d =
                'string' === typeof h.tagName
                  ? h.tagName
                  : 'string' === typeof h.name
                  ? h.name
                  : void 0),
              (m.displayName =
                'node (' + i(h.type + (d ? '<' + d + '>' : '')) + ')'))
            return m
            function m() {
              var i,
                d,
                h = p.concat(r),
                m = []
              if (
                (!n || c(r, f, p[p.length - 1] || null)) &&
                (m = (function (e) {
                  if (null !== e && 'object' === typeof e && 'length' in e)
                    return e
                  if ('number' === typeof e) return [o, e]
                  return [e]
                })(t(r, p)))[0] === u
              )
                return m
              if (r.children && m[0] !== l)
                for (
                  d = (a ? r.children.length : -1) + s;
                  d > -1 && d < r.children.length;

                ) {
                  if ((i = e(r.children[d], d, h)())[0] === u) return i
                  d = 'number' === typeof i[1] ? i[1] : d + s
                }
              return m
            }
          })(e, null, [])()
      }
      ;(a.CONTINUE = true), (a.SKIP = l), (a.EXIT = u)
    },
    99273: function (e, n, t) {
      'use strict'
      e.exports = u
      var r = t(40371),
        i = r.CONTINUE,
        o = r.SKIP,
        l = r.EXIT
      function u(e, n, t, i) {
        'function' === typeof n &&
          'function' !== typeof t &&
          ((i = t), (t = n), (n = null)),
          r(
            e,
            n,
            function (e, n) {
              var r = n[n.length - 1],
                i = r ? r.children.indexOf(e) : null
              return t(e, i, r)
            },
            i,
          )
      }
      ;(u.CONTINUE = i), (u.SKIP = o), (u.EXIT = l)
    },
    67540: function (e, n, t) {
      'use strict'
      var r = t(1839)
      function i() {}
      ;(e.exports = l), (i.prototype = Error.prototype), (l.prototype = new i())
      var o = l.prototype
      function l(e, n, t) {
        var i, o, l
        'string' === typeof n && ((t = n), (n = null)),
          (i = (function (e) {
            var n,
              t = [null, null]
            'string' === typeof e &&
              (-1 === (n = e.indexOf(':'))
                ? (t[1] = e)
                : ((t[0] = e.slice(0, n)), (t[1] = e.slice(n + 1))))
            return t
          })(t)),
          (o = r(n) || '1:1'),
          (l = {
            start: {line: null, column: null},
            end: {line: null, column: null},
          }),
          n && n.position && (n = n.position),
          n && (n.start ? ((l = n), (n = n.start)) : (l.start = n)),
          e.stack && ((this.stack = e.stack), (e = e.message)),
          (this.message = e),
          (this.name = o),
          (this.reason = e),
          (this.line = n ? n.line : null),
          (this.column = n ? n.column : null),
          (this.location = l),
          (this.source = i[0]),
          (this.ruleId = i[1])
      }
      ;(o.file = ''),
        (o.name = ''),
        (o.reason = ''),
        (o.message = ''),
        (o.stack = ''),
        (o.fatal = null),
        (o.column = null),
        (o.line = null)
    },
    59228: function (e, n, t) {
      'use strict'
      e.exports = t(36581)
    },
    68153: function (e, n, t) {
      'use strict'
      var r = t(42873),
        i = t(84681),
        o = t(84853)
      e.exports = a
      var l = {}.hasOwnProperty,
        u = ['history', 'path', 'basename', 'stem', 'extname', 'dirname']
      function a(e) {
        var n, t
        if (e) {
          if ('string' === typeof e || o(e)) e = {contents: e}
          else if ('message' in e && 'messages' in e) return e
        } else e = {}
        if (!(this instanceof a)) return new a(e)
        for (
          this.data = {},
            this.messages = [],
            this.history = [],
            this.cwd = i.cwd(),
            t = -1;
          ++t < u.length;

        )
          (n = u[t]), l.call(e, n) && (this[n] = e[n])
        for (n in e) u.indexOf(n) < 0 && (this[n] = e[n])
      }
      function s(e, n) {
        if (e && e.indexOf(r.sep) > -1)
          throw new Error(
            '`' + n + '` cannot be a path: did not expect `' + r.sep + '`',
          )
      }
      function c(e, n) {
        if (!e) throw new Error('`' + n + '` cannot be empty')
      }
      function f(e, n) {
        if (!e)
          throw new Error('Setting `' + n + '` requires `path` to be set too')
      }
      ;(a.prototype.toString = function (e) {
        return (this.contents || '').toString(e)
      }),
        Object.defineProperty(a.prototype, 'path', {
          get: function () {
            return this.history[this.history.length - 1]
          },
          set: function (e) {
            c(e, 'path'), this.path !== e && this.history.push(e)
          },
        }),
        Object.defineProperty(a.prototype, 'dirname', {
          get: function () {
            return 'string' === typeof this.path ? r.dirname(this.path) : void 0
          },
          set: function (e) {
            f(this.path, 'dirname'),
              (this.path = r.join(e || '', this.basename))
          },
        }),
        Object.defineProperty(a.prototype, 'basename', {
          get: function () {
            return 'string' === typeof this.path
              ? r.basename(this.path)
              : void 0
          },
          set: function (e) {
            c(e, 'basename'),
              s(e, 'basename'),
              (this.path = r.join(this.dirname || '', e))
          },
        }),
        Object.defineProperty(a.prototype, 'extname', {
          get: function () {
            return 'string' === typeof this.path ? r.extname(this.path) : void 0
          },
          set: function (e) {
            if ((s(e, 'extname'), f(this.path, 'extname'), e)) {
              if (46 !== e.charCodeAt(0))
                throw new Error('`extname` must start with `.`')
              if (e.indexOf('.', 1) > -1)
                throw new Error('`extname` cannot contain multiple dots')
            }
            this.path = r.join(this.dirname, this.stem + (e || ''))
          },
        }),
        Object.defineProperty(a.prototype, 'stem', {
          get: function () {
            return 'string' === typeof this.path
              ? r.basename(this.path, this.extname)
              : void 0
          },
          set: function (e) {
            c(e, 'stem'),
              s(e, 'stem'),
              (this.path = r.join(this.dirname || '', e + (this.extname || '')))
          },
        })
    },
    36581: function (e, n, t) {
      'use strict'
      var r = t(67540),
        i = t(68153)
      ;(e.exports = i),
        (i.prototype.message = function (e, n, t) {
          var i = new r(e, n, t)
          this.path &&
            ((i.name = this.path + ':' + i.name), (i.file = this.path))
          return (i.fatal = !1), this.messages.push(i), i
        }),
        (i.prototype.info = function () {
          var e = this.message.apply(this, arguments)
          return (e.fatal = null), e
        }),
        (i.prototype.fail = function () {
          var e = this.message.apply(this, arguments)
          throw ((e.fatal = !0), e)
        })
    },
    42873: function (e, n) {
      'use strict'
      function t(e) {
        var n, t
        return (
          r(e),
          (n = 47 === e.charCodeAt(0)),
          (t = (function (e, n) {
            var t,
              r,
              i = '',
              o = 0,
              l = -1,
              u = 0,
              a = -1
            for (; ++a <= e.length; ) {
              if (a < e.length) t = e.charCodeAt(a)
              else {
                if (47 === t) break
                t = 47
              }
              if (47 === t) {
                if (l === a - 1 || 1 === u);
                else if (l !== a - 1 && 2 === u) {
                  if (
                    i.length < 2 ||
                    2 !== o ||
                    46 !== i.charCodeAt(i.length - 1) ||
                    46 !== i.charCodeAt(i.length - 2)
                  )
                    if (i.length > 2) {
                      if ((r = i.lastIndexOf('/')) !== i.length - 1) {
                        r < 0
                          ? ((i = ''), (o = 0))
                          : (o =
                              (i = i.slice(0, r)).length -
                              1 -
                              i.lastIndexOf('/')),
                          (l = a),
                          (u = 0)
                        continue
                      }
                    } else if (i.length) {
                      ;(i = ''), (o = 0), (l = a), (u = 0)
                      continue
                    }
                  n && ((i = i.length ? i + '/..' : '..'), (o = 2))
                } else
                  i.length
                    ? (i += '/' + e.slice(l + 1, a))
                    : (i = e.slice(l + 1, a)),
                    (o = a - l - 1)
                ;(l = a), (u = 0)
              } else 46 === t && u > -1 ? u++ : (u = -1)
            }
            return i
          })(e, !n)).length ||
            n ||
            (t = '.'),
          t.length && 47 === e.charCodeAt(e.length - 1) && (t += '/'),
          n ? '/' + t : t
        )
      }
      function r(e) {
        if ('string' !== typeof e)
          throw new TypeError(
            'Path must be a string. Received ' + JSON.stringify(e),
          )
      }
      ;(n.basename = function (e, n) {
        var t,
          i,
          o,
          l,
          u = 0,
          a = -1
        if (void 0 !== n && 'string' !== typeof n)
          throw new TypeError('"ext" argument must be a string')
        if (
          (r(e),
          (t = e.length),
          void 0 === n || !n.length || n.length > e.length)
        ) {
          for (; t--; )
            if (47 === e.charCodeAt(t)) {
              if (o) {
                u = t + 1
                break
              }
            } else a < 0 && ((o = !0), (a = t + 1))
          return a < 0 ? '' : e.slice(u, a)
        }
        if (n === e) return ''
        ;(i = -1), (l = n.length - 1)
        for (; t--; )
          if (47 === e.charCodeAt(t)) {
            if (o) {
              u = t + 1
              break
            }
          } else
            i < 0 && ((o = !0), (i = t + 1)),
              l > -1 &&
                (e.charCodeAt(t) === n.charCodeAt(l--)
                  ? l < 0 && (a = t)
                  : ((l = -1), (a = i)))
        u === a ? (a = i) : a < 0 && (a = e.length)
        return e.slice(u, a)
      }),
        (n.dirname = function (e) {
          var n, t, i
          if ((r(e), !e.length)) return '.'
          ;(n = -1), (i = e.length)
          for (; --i; )
            if (47 === e.charCodeAt(i)) {
              if (t) {
                n = i
                break
              }
            } else t || (t = !0)
          return n < 0
            ? 47 === e.charCodeAt(0)
              ? '/'
              : '.'
            : 1 === n && 47 === e.charCodeAt(0)
            ? '//'
            : e.slice(0, n)
        }),
        (n.extname = function (e) {
          var n,
            t,
            i,
            o = -1,
            l = 0,
            u = -1,
            a = 0
          r(e), (i = e.length)
          for (; i--; )
            if (47 !== (t = e.charCodeAt(i)))
              u < 0 && ((n = !0), (u = i + 1)),
                46 === t
                  ? o < 0
                    ? (o = i)
                    : 1 !== a && (a = 1)
                  : o > -1 && (a = -1)
            else if (n) {
              l = i + 1
              break
            }
          if (
            o < 0 ||
            u < 0 ||
            0 === a ||
            (1 === a && o === u - 1 && o === l + 1)
          )
            return ''
          return e.slice(o, u)
        }),
        (n.join = function () {
          var e,
            n = -1
          for (; ++n < arguments.length; )
            r(arguments[n]),
              arguments[n] &&
                (e = void 0 === e ? arguments[n] : e + '/' + arguments[n])
          return void 0 === e ? '.' : t(e)
        }),
        (n.sep = '/')
    },
    84681: function (e, n) {
      'use strict'
      n.cwd = function () {
        return '/'
      }
    },
    31693: function (e) {
      e.exports = function () {
        for (var e = {}, t = 0; t < arguments.length; t++) {
          var r = arguments[t]
          for (var i in r) n.call(r, i) && (e[i] = r[i])
        }
        return e
      }
      var n = Object.prototype.hasOwnProperty
    },
    89359: function (e) {
      'use strict'
      e.exports = JSON.parse(
        '{"classId":"classID","dataType":"datatype","itemId":"itemID","strokeDashArray":"strokeDasharray","strokeDashOffset":"strokeDashoffset","strokeLineCap":"strokeLinecap","strokeLineJoin":"strokeLinejoin","strokeMiterLimit":"strokeMiterlimit","typeOf":"typeof","xLinkActuate":"xlinkActuate","xLinkArcRole":"xlinkArcrole","xLinkHref":"xlinkHref","xLinkRole":"xlinkRole","xLinkShow":"xlinkShow","xLinkTitle":"xlinkTitle","xLinkType":"xlinkType","xmlnsXLink":"xmlnsXlink"}',
      )
    },
  },
])
