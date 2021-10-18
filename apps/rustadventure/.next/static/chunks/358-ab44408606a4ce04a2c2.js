;(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [358],
  {
    95435: function (t, n, e) {
      'use strict'
      e.d(n, {
        Z: function () {
          return o
        },
      })
      var r =
          /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|inert|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,
        o = (function (t) {
          var n = {}
          return function (e) {
            return void 0 === n[e] && (n[e] = t(e)), n[e]
          }
        })(function (t) {
          return (
            r.test(t) ||
            (111 === t.charCodeAt(0) &&
              110 === t.charCodeAt(1) &&
              t.charCodeAt(2) < 91)
          )
        })
    },
    66226: function (t, n, e) {
      'use strict'
      e.d(n, {
        E: function () {
          return Oi
        },
      })
      var r = e(64873),
        o = e(29901),
        i = function (t) {
          return {
            isEnabled: function (n) {
              return t.some(function (t) {
                return !!n[t]
              })
            },
          }
        },
        a = {
          measureLayout: i([
            'layout',
            'layoutId',
            'drag',
            '_layoutResetTransform',
          ]),
          animation: i([
            'animate',
            'exit',
            'variants',
            'whileHover',
            'whileTap',
            'whileFocus',
            'whileDrag',
          ]),
          exit: i(['exit']),
          drag: i(['drag', 'dragControls']),
          focus: i(['whileFocus']),
          hover: i(['whileHover', 'onHoverStart', 'onHoverEnd']),
          tap: i(['whileTap', 'onTap', 'onTapStart', 'onTapCancel']),
          pan: i(['onPan', 'onPanStart', 'onPanSessionStart', 'onPanEnd']),
          layoutAnimation: i(['layout', 'layoutId']),
        }
      var u = (0, o.createContext)({strict: !1}),
        s = Object.keys(a),
        c = s.length
      var l = (0, o.createContext)({
          transformPagePoint: function (t) {
            return t
          },
          isStatic: !1,
        }),
        f = (0, o.createContext)({})
      var d = (0, o.createContext)(null)
      function v(t) {
        var n = (0, o.useRef)(null)
        return null === n.current && (n.current = t()), n.current
      }
      function p() {
        var t = (0, o.useContext)(d)
        if (null === t) return [!0, null]
        var n = t.isPresent,
          e = t.onExitComplete,
          r = t.register,
          i = g()
        ;(0, o.useEffect)(function () {
          return r(i)
        }, [])
        return !n && e
          ? [
              !1,
              function () {
                return null === e || void 0 === e ? void 0 : e(i)
              },
            ]
          : [!0]
      }
      function m(t) {
        return null === t || t.isPresent
      }
      var h = 0,
        y = function () {
          return h++
        },
        g = function () {
          return v(y)
        },
        x = (0, o.createContext)(null),
        b = 'undefined' !== typeof window,
        P = b ? o.useLayoutEffect : o.useEffect
      function A(t, n, e, i) {
        var a = (0, o.useContext)(l),
          s = (0, o.useContext)(u),
          c = (0, o.useContext)(f).visualElement,
          v = (0, o.useContext)(d),
          p = (function (t) {
            var n = t.layoutId,
              e = (0, o.useContext)(x)
            return e && void 0 !== n ? e + '-' + n : n
          })(e),
          h = (0, o.useRef)(void 0)
        i || (i = s.renderer),
          !h.current &&
            i &&
            (h.current = i(t, {
              visualState: n,
              parent: c,
              props: (0, r.pi)((0, r.pi)({}, e), {layoutId: p}),
              presenceId: null === v || void 0 === v ? void 0 : v.id,
              blockInitialAnimation:
                !1 === (null === v || void 0 === v ? void 0 : v.initial),
            }))
        var y = h.current
        return (
          P(function () {
            y &&
              (y.setProps(
                (0, r.pi)((0, r.pi)((0, r.pi)({}, a), e), {layoutId: p}),
              ),
              (y.isPresent = m(v)),
              (y.isPresenceRoot =
                !c ||
                c.presenceId !== (null === v || void 0 === v ? void 0 : v.id)),
              y.syncRender())
          }),
          (0, o.useEffect)(function () {
            var t
            y &&
              (null === (t = y.animationState) ||
                void 0 === t ||
                t.animateChanges())
          }),
          P(function () {
            return function () {
              return null === y || void 0 === y ? void 0 : y.notifyUnmount()
            }
          }, []),
          y
        )
      }
      function T(t) {
        return (
          'object' === typeof t &&
          Object.prototype.hasOwnProperty.call(t, 'current')
        )
      }
      function E(t) {
        return Array.isArray(t)
      }
      function w(t) {
        return 'string' === typeof t || E(t)
      }
      function C(t, n, e, r, o) {
        var i
        return (
          void 0 === r && (r = {}),
          void 0 === o && (o = {}),
          'string' === typeof n &&
            (n = null === (i = t.variants) || void 0 === i ? void 0 : i[n]),
          'function' === typeof n
            ? n(null !== e && void 0 !== e ? e : t.custom, r, o)
            : n
        )
      }
      function S(t, n, e) {
        var r = t.getProps()
        return C(
          r,
          n,
          null !== e && void 0 !== e ? e : r.custom,
          (function (t) {
            var n = {}
            return (
              t.forEachValue(function (t, e) {
                return (n[e] = t.get())
              }),
              n
            )
          })(t),
          (function (t) {
            var n = {}
            return (
              t.forEachValue(function (t, e) {
                return (n[e] = t.getVelocity())
              }),
              n
            )
          })(t),
        )
      }
      function L(t) {
        var n
        return (
          'function' ===
            typeof (null === (n = t.animate) || void 0 === n
              ? void 0
              : n.start) ||
          w(t.initial) ||
          w(t.animate) ||
          w(t.whileHover) ||
          w(t.whileDrag) ||
          w(t.whileTap) ||
          w(t.whileFocus) ||
          w(t.exit)
        )
      }
      function R(t) {
        return Boolean(L(t) || t.variants)
      }
      function M(t, n) {
        var e = (function (t, n) {
            if (L(t)) {
              var e = t.initial,
                r = t.animate
              return {
                initial: !1 === e || w(e) ? e : void 0,
                animate: w(r) ? r : void 0,
              }
            }
            return !1 !== t.inherit ? n : {}
          })(t, (0, o.useContext)(f)),
          r = e.initial,
          i = e.animate
        return (0, o.useMemo)(
          function () {
            return {initial: r, animate: i}
          },
          n ? [k(r), k(i)] : [],
        )
      }
      function k(t) {
        return Array.isArray(t) ? t.join(' ') : t
      }
      function V(t) {
        var n = t.preloadedFeatures,
          e = t.createVisualElement,
          i = t.useRender,
          d = t.useVisualState,
          v = t.Component
        return (
          n &&
            (function (t) {
              for (var n in t) {
                var e = t[n]
                null !== e && (a[n].Component = e)
              }
            })(n),
          (0, o.forwardRef)(function (t, n) {
            var p = (0, o.useContext)(l).isStatic,
              m = null,
              h = M(t, p),
              y = d(t, p)
            return (
              !p &&
                b &&
                ((h.visualElement = A(v, y, t, e)),
                (m = (function (t, n, e) {
                  var i = []
                  if (((0, o.useContext)(u), !n)) return null
                  for (var l = 0; l < c; l++) {
                    var f = s[l],
                      d = a[f],
                      v = d.isEnabled,
                      p = d.Component
                    v(t) &&
                      p &&
                      i.push(
                        o.createElement(
                          p,
                          (0, r.pi)({key: f}, t, {visualElement: n}),
                        ),
                      )
                  }
                  return i
                })(t, h.visualElement))),
              o.createElement(
                o.Fragment,
                null,
                o.createElement(
                  f.Provider,
                  {value: h},
                  i(
                    v,
                    t,
                    (function (t, n, e) {
                      return (0, o.useCallback)(
                        function (r) {
                          var o
                          r &&
                            (null === (o = t.mount) ||
                              void 0 === o ||
                              o.call(t, r)),
                            n && (r ? n.mount(r) : n.unmount()),
                            e &&
                              ('function' === typeof e
                                ? e(r)
                                : T(e) && (e.current = r))
                        },
                        [n],
                      )
                    })(y, h.visualElement, n),
                    y,
                    p,
                  ),
                ),
                m,
              )
            )
          })
        )
      }
      function D(t) {
        function n(n, e) {
          return void 0 === e && (e = {}), V(t(n, e))
        }
        var e = new Map()
        return new Proxy(n, {
          get: function (t, r) {
            return e.has(r) || e.set(r, n(r)), e.get(r)
          },
        })
      }
      var j = [
        'animate',
        'circle',
        'defs',
        'desc',
        'ellipse',
        'g',
        'image',
        'line',
        'filter',
        'marker',
        'mask',
        'metadata',
        'path',
        'pattern',
        'polygon',
        'polyline',
        'rect',
        'stop',
        'svg',
        'switch',
        'symbol',
        'text',
        'tspan',
        'use',
        'view',
      ]
      function B(t) {
        return (
          'string' === typeof t &&
          !t.includes('-') &&
          !!(j.indexOf(t) > -1 || /[A-Z]/.test(t))
        )
      }
      var O = {}
      var F = ['', 'X', 'Y', 'Z'],
        U = ['transformPerspective', 'x', 'y', 'z']
      function I(t, n) {
        return U.indexOf(t) - U.indexOf(n)
      }
      ;['translate', 'scale', 'rotate', 'skew'].forEach(function (t) {
        return F.forEach(function (n) {
          return U.push(t + n)
        })
      })
      var H = new Set(U)
      function _(t) {
        return H.has(t)
      }
      var Y = new Set(['originX', 'originY', 'originZ'])
      function N(t) {
        return Y.has(t)
      }
      function z(t, n) {
        var e = n.layout,
          r = n.layoutId
        return (
          _(t) || N(t) || ((e || void 0 !== r) && (!!O[t] || 'opacity' === t))
        )
      }
      var X = e(33266),
        W = {
          x: 'translateX',
          y: 'translateY',
          z: 'translateZ',
          transformPerspective: 'perspective',
        }
      function Z(t) {
        return t.startsWith('--')
      }
      var q = function (t, n) {
          return n && 'number' === typeof t ? n.transform(t) : t
        },
        K = function (t, n) {
          return function (e) {
            return Math.max(Math.min(e, n), t)
          }
        },
        $ = function (t) {
          return t % 1 ? Number(t.toFixed(5)) : t
        },
        G = /(-)?([\d]*\.?[\d])+/g,
        J =
          /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2,3}\s*\/*\s*[\d\.]+%?\))/gi,
        Q =
          /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2,3}\s*\/*\s*[\d\.]+%?\))$/i
      function tt(t) {
        return 'string' === typeof t
      }
      var nt = function (t) {
          return {
            test: function (n) {
              return tt(n) && n.endsWith(t) && 1 === n.split(' ').length
            },
            parse: parseFloat,
            transform: function (n) {
              return '' + n + t
            },
          }
        },
        et = nt('deg'),
        rt = nt('%'),
        ot = nt('px'),
        it = nt('vh'),
        at = nt('vw'),
        ut = (0, r.pi)((0, r.pi)({}, rt), {
          parse: function (t) {
            return rt.parse(t) / 100
          },
          transform: function (t) {
            return rt.transform(100 * t)
          },
        }),
        st = {
          test: function (t) {
            return 'number' === typeof t
          },
          parse: parseFloat,
          transform: function (t) {
            return t
          },
        },
        ct = (0, r.pi)((0, r.pi)({}, st), {transform: K(0, 1)}),
        lt = (0, r.pi)((0, r.pi)({}, st), {default: 1}),
        ft = (0, r.pi)((0, r.pi)({}, st), {transform: Math.round}),
        dt = {
          borderWidth: ot,
          borderTopWidth: ot,
          borderRightWidth: ot,
          borderBottomWidth: ot,
          borderLeftWidth: ot,
          borderRadius: ot,
          radius: ot,
          borderTopLeftRadius: ot,
          borderTopRightRadius: ot,
          borderBottomRightRadius: ot,
          borderBottomLeftRadius: ot,
          width: ot,
          maxWidth: ot,
          height: ot,
          maxHeight: ot,
          size: ot,
          top: ot,
          right: ot,
          bottom: ot,
          left: ot,
          padding: ot,
          paddingTop: ot,
          paddingRight: ot,
          paddingBottom: ot,
          paddingLeft: ot,
          margin: ot,
          marginTop: ot,
          marginRight: ot,
          marginBottom: ot,
          marginLeft: ot,
          rotate: et,
          rotateX: et,
          rotateY: et,
          rotateZ: et,
          scale: lt,
          scaleX: lt,
          scaleY: lt,
          scaleZ: lt,
          skew: et,
          skewX: et,
          skewY: et,
          distance: ot,
          translateX: ot,
          translateY: ot,
          translateZ: ot,
          x: ot,
          y: ot,
          z: ot,
          perspective: ot,
          transformPerspective: ot,
          opacity: ct,
          originX: ut,
          originY: ut,
          originZ: ot,
          zIndex: ft,
          fillOpacity: ct,
          strokeOpacity: ct,
          numOctaves: ft,
        }
      function vt(t, n, e, r, o, i, a, u) {
        var s,
          c = t.style,
          l = t.vars,
          f = t.transform,
          d = t.transformKeys,
          v = t.transformOrigin
        d.length = 0
        var p = !1,
          m = !1,
          h = !0
        for (var y in n) {
          var g = n[y]
          if (Z(y)) l[y] = g
          else {
            var x = dt[y],
              b = q(g, x)
            if (_(y)) {
              if (((p = !0), (f[y] = b), d.push(y), !h)) continue
              g !== (null !== (s = x.default) && void 0 !== s ? s : 0) &&
                (h = !1)
            } else if (N(y)) (v[y] = b), (m = !0)
            else if (
              (null === e || void 0 === e ? void 0 : e.isHydrated) &&
              (null === r || void 0 === r ? void 0 : r.isHydrated) &&
              O[y]
            ) {
              var P = O[y].process(g, r, e),
                A = O[y].applyTo
              if (A) for (var T = A.length, E = 0; E < T; E++) c[A[E]] = P
              else c[y] = P
            } else c[y] = b
          }
        }
        r && e && a && u
          ? ((c.transform = a(r.deltaFinal, r.treeScale, p ? f : void 0)),
            i && (c.transform = i(f, c.transform)),
            (c.transformOrigin = u(r)))
          : (p &&
              (c.transform = (function (t, n, e, r) {
                var o = t.transform,
                  i = t.transformKeys,
                  a = n.enableHardwareAcceleration,
                  u = void 0 === a || a,
                  s = n.allowTransformNone,
                  c = void 0 === s || s,
                  l = ''
                i.sort(I)
                for (var f = !1, d = i.length, v = 0; v < d; v++) {
                  var p = i[v]
                  ;(l += (W[p] || p) + '(' + o[p] + ') '), 'z' === p && (f = !0)
                }
                return (
                  !f && u ? (l += 'translateZ(0)') : (l = l.trim()),
                  r ? (l = r(o, e ? '' : l)) : c && e && (l = 'none'),
                  l
                )
              })(t, o, h, i)),
            m &&
              (c.transformOrigin = (function (t) {
                var n = t.originX,
                  e = void 0 === n ? '50%' : n,
                  r = t.originY,
                  o = void 0 === r ? '50%' : r,
                  i = t.originZ
                return e + ' ' + o + ' ' + (void 0 === i ? 0 : i)
              })(v)))
      }
      var pt = function () {
        return {
          style: {},
          transform: {},
          transformKeys: [],
          transformOrigin: {},
          vars: {},
        }
      }
      function mt(t, n, e) {
        for (var r in n) (0, X.i)(n[r]) || z(r, e) || (t[r] = n[r])
      }
      function ht(t, n, e) {
        var i = {}
        return (
          mt(i, t.style || {}, t),
          Object.assign(
            i,
            (function (t, n, e) {
              var i = t.transformTemplate
              return (0, o.useMemo)(
                function () {
                  var t = {
                    style: {},
                    transform: {},
                    transformKeys: [],
                    transformOrigin: {},
                    vars: {},
                  }
                  vt(t, n, void 0, void 0, {enableHardwareAcceleration: !e}, i)
                  var o = t.vars,
                    a = t.style
                  return (0, r.pi)((0, r.pi)({}, o), a)
                },
                [n],
              )
            })(t, n, e),
          ),
          t.transformValues && (i = t.transformValues(i)),
          i
        )
      }
      function yt(t, n, e) {
        var r = {},
          o = ht(t, n, e)
        return (
          Boolean(t.drag) &&
            ((r.draggable = !1),
            (o.userSelect = o.WebkitUserSelect = o.WebkitTouchCallout = 'none'),
            (o.touchAction =
              !0 === t.drag ? 'none' : 'pan-' + ('x' === t.drag ? 'y' : 'x'))),
          (r.style = o),
          r
        )
      }
      var gt = new Set([
        'initial',
        'animate',
        'exit',
        'style',
        'variants',
        'transition',
        'transformTemplate',
        'transformValues',
        'custom',
        'inherit',
        'layout',
        'layoutId',
        '_layoutResetTransform',
        'onLayoutAnimationComplete',
        'onViewportBoxUpdate',
        'onLayoutMeasure',
        'onBeforeLayoutMeasure',
        'onAnimationStart',
        'onAnimationComplete',
        'onUpdate',
        'onDragStart',
        'onDrag',
        'onDragEnd',
        'onMeasureDragConstraints',
        'onDirectionLock',
        'onDragTransitionEnd',
        'drag',
        'dragControls',
        'dragListener',
        'dragConstraints',
        'dragDirectionLock',
        '_dragX',
        '_dragY',
        'dragElastic',
        'dragMomentum',
        'dragPropagation',
        'dragTransition',
        'whileDrag',
        'onPan',
        'onPanStart',
        'onPanEnd',
        'onPanSessionStart',
        'onTap',
        'onTapStart',
        'onTapCancel',
        'onHoverStart',
        'onHoverEnd',
        'whileFocus',
        'whileTap',
        'whileHover',
      ])
      function xt(t) {
        return gt.has(t)
      }
      var bt = function (t) {
        return !xt(t)
      }
      try {
        var Pt = e(95435).Z
        bt = function (t) {
          return t.startsWith('on') ? !xt(t) : Pt(t)
        }
      } catch (Fi) {}
      function At(t, n, e) {
        return 'string' === typeof t ? t : ot.transform(n + e * t)
      }
      var Tt = function (t, n) {
          return ot.transform(t * n)
        },
        Et = {offset: 'stroke-dashoffset', array: 'stroke-dasharray'},
        wt = {offset: 'strokeDashoffset', array: 'strokeDasharray'}
      function Ct(t, n, e, o, i, a, u, s) {
        var c = n.attrX,
          l = n.attrY,
          f = n.originX,
          d = n.originY,
          v = n.pathLength,
          p = n.pathSpacing,
          m = void 0 === p ? 1 : p,
          h = n.pathOffset,
          y = void 0 === h ? 0 : h
        vt(
          t,
          (0, r._T)(n, [
            'attrX',
            'attrY',
            'originX',
            'originY',
            'pathLength',
            'pathSpacing',
            'pathOffset',
          ]),
          e,
          o,
          i,
          a,
          u,
          s,
        ),
          (t.attrs = t.style),
          (t.style = {})
        var g = t.attrs,
          x = t.style,
          b = t.dimensions,
          P = t.totalPathLength
        g.transform && (b && (x.transform = g.transform), delete g.transform),
          b &&
            (void 0 !== f || void 0 !== d || x.transform) &&
            (x.transformOrigin = (function (t, n, e) {
              return At(n, t.x, t.width) + ' ' + At(e, t.y, t.height)
            })(b, void 0 !== f ? f : 0.5, void 0 !== d ? d : 0.5)),
          void 0 !== c && (g.x = c),
          void 0 !== l && (g.y = l),
          void 0 !== P &&
            void 0 !== v &&
            (function (t, n, e, r, o, i) {
              void 0 === r && (r = 1),
                void 0 === o && (o = 0),
                void 0 === i && (i = !0)
              var a = i ? Et : wt
              t[a.offset] = Tt(-o, n)
              var u = Tt(e, n),
                s = Tt(r, n)
              t[a.array] = u + ' ' + s
            })(g, P, v, m, y, !1)
      }
      var St = function () {
        return (0, r.pi)(
          (0, r.pi)(
            {},
            {
              style: {},
              transform: {},
              transformKeys: [],
              transformOrigin: {},
              vars: {},
            },
          ),
          {attrs: {}},
        )
      }
      function Lt(t, n) {
        var e = (0, o.useMemo)(
          function () {
            var e = St()
            return (
              Ct(
                e,
                n,
                void 0,
                void 0,
                {enableHardwareAcceleration: !1},
                t.transformTemplate,
              ),
              (0, r.pi)((0, r.pi)({}, e.attrs), {style: (0, r.pi)({}, e.style)})
            )
          },
          [n],
        )
        if (t.style) {
          var i = {}
          mt(i, t.style, t), (e.style = (0, r.pi)((0, r.pi)({}, i), e.style))
        }
        return e
      }
      function Rt(t) {
        void 0 === t && (t = !1)
        return function (n, e, i, a, u) {
          var s = a.latestValues,
            c = (B(n) ? Lt : yt)(e, s, u),
            l = (function (t, n, e) {
              var r = {}
              for (var o in t)
                (bt(o) || (!0 === e && xt(o)) || (!n && !xt(o))) &&
                  (r[o] = t[o])
              return r
            })(e, 'string' === typeof n, t),
            f = (0, r.pi)((0, r.pi)((0, r.pi)({}, l), c), {ref: i})
          return (0, o.createElement)(n, f)
        }
      }
      var Mt = /([a-z])([A-Z])/g,
        kt = function (t) {
          return t.replace(Mt, '$1-$2').toLowerCase()
        }
      function Vt(t, n) {
        var e = n.style,
          r = n.vars
        for (var o in (Object.assign(t.style, e), r))
          t.style.setProperty(o, r[o])
      }
      var Dt = new Set([
        'baseFrequency',
        'diffuseConstant',
        'kernelMatrix',
        'kernelUnitLength',
        'keySplines',
        'keyTimes',
        'limitingConeAngle',
        'markerHeight',
        'markerWidth',
        'numOctaves',
        'targetX',
        'targetY',
        'surfaceScale',
        'specularConstant',
        'specularExponent',
        'stdDeviation',
        'tableValues',
        'viewBox',
        'gradientTransform',
      ])
      function jt(t, n) {
        for (var e in (Vt(t, n), n.attrs))
          t.setAttribute(Dt.has(e) ? e : kt(e), n.attrs[e])
      }
      function Bt(t) {
        var n = t.style,
          e = {}
        for (var r in n) ((0, X.i)(n[r]) || z(r, t)) && (e[r] = n[r])
        return e
      }
      function Ot(t) {
        var n = Bt(t)
        for (var e in t) {
          if ((0, X.i)(t[e]))
            n['x' === e || 'y' === e ? 'attr' + e.toUpperCase() : e] = t[e]
        }
        return n
      }
      function Ft(t) {
        return 'object' === typeof t && 'function' === typeof t.start
      }
      var Ut = function (t) {
        return Array.isArray(t)
      }
      function It(t) {
        var n,
          e = (0, X.i)(t) ? t.get() : t
        return (
          (n = e),
          Boolean(n && 'object' === typeof n && n.mix && n.toValue)
            ? e.toValue()
            : e
        )
      }
      function Ht(t, n, e, r) {
        var o = t.scrapeMotionValuesFromProps,
          i = t.createRenderState,
          a = t.onMount,
          u = {latestValues: Yt(n, e, r, o), renderState: i()}
        return (
          a &&
            (u.mount = function (t) {
              return a(n, t, u)
            }),
          u
        )
      }
      var _t = function (t) {
        return function (n, e) {
          var r = (0, o.useContext)(f),
            i = (0, o.useContext)(d)
          return e
            ? Ht(t, n, r, i)
            : v(function () {
                return Ht(t, n, r, i)
              })
        }
      }
      function Yt(t, n, e, o) {
        var i = {},
          a = !1 === (null === e || void 0 === e ? void 0 : e.initial),
          u = o(t)
        for (var s in u) i[s] = It(u[s])
        var c = t.initial,
          l = t.animate,
          f = L(t),
          d = R(t)
        n &&
          d &&
          !f &&
          !1 !== t.inherit &&
          ((null !== c && void 0 !== c) || (c = n.initial),
          (null !== l && void 0 !== l) || (l = n.animate))
        var v = a || !1 === c ? l : c
        v &&
          'boolean' !== typeof v &&
          !Ft(v) &&
          (Array.isArray(v) ? v : [v]).forEach(function (n) {
            var e = C(t, n)
            if (e) {
              var o = e.transitionEnd
              e.transition
              var a = (0, r._T)(e, ['transitionEnd', 'transition'])
              for (var u in a) i[u] = a[u]
              for (var u in o) i[u] = o[u]
            }
          })
        return i
      }
      var Nt = {
        useVisualState: _t({
          scrapeMotionValuesFromProps: Ot,
          createRenderState: St,
          onMount: function (t, n, e) {
            var r = e.renderState,
              o = e.latestValues
            try {
              r.dimensions =
                'function' === typeof n.getBBox
                  ? n.getBBox()
                  : n.getBoundingClientRect()
            } catch (i) {
              r.dimensions = {x: 0, y: 0, width: 0, height: 0}
            }
            'path' === n.tagName && (r.totalPathLength = n.getTotalLength()),
              Ct(
                r,
                o,
                void 0,
                void 0,
                {enableHardwareAcceleration: !1},
                t.transformTemplate,
              ),
              jt(n, r)
          },
        }),
      }
      var zt,
        Xt = {
          useVisualState: _t({
            scrapeMotionValuesFromProps: Bt,
            createRenderState: pt,
          }),
        }
      function Wt(t, n, e, r) {
        return (
          t.addEventListener(n, e, r),
          function () {
            return t.removeEventListener(n, e, r)
          }
        )
      }
      function Zt(t, n, e, r) {
        ;(0, o.useEffect)(
          function () {
            var o = t.current
            if (e && o) return Wt(o, n, e, r)
          },
          [t, n, e, r],
        )
      }
      function qt(t) {
        return 'undefined' !== typeof PointerEvent && t instanceof PointerEvent
          ? !('mouse' !== t.pointerType)
          : t instanceof MouseEvent
      }
      function Kt(t) {
        return !!t.touches
      }
      !(function (t) {
        ;(t.Animate = 'animate'),
          (t.Hover = 'whileHover'),
          (t.Tap = 'whileTap'),
          (t.Drag = 'whileDrag'),
          (t.Focus = 'whileFocus'),
          (t.Exit = 'exit')
      })(zt || (zt = {}))
      var $t = {pageX: 0, pageY: 0}
      function Gt(t, n) {
        void 0 === n && (n = 'page')
        var e = t.touches[0] || t.changedTouches[0] || $t
        return {x: e[n + 'X'], y: e[n + 'Y']}
      }
      function Jt(t, n) {
        return void 0 === n && (n = 'page'), {x: t[n + 'X'], y: t[n + 'Y']}
      }
      function Qt(t, n) {
        return (
          void 0 === n && (n = 'page'), {point: Kt(t) ? Gt(t, n) : Jt(t, n)}
        )
      }
      var tn = function (t, n) {
          void 0 === n && (n = !1)
          var e,
            r = function (n) {
              return t(n, Qt(n))
            }
          return n
            ? ((e = r),
              function (t) {
                var n = t instanceof MouseEvent
                ;(!n || (n && 0 === t.button)) && e(t)
              })
            : r
        },
        nn = {
          pointerdown: 'mousedown',
          pointermove: 'mousemove',
          pointerup: 'mouseup',
          pointercancel: 'mousecancel',
          pointerover: 'mouseover',
          pointerout: 'mouseout',
          pointerenter: 'mouseenter',
          pointerleave: 'mouseleave',
        },
        en = {
          pointerdown: 'touchstart',
          pointermove: 'touchmove',
          pointerup: 'touchend',
          pointercancel: 'touchcancel',
        }
      function rn(t) {
        return b && null === window.onpointerdown
          ? t
          : b && null === window.ontouchstart
          ? en[t]
          : b && null === window.onmousedown
          ? nn[t]
          : t
      }
      function on(t, n, e, r) {
        return Wt(t, rn(n), tn(e, 'pointerdown' === n), r)
      }
      function an(t, n, e, r) {
        return Zt(t, rn(n), e && tn(e, 'pointerdown' === n), r)
      }
      function un(t) {
        var n = null
        return function () {
          return (
            null === n &&
            ((n = t),
            function () {
              n = null
            })
          )
        }
      }
      var sn = un('dragHorizontal'),
        cn = un('dragVertical')
      function ln(t) {
        var n = !1
        if ('y' === t) n = cn()
        else if ('x' === t) n = sn()
        else {
          var e = sn(),
            r = cn()
          e && r
            ? (n = function () {
                e(), r()
              })
            : (e && e(), r && r())
        }
        return n
      }
      function fn() {
        var t = ln(!0)
        return !t || (t(), !1)
      }
      function dn(t, n, e) {
        return function (r, o) {
          var i
          qt(r) &&
            !fn() &&
            (null === e || void 0 === e || e(r, o),
            null === (i = t.animationState) ||
              void 0 === i ||
              i.setActive(zt.Hover, n))
        }
      }
      var vn = function (t, n) {
        return !!n && (t === n || vn(t, n.parentElement))
      }
      function pn(t) {
        return (0, o.useEffect)(function () {
          return function () {
            return t()
          }
        }, [])
      }
      var mn = function (t, n) {
          return function (e) {
            return n(t(e))
          }
        },
        hn = function () {
          for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n]
          return t.reduce(mn)
        }
      var yn = function (t) {
          return function (n) {
            return t(n), null
          }
        },
        gn = {
          tap: yn(function (t) {
            var n = t.onTap,
              e = t.onTapStart,
              r = t.onTapCancel,
              i = t.whileTap,
              a = t.visualElement,
              u = n || e || r || i,
              s = (0, o.useRef)(!1),
              c = (0, o.useRef)(null)
            function l() {
              var t
              null === (t = c.current) || void 0 === t || t.call(c),
                (c.current = null)
            }
            function f() {
              var t
              return (
                l(),
                (s.current = !1),
                null === (t = a.animationState) ||
                  void 0 === t ||
                  t.setActive(zt.Tap, !1),
                !fn()
              )
            }
            function d(t, e) {
              f() &&
                (vn(a.getInstance(), t.target)
                  ? null === n || void 0 === n || n(t, e)
                  : null === r || void 0 === r || r(t, e))
            }
            function v(t, n) {
              f() && (null === r || void 0 === r || r(t, n))
            }
            an(
              a,
              'pointerdown',
              u
                ? function (t, n) {
                    var r
                    l(),
                      s.current ||
                        ((s.current = !0),
                        (c.current = hn(
                          on(window, 'pointerup', d),
                          on(window, 'pointercancel', v),
                        )),
                        null === e || void 0 === e || e(t, n),
                        null === (r = a.animationState) ||
                          void 0 === r ||
                          r.setActive(zt.Tap, !0))
                  }
                : void 0,
            ),
              pn(l)
          }),
          focus: yn(function (t) {
            var n = t.whileFocus,
              e = t.visualElement
            Zt(
              e,
              'focus',
              n
                ? function () {
                    var t
                    null === (t = e.animationState) ||
                      void 0 === t ||
                      t.setActive(zt.Focus, !0)
                  }
                : void 0,
            ),
              Zt(
                e,
                'blur',
                n
                  ? function () {
                      var t
                      null === (t = e.animationState) ||
                        void 0 === t ||
                        t.setActive(zt.Focus, !1)
                    }
                  : void 0,
              )
          }),
          hover: yn(function (t) {
            var n = t.onHoverStart,
              e = t.onHoverEnd,
              r = t.whileHover,
              o = t.visualElement
            an(o, 'pointerenter', n || r ? dn(o, !0, n) : void 0),
              an(o, 'pointerleave', e || r ? dn(o, !1, e) : void 0)
          }),
        }
      function xn(t, n) {
        if (!Array.isArray(n)) return !1
        var e = n.length
        if (e !== t.length) return !1
        for (var r = 0; r < e; r++) if (n[r] !== t[r]) return !1
        return !0
      }
      var bn = function (t, n, e) {
          return Math.min(Math.max(e, t), n)
        },
        Pn = 0.001
      function An(t) {
        var n,
          e,
          r = t.duration,
          o = void 0 === r ? 800 : r,
          i = t.bounce,
          a = void 0 === i ? 0.25 : i,
          u = t.velocity,
          s = void 0 === u ? 0 : u,
          c = t.mass,
          l = void 0 === c ? 1 : c,
          f = 1 - a
        ;(f = bn(0.05, 1, f)),
          (o = bn(0.01, 10, o / 1e3)),
          f < 1
            ? ((n = function (t) {
                var n = t * f,
                  e = n * o,
                  r = n - s,
                  i = Tn(t, f),
                  a = Math.exp(-e)
                return Pn - (r / i) * a
              }),
              (e = function (t) {
                var e = t * f * o,
                  r = e * s + s,
                  i = Math.pow(f, 2) * Math.pow(t, 2) * o,
                  a = Math.exp(-e),
                  u = Tn(Math.pow(t, 2), f)
                return ((-n(t) + Pn > 0 ? -1 : 1) * ((r - i) * a)) / u
              }))
            : ((n = function (t) {
                return Math.exp(-t * o) * ((t - s) * o + 1) - 0.001
              }),
              (e = function (t) {
                return Math.exp(-t * o) * (o * o * (s - t))
              }))
        var d = (function (t, n, e) {
          for (var r = e, o = 1; o < 12; o++) r -= t(r) / n(r)
          return r
        })(n, e, 5 / o)
        if (((o *= 1e3), isNaN(d)))
          return {stiffness: 100, damping: 10, duration: o}
        var v = Math.pow(d, 2) * l
        return {stiffness: v, damping: 2 * f * Math.sqrt(l * v), duration: o}
      }
      function Tn(t, n) {
        return t * Math.sqrt(1 - n * n)
      }
      var En = ['duration', 'bounce'],
        wn = ['stiffness', 'damping', 'mass']
      function Cn(t, n) {
        return n.some(function (n) {
          return void 0 !== t[n]
        })
      }
      function Sn(t) {
        var n = t.from,
          e = void 0 === n ? 0 : n,
          o = t.to,
          i = void 0 === o ? 1 : o,
          a = t.restSpeed,
          u = void 0 === a ? 2 : a,
          s = t.restDelta,
          c = (0, r._T)(t, ['from', 'to', 'restSpeed', 'restDelta']),
          l = {done: !1, value: e},
          f = (function (t) {
            var n = (0, r.pi)(
              {
                velocity: 0,
                stiffness: 100,
                damping: 10,
                mass: 1,
                isResolvedFromDuration: !1,
              },
              t,
            )
            if (!Cn(t, wn) && Cn(t, En)) {
              var e = An(t)
              ;(n = (0, r.pi)((0, r.pi)((0, r.pi)({}, n), e), {
                velocity: 0,
                mass: 1,
              })).isResolvedFromDuration = !0
            }
            return n
          })(c),
          d = f.stiffness,
          v = f.damping,
          p = f.mass,
          m = f.velocity,
          h = f.duration,
          y = f.isResolvedFromDuration,
          g = Ln,
          x = Ln
        function b() {
          var t = m ? -m / 1e3 : 0,
            n = i - e,
            r = v / (2 * Math.sqrt(d * p)),
            o = Math.sqrt(d / p) / 1e3
          if (
            ((null !== s && void 0 !== s) ||
              (s = Math.abs(i - e) <= 1 ? 0.01 : 0.4),
            r < 1)
          ) {
            var a = Tn(o, r)
            ;(g = function (e) {
              var u = Math.exp(-r * o * e)
              return (
                i -
                u *
                  (((t + r * o * n) / a) * Math.sin(a * e) +
                    n * Math.cos(a * e))
              )
            }),
              (x = function (e) {
                var i = Math.exp(-r * o * e)
                return (
                  r *
                    o *
                    i *
                    ((Math.sin(a * e) * (t + r * o * n)) / a +
                      n * Math.cos(a * e)) -
                  i *
                    (Math.cos(a * e) * (t + r * o * n) -
                      a * n * Math.sin(a * e))
                )
              })
          } else if (1 === r)
            g = function (e) {
              return i - Math.exp(-o * e) * (n + (t + o * n) * e)
            }
          else {
            var u = o * Math.sqrt(r * r - 1)
            g = function (e) {
              var a = Math.exp(-r * o * e),
                s = Math.min(u * e, 300)
              return (
                i -
                (a * ((t + r * o * n) * Math.sinh(s) + u * n * Math.cosh(s))) /
                  u
              )
            }
          }
        }
        return (
          b(),
          {
            next: function (t) {
              var n = g(t)
              if (y) l.done = t >= h
              else {
                var e = 1e3 * x(t),
                  r = Math.abs(e) <= u,
                  o = Math.abs(i - n) <= s
                l.done = r && o
              }
              return (l.value = l.done ? i : n), l
            },
            flipTarget: function () {
              var t
              ;(m = -m), (e = (t = [i, e])[0]), (i = t[1]), b()
            },
          }
        )
      }
      Sn.needsInterpolation = function (t, n) {
        return 'string' === typeof t || 'string' === typeof n
      }
      var Ln = function (t) {
          return 0
        },
        Rn = function (t, n, e) {
          var r = n - t
          return 0 === r ? 1 : (e - t) / r
        },
        Mn = function (t, n, e) {
          return -e * t + e * n + t
        },
        kn = function (t, n) {
          return function (e) {
            return Boolean(
              (tt(e) && Q.test(e) && e.startsWith(t)) ||
                (n && Object.prototype.hasOwnProperty.call(e, n)),
            )
          }
        },
        Vn = function (t, n, e) {
          return function (r) {
            var o
            if (!tt(r)) return r
            var i = r.match(G),
              a = i[0],
              u = i[1],
              s = i[2],
              c = i[3]
            return (
              ((o = {})[t] = parseFloat(a)),
              (o[n] = parseFloat(u)),
              (o[e] = parseFloat(s)),
              (o.alpha = void 0 !== c ? parseFloat(c) : 1),
              o
            )
          }
        },
        Dn = K(0, 255),
        jn = (0, r.pi)((0, r.pi)({}, st), {
          transform: function (t) {
            return Math.round(Dn(t))
          },
        }),
        Bn = {
          test: kn('rgb', 'red'),
          parse: Vn('red', 'green', 'blue'),
          transform: function (t) {
            var n = t.red,
              e = t.green,
              r = t.blue,
              o = t.alpha,
              i = void 0 === o ? 1 : o
            return (
              'rgba(' +
              jn.transform(n) +
              ', ' +
              jn.transform(e) +
              ', ' +
              jn.transform(r) +
              ', ' +
              $(ct.transform(i)) +
              ')'
            )
          },
        }
      var On = {
          test: kn('#'),
          parse: function (t) {
            var n = '',
              e = '',
              r = '',
              o = ''
            return (
              t.length > 5
                ? ((n = t.substr(1, 2)),
                  (e = t.substr(3, 2)),
                  (r = t.substr(5, 2)),
                  (o = t.substr(7, 2)))
                : ((n = t.substr(1, 1)),
                  (e = t.substr(2, 1)),
                  (r = t.substr(3, 1)),
                  (o = t.substr(4, 1)),
                  (n += n),
                  (e += e),
                  (r += r),
                  (o += o)),
              {
                red: parseInt(n, 16),
                green: parseInt(e, 16),
                blue: parseInt(r, 16),
                alpha: o ? parseInt(o, 16) / 255 : 1,
              }
            )
          },
          transform: Bn.transform,
        },
        Fn = {
          test: kn('hsl', 'hue'),
          parse: Vn('hue', 'saturation', 'lightness'),
          transform: function (t) {
            var n = t.hue,
              e = t.saturation,
              r = t.lightness,
              o = t.alpha,
              i = void 0 === o ? 1 : o
            return (
              'hsla(' +
              Math.round(n) +
              ', ' +
              rt.transform($(e)) +
              ', ' +
              rt.transform($(r)) +
              ', ' +
              $(ct.transform(i)) +
              ')'
            )
          },
        },
        Un = function (t, n, e) {
          var r = t * t,
            o = n * n
          return Math.sqrt(Math.max(0, e * (o - r) + r))
        },
        In = [On, Bn, Fn],
        Hn = function (t) {
          return In.find(function (n) {
            return n.test(t)
          })
        },
        _n = function (t) {
          return (
            "'" +
            t +
            "' is not an animatable color. Use the equivalent color code instead."
          )
        },
        Yn = function (t, n) {
          var e = Hn(t),
            o = Hn(n)
          _n(t), _n(n), e.transform, o.transform
          var i = e.parse(t),
            a = o.parse(n),
            u = (0, r.pi)({}, i),
            s = e === Fn ? Mn : Un
          return function (t) {
            for (var n in u) 'alpha' !== n && (u[n] = s(i[n], a[n], t))
            return (u.alpha = Mn(i.alpha, a.alpha, t)), e.transform(u)
          }
        },
        Nn = {
          test: function (t) {
            return Bn.test(t) || On.test(t) || Fn.test(t)
          },
          parse: function (t) {
            return Bn.test(t)
              ? Bn.parse(t)
              : Fn.test(t)
              ? Fn.parse(t)
              : On.parse(t)
          },
          transform: function (t) {
            return tt(t)
              ? t
              : t.hasOwnProperty('red')
              ? Bn.transform(t)
              : Fn.transform(t)
          },
        },
        zn = '${c}',
        Xn = '${n}'
      function Wn(t) {
        var n = [],
          e = 0,
          r = t.match(J)
        r &&
          ((e = r.length),
          (t = t.replace(J, zn)),
          n.push.apply(n, r.map(Nn.parse)))
        var o = t.match(G)
        return (
          o && ((t = t.replace(G, Xn)), n.push.apply(n, o.map(st.parse))),
          {values: n, numColors: e, tokenised: t}
        )
      }
      function Zn(t) {
        return Wn(t).values
      }
      function qn(t) {
        var n = Wn(t),
          e = n.values,
          r = n.numColors,
          o = n.tokenised,
          i = e.length
        return function (t) {
          for (var n = o, e = 0; e < i; e++)
            n = n.replace(e < r ? zn : Xn, e < r ? Nn.transform(t[e]) : $(t[e]))
          return n
        }
      }
      var Kn = function (t) {
        return 'number' === typeof t ? 0 : t
      }
      var $n = {
          test: function (t) {
            var n, e, r, o
            return (
              isNaN(t) &&
              tt(t) &&
              (null !==
                (e =
                  null === (n = t.match(G)) || void 0 === n
                    ? void 0
                    : n.length) && void 0 !== e
                ? e
                : 0) +
                (null !==
                  (o =
                    null === (r = t.match(J)) || void 0 === r
                      ? void 0
                      : r.length) && void 0 !== o
                  ? o
                  : 0) >
                0
            )
          },
          parse: Zn,
          createTransformer: qn,
          getAnimatableNone: function (t) {
            var n = Zn(t)
            return qn(t)(n.map(Kn))
          },
        },
        Gn = function (t) {
          return 'number' === typeof t
        }
      function Jn(t, n) {
        return Gn(t)
          ? function (e) {
              return Mn(t, n, e)
            }
          : Nn.test(t)
          ? Yn(t, n)
          : ee(t, n)
      }
      var Qn = function (t, n) {
          var e = (0, r.ev)([], t),
            o = e.length,
            i = t.map(function (t, e) {
              return Jn(t, n[e])
            })
          return function (t) {
            for (var n = 0; n < o; n++) e[n] = i[n](t)
            return e
          }
        },
        te = function (t, n) {
          var e = (0, r.pi)((0, r.pi)({}, t), n),
            o = {}
          for (var i in e)
            void 0 !== t[i] && void 0 !== n[i] && (o[i] = Jn(t[i], n[i]))
          return function (t) {
            for (var n in o) e[n] = o[n](t)
            return e
          }
        }
      function ne(t) {
        for (
          var n = $n.parse(t), e = n.length, r = 0, o = 0, i = 0, a = 0;
          a < e;
          a++
        )
          r || 'number' === typeof n[a] ? r++ : void 0 !== n[a].hue ? i++ : o++
        return {parsed: n, numNumbers: r, numRGB: o, numHSL: i}
      }
      var ee = function (t, n) {
          var e = $n.createTransformer(n),
            r = ne(t),
            o = ne(n)
          return (
            r.numHSL === o.numHSL &&
              r.numRGB === o.numRGB &&
              (r.numNumbers, o.numNumbers),
            hn(Qn(r.parsed, o.parsed), e)
          )
        },
        re = function (t, n) {
          return function (e) {
            return Mn(t, n, e)
          }
        }
      function oe(t, n, e) {
        for (
          var r,
            o = [],
            i =
              e ||
              ('number' === typeof (r = t[0])
                ? re
                : 'string' === typeof r
                ? Nn.test(r)
                  ? Yn
                  : ee
                : Array.isArray(r)
                ? Qn
                : 'object' === typeof r
                ? te
                : void 0),
            a = t.length - 1,
            u = 0;
          u < a;
          u++
        ) {
          var s = i(t[u], t[u + 1])
          if (n) {
            var c = Array.isArray(n) ? n[u] : n
            s = hn(c, s)
          }
          o.push(s)
        }
        return o
      }
      function ie(t, n, e) {
        var r = void 0 === e ? {} : e,
          o = r.clamp,
          i = void 0 === o || o,
          a = r.ease,
          u = r.mixer,
          s = t.length
        n.length,
          !a || !Array.isArray(a) || a.length,
          t[0] > t[s - 1] &&
            ((t = [].concat(t)), (n = [].concat(n)), t.reverse(), n.reverse())
        var c = oe(n, a, u),
          l =
            2 === s
              ? (function (t, n) {
                  var e = t[0],
                    r = t[1],
                    o = n[0]
                  return function (t) {
                    return o(Rn(e, r, t))
                  }
                })(t, c)
              : (function (t, n) {
                  var e = t.length,
                    r = e - 1
                  return function (o) {
                    var i = 0,
                      a = !1
                    if (
                      (o <= t[0]
                        ? (a = !0)
                        : o >= t[r] && ((i = r - 1), (a = !0)),
                      !a)
                    ) {
                      for (var u = 1; u < e && !(t[u] > o || u === r); u++);
                      i = u - 1
                    }
                    var s = Rn(t[i], t[i + 1], o)
                    return n[i](s)
                  }
                })(t, c)
        return i
          ? function (n) {
              return l(bn(t[0], t[s - 1], n))
            }
          : l
      }
      var ae,
        ue = function (t) {
          return function (n) {
            return 1 - t(1 - n)
          }
        },
        se = function (t) {
          return function (n) {
            return n <= 0.5 ? t(2 * n) / 2 : (2 - t(2 * (1 - n))) / 2
          }
        },
        ce = function (t) {
          return function (n) {
            return n * n * ((t + 1) * n - t)
          }
        },
        le = function (t) {
          return t
        },
        fe =
          ((ae = 2),
          function (t) {
            return Math.pow(t, ae)
          }),
        de = ue(fe),
        ve = se(fe),
        pe = function (t) {
          return 1 - Math.sin(Math.acos(t))
        },
        me = ue(pe),
        he = se(me),
        ye = ce(1.525),
        ge = ue(ye),
        xe = se(ye),
        be = (function (t) {
          var n = ce(t)
          return function (t) {
            return (t *= 2) < 1
              ? 0.5 * n(t)
              : 0.5 * (2 - Math.pow(2, -10 * (t - 1)))
          }
        })(1.525),
        Pe = function (t) {
          if (1 === t || 0 === t) return t
          var n = t * t
          return t < 0.36363636363636365
            ? 7.5625 * n
            : t < 0.7272727272727273
            ? 9.075 * n - 9.9 * t + 3.4
            : t < 0.9
            ? 12.066481994459833 * n - 19.63545706371191 * t + 8.898060941828255
            : 10.8 * t * t - 20.52 * t + 10.72
        },
        Ae = ue(Pe)
      function Te(t, n) {
        return t
          .map(function () {
            return n || ve
          })
          .splice(0, t.length - 1)
      }
      function Ee(t) {
        var n = t.from,
          e = void 0 === n ? 0 : n,
          r = t.to,
          o = void 0 === r ? 1 : r,
          i = t.ease,
          a = t.offset,
          u = t.duration,
          s = void 0 === u ? 300 : u,
          c = {done: !1, value: e},
          l = Array.isArray(o) ? o : [e, o],
          f = (function (t, n) {
            return t.map(function (t) {
              return t * n
            })
          })(
            a && a.length === l.length
              ? a
              : (function (t) {
                  var n = t.length
                  return t.map(function (t, e) {
                    return 0 !== e ? e / (n - 1) : 0
                  })
                })(l),
            s,
          )
        function d() {
          return ie(f, l, {ease: Array.isArray(i) ? i : Te(l, i)})
        }
        var v = d()
        return {
          next: function (t) {
            return (c.value = v(t)), (c.done = t >= s), c
          },
          flipTarget: function () {
            l.reverse(), (v = d())
          },
        }
      }
      var we = {
        keyframes: Ee,
        spring: Sn,
        decay: function (t) {
          var n = t.velocity,
            e = void 0 === n ? 0 : n,
            r = t.from,
            o = void 0 === r ? 0 : r,
            i = t.power,
            a = void 0 === i ? 0.8 : i,
            u = t.timeConstant,
            s = void 0 === u ? 350 : u,
            c = t.restDelta,
            l = void 0 === c ? 0.5 : c,
            f = t.modifyTarget,
            d = {done: !1, value: o},
            v = a * e,
            p = o + v,
            m = void 0 === f ? p : f(p)
          return (
            m !== p && (v = m - o),
            {
              next: function (t) {
                var n = -v * Math.exp(-t / s)
                return (
                  (d.done = !(n > l || n < -l)),
                  (d.value = d.done ? m : m + n),
                  d
                )
              },
              flipTarget: function () {},
            }
          )
        },
      }
      var Ce = e(15148)
      function Se(t, n, e) {
        return void 0 === e && (e = 0), t - n - e
      }
      var Le = function (t) {
        var n = function (n) {
          var e = n.delta
          return t(e)
        }
        return {
          start: function () {
            return Ce.ZP.update(n, !0)
          },
          stop: function () {
            return Ce.qY.update(n)
          },
        }
      }
      function Re(t) {
        var n,
          e,
          o,
          i,
          a,
          u = t.from,
          s = t.autoplay,
          c = void 0 === s || s,
          l = t.driver,
          f = void 0 === l ? Le : l,
          d = t.elapsed,
          v = void 0 === d ? 0 : d,
          p = t.repeat,
          m = void 0 === p ? 0 : p,
          h = t.repeatType,
          y = void 0 === h ? 'loop' : h,
          g = t.repeatDelay,
          x = void 0 === g ? 0 : g,
          b = t.onPlay,
          P = t.onStop,
          A = t.onComplete,
          T = t.onRepeat,
          E = t.onUpdate,
          w = (0, r._T)(t, [
            'from',
            'autoplay',
            'driver',
            'elapsed',
            'repeat',
            'repeatType',
            'repeatDelay',
            'onPlay',
            'onStop',
            'onComplete',
            'onRepeat',
            'onUpdate',
          ]),
          C = w.to,
          S = 0,
          L = w.duration,
          R = !1,
          M = !0,
          k = (function (t) {
            if (Array.isArray(t.to)) return Ee
            if (we[t.type]) return we[t.type]
            var n = new Set(Object.keys(t))
            return n.has('ease') ||
              (n.has('duration') && !n.has('dampingRatio'))
              ? Ee
              : n.has('dampingRatio') ||
                n.has('stiffness') ||
                n.has('mass') ||
                n.has('damping') ||
                n.has('restSpeed') ||
                n.has('restDelta')
              ? Sn
              : Ee
          })(w)
        ;(null === (e = (n = k).needsInterpolation) || void 0 === e
          ? void 0
          : e.call(n, u, C)) &&
          ((a = ie([0, 100], [u, C], {clamp: !1})), (u = 0), (C = 100))
        var V = k((0, r.pi)((0, r.pi)({}, w), {from: u, to: C}))
        function D() {
          S++,
            'reverse' === y
              ? (v = (function (t, n, e, r) {
                  return (
                    void 0 === e && (e = 0),
                    void 0 === r && (r = !0),
                    r ? Se(n + -t, n, e) : n - (t - n) + e
                  )
                })(v, L, x, (M = S % 2 === 0)))
              : ((v = Se(v, L, x)), 'mirror' === y && V.flipTarget()),
            (R = !1),
            T && T()
        }
        function j(t) {
          if ((M || (t = -t), (v += t), !R)) {
            var n = V.next(Math.max(0, v))
            ;(i = n.value), a && (i = a(i)), (R = M ? n.done : v <= 0)
          }
          null === E || void 0 === E || E(i),
            R &&
              (0 === S && ((null !== L && void 0 !== L) || (L = v)),
              S < m
                ? (function (t, n, e, r) {
                    return r ? t >= n + e : t <= -e
                  })(v, L, x, M) && D()
                : (o.stop(), A && A()))
        }
        return (
          c && (null === b || void 0 === b || b(), (o = f(j)).start()),
          {
            stop: function () {
              null === P || void 0 === P || P(), o.stop()
            },
          }
        )
      }
      var Me = e(27349)
      var ke = function (t) {
          return 1e3 * t
        },
        Ve = function (t, n) {
          return 1 - 3 * n + 3 * t
        },
        De = function (t, n) {
          return 3 * n - 6 * t
        },
        je = function (t) {
          return 3 * t
        },
        Be = function (t, n, e) {
          return ((Ve(n, e) * t + De(n, e)) * t + je(n)) * t
        },
        Oe = function (t, n, e) {
          return 3 * Ve(n, e) * t * t + 2 * De(n, e) * t + je(n)
        }
      var Fe = 0.1
      function Ue(t, n, e, r) {
        if (t === n && e === r) return le
        for (var o = new Float32Array(11), i = 0; i < 11; ++i)
          o[i] = Be(i * Fe, t, e)
        function a(n) {
          for (var r = 0, i = 1; 10 !== i && o[i] <= n; ++i) r += Fe
          --i
          var a = r + ((n - o[i]) / (o[i + 1] - o[i])) * Fe,
            u = Oe(a, t, e)
          return u >= 0.001
            ? (function (t, n, e, r) {
                for (var o = 0; o < 8; ++o) {
                  var i = Oe(n, e, r)
                  if (0 === i) return n
                  n -= (Be(n, e, r) - t) / i
                }
                return n
              })(n, a, t, e)
            : 0 === u
            ? a
            : (function (t, n, e, r, o) {
                var i,
                  a,
                  u = 0
                do {
                  ;(i = Be((a = n + (e - n) / 2), r, o) - t) > 0
                    ? (e = a)
                    : (n = a)
                } while (Math.abs(i) > 1e-7 && ++u < 10)
                return a
              })(n, r, r + Fe, t, e)
        }
        return function (t) {
          return 0 === t || 1 === t ? t : Be(a(t), n, r)
        }
      }
      var Ie = {
          linear: le,
          easeIn: fe,
          easeInOut: ve,
          easeOut: de,
          circIn: pe,
          circInOut: he,
          circOut: me,
          backIn: ye,
          backInOut: xe,
          backOut: ge,
          anticipate: be,
          bounceIn: Ae,
          bounceInOut: function (t) {
            return t < 0.5
              ? 0.5 * (1 - Pe(1 - 2 * t))
              : 0.5 * Pe(2 * t - 1) + 0.5
          },
          bounceOut: Pe,
        },
        He = function (t) {
          if (Array.isArray(t)) {
            t.length
            var n = (0, r.CR)(t, 4)
            return Ue(n[0], n[1], n[2], n[3])
          }
          return 'string' === typeof t ? Ie[t] : t
        },
        _e = function (t, n) {
          return (
            'zIndex' !== t &&
            (!('number' !== typeof n && !Array.isArray(n)) ||
              !('string' !== typeof n || !$n.test(n) || n.startsWith('url(')))
          )
        },
        Ye = function () {
          return {
            type: 'spring',
            stiffness: 500,
            damping: 25,
            restDelta: 0.5,
            restSpeed: 10,
          }
        },
        Ne = function (t) {
          return {
            type: 'spring',
            stiffness: 550,
            damping: 0 === t ? 2 * Math.sqrt(550) : 30,
            restDelta: 0.01,
            restSpeed: 10,
          }
        },
        ze = function () {
          return {type: 'keyframes', ease: 'linear', duration: 0.3}
        },
        Xe = function (t) {
          return {type: 'keyframes', duration: 0.8, values: t}
        },
        We = {
          x: Ye,
          y: Ye,
          z: Ye,
          rotate: Ye,
          rotateX: Ye,
          rotateY: Ye,
          rotateZ: Ye,
          scaleX: Ne,
          scaleY: Ne,
          scale: Ne,
          opacity: ze,
          backgroundColor: ze,
          color: ze,
          default: Ne,
        },
        Ze = new Set(['brightness', 'contrast', 'saturate', 'opacity'])
      function qe(t) {
        var n = t.slice(0, -1).split('('),
          e = n[0],
          r = n[1]
        if ('drop-shadow' === e) return t
        var o = (r.match(G) || [])[0]
        if (!o) return t
        var i = r.replace(o, ''),
          a = Ze.has(e) ? 1 : 0
        return o !== r && (a *= 100), e + '(' + a + i + ')'
      }
      var Ke = /([a-z-]*)\(.*?\)/g,
        $e = (0, r.pi)((0, r.pi)({}, $n), {
          getAnimatableNone: function (t) {
            var n = t.match(Ke)
            return n ? n.map(qe).join(' ') : t
          },
        }),
        Ge = (0, r.pi)((0, r.pi)({}, dt), {
          color: Nn,
          backgroundColor: Nn,
          outlineColor: Nn,
          fill: Nn,
          stroke: Nn,
          borderColor: Nn,
          borderTopColor: Nn,
          borderRightColor: Nn,
          borderBottomColor: Nn,
          borderLeftColor: Nn,
          filter: $e,
          WebkitFilter: $e,
        }),
        Je = function (t) {
          return Ge[t]
        }
      function Qe(t, n) {
        var e,
          r = Je(t)
        return (
          r !== $e && (r = $n),
          null === (e = r.getAnimatableNone) || void 0 === e
            ? void 0
            : e.call(r, n)
        )
      }
      function tr(t) {
        var n = t.ease,
          e = t.times,
          o = t.yoyo,
          i = t.flip,
          a = t.loop,
          u = (0, r._T)(t, ['ease', 'times', 'yoyo', 'flip', 'loop']),
          s = (0, r.pi)({}, u)
        return (
          e && (s.offset = e),
          u.duration && (s.duration = ke(u.duration)),
          u.repeatDelay && (s.repeatDelay = ke(u.repeatDelay)),
          n &&
            (s.ease = (function (t) {
              return Array.isArray(t) && 'number' !== typeof t[0]
            })(n)
              ? n.map(He)
              : He(n)),
          'tween' === u.type && (s.type = 'keyframes'),
          (o || a || i) &&
            (!0,
            o
              ? (s.repeatType = 'reverse')
              : a
              ? (s.repeatType = 'loop')
              : i && (s.repeatType = 'mirror'),
            (s.repeat = a || o || i || u.repeat)),
          'spring' !== u.type && (s.type = 'keyframes'),
          s
        )
      }
      function nr(t, n, e) {
        var o
        return (
          Array.isArray(n.to) &&
            ((null !== (o = t.duration) && void 0 !== o) || (t.duration = 0.8)),
          (function (t) {
            Array.isArray(t.to) &&
              null === t.to[0] &&
              ((t.to = (0, r.ev)([], (0, r.CR)(t.to))), (t.to[0] = t.from))
          })(n),
          (function (t) {
            t.when,
              t.delay,
              t.delayChildren,
              t.staggerChildren,
              t.staggerDirection,
              t.repeat,
              t.repeatType,
              t.repeatDelay,
              t.from
            var n = (0, r._T)(t, [
              'when',
              'delay',
              'delayChildren',
              'staggerChildren',
              'staggerDirection',
              'repeat',
              'repeatType',
              'repeatDelay',
              'from',
            ])
            return !!Object.keys(n).length
          })(t) ||
            (t = (0, r.pi)(
              (0, r.pi)({}, t),
              (function (t, n) {
                var e
                return (
                  (e = Ut(n) ? Xe : We[t] || We.default),
                  (0, r.pi)({to: n}, e(n))
                )
              })(e, n.to),
            )),
          (0, r.pi)((0, r.pi)({}, n), tr(t))
        )
      }
      function er(t, n, e, o, i) {
        var a,
          u = ir(o, t),
          s = null !== (a = u.from) && void 0 !== a ? a : n.get(),
          c = _e(t, e)
        'none' === s && c && 'string' === typeof e
          ? (s = Qe(t, e))
          : rr(s) && 'string' === typeof e
          ? (s = or(e))
          : !Array.isArray(e) && rr(e) && 'string' === typeof s && (e = or(s))
        var l = _e(t, s)
        return l && c && !1 !== u.type
          ? function () {
              var o = {
                from: s,
                to: e,
                velocity: n.getVelocity(),
                onComplete: i,
                onUpdate: function (t) {
                  return n.set(t)
                },
              }
              return 'inertia' === u.type || 'decay' === u.type
                ? (function (t) {
                    var n,
                      e = t.from,
                      o = void 0 === e ? 0 : e,
                      i = t.velocity,
                      a = void 0 === i ? 0 : i,
                      u = t.min,
                      s = t.max,
                      c = t.power,
                      l = void 0 === c ? 0.8 : c,
                      f = t.timeConstant,
                      d = void 0 === f ? 750 : f,
                      v = t.bounceStiffness,
                      p = void 0 === v ? 500 : v,
                      m = t.bounceDamping,
                      h = void 0 === m ? 10 : m,
                      y = t.restDelta,
                      g = void 0 === y ? 1 : y,
                      x = t.modifyTarget,
                      b = t.driver,
                      P = t.onUpdate,
                      A = t.onComplete
                    function T(t) {
                      return (void 0 !== u && t < u) || (void 0 !== s && t > s)
                    }
                    function E(t) {
                      return void 0 === u
                        ? s
                        : void 0 === s || Math.abs(u - t) < Math.abs(s - t)
                        ? u
                        : s
                    }
                    function w(t) {
                      null === n || void 0 === n || n.stop(),
                        (n = Re(
                          (0, r.pi)((0, r.pi)({}, t), {
                            driver: b,
                            onUpdate: function (n) {
                              var e
                              null === P || void 0 === P || P(n),
                                null === (e = t.onUpdate) ||
                                  void 0 === e ||
                                  e.call(t, n)
                            },
                            onComplete: A,
                          }),
                        ))
                    }
                    function C(t) {
                      w(
                        (0, r.pi)(
                          {
                            type: 'spring',
                            stiffness: p,
                            damping: h,
                            restDelta: g,
                          },
                          t,
                        ),
                      )
                    }
                    if (T(o)) C({from: o, velocity: a, to: E(o)})
                    else {
                      var S = l * a + o
                      'undefined' !== typeof x && (S = x(S))
                      var L,
                        R,
                        M = E(S),
                        k = M === u ? -1 : 1
                      w({
                        type: 'decay',
                        from: o,
                        velocity: a,
                        timeConstant: d,
                        power: l,
                        restDelta: g,
                        modifyTarget: x,
                        onUpdate: T(S)
                          ? function (t) {
                              ;(L = R),
                                (R = t),
                                (a = (0, Me.R)(t - L, (0, Ce.$B)().delta)),
                                ((1 === k && t > M) || (-1 === k && t < M)) &&
                                  C({from: t, to: M, velocity: a})
                            }
                          : void 0,
                      })
                    }
                    return {
                      stop: function () {
                        return null === n || void 0 === n ? void 0 : n.stop()
                      },
                    }
                  })((0, r.pi)((0, r.pi)({}, o), u))
                : Re(
                    (0, r.pi)((0, r.pi)({}, nr(u, o, t)), {
                      onUpdate: function (t) {
                        var n
                        o.onUpdate(t),
                          null === (n = u.onUpdate) ||
                            void 0 === n ||
                            n.call(u, t)
                      },
                      onComplete: function () {
                        var t
                        o.onComplete(),
                          null === (t = u.onComplete) ||
                            void 0 === t ||
                            t.call(u)
                      },
                    }),
                  )
            }
          : function () {
              var t
              return (
                n.set(e),
                i(),
                null ===
                  (t = null === u || void 0 === u ? void 0 : u.onComplete) ||
                  void 0 === t ||
                  t.call(u),
                {stop: function () {}}
              )
            }
      }
      function rr(t) {
        return (
          0 === t ||
          ('string' === typeof t &&
            0 === parseFloat(t) &&
            -1 === t.indexOf(' '))
        )
      }
      function or(t) {
        return 'number' === typeof t ? 0 : Qe('', t)
      }
      function ir(t, n) {
        return t[n] || t.default || t
      }
      function ar(t, n, e, r) {
        return (
          void 0 === r && (r = {}),
          n.start(function (o) {
            var i,
              a,
              u = er(t, n, e, r, o),
              s = (function (t, n) {
                var e
                return null !== (e = (ir(t, n) || {}).delay) && void 0 !== e
                  ? e
                  : 0
              })(r, t),
              c = function () {
                return (a = u())
              }
            return (
              s ? (i = setTimeout(c, ke(s))) : c(),
              function () {
                clearTimeout(i), null === a || void 0 === a || a.stop()
              }
            )
          })
        )
      }
      var ur = e(3902),
        sr = function (t) {
          return function (n) {
            return n.test(t)
          }
        },
        cr = [
          st,
          ot,
          rt,
          et,
          at,
          it,
          {
            test: function (t) {
              return 'auto' === t
            },
            parse: function (t) {
              return t
            },
          },
        ],
        lr = function (t) {
          return cr.find(sr(t))
        },
        fr = (0, r.ev)((0, r.ev)([], (0, r.CR)(cr)), [Nn, $n]),
        dr = function (t) {
          return fr.find(sr(t))
        }
      function vr(t, n, e) {
        t.hasValue(n) ? t.getValue(n).set(e) : t.addValue(n, (0, ur.B)(e))
      }
      function pr(t, n) {
        var e = S(t, n),
          o = e ? t.makeTargetAnimatable(e, !1) : {},
          i = o.transitionEnd,
          a = void 0 === i ? {} : i
        o.transition
        var u,
          s = (0, r._T)(o, ['transitionEnd', 'transition'])
        for (var c in (s = (0, r.pi)((0, r.pi)({}, s), a))) {
          vr(t, c, ((u = s[c]), Ut(u) ? u[u.length - 1] || 0 : u))
        }
      }
      function mr(t, n) {
        if (n) return (n[t] || n.default || n).from
      }
      function hr(t, n, e) {
        var o
        void 0 === e && (e = {})
        var i = S(t, n, e.custom),
          a = (i || {}).transition,
          u = void 0 === a ? t.getDefaultTransition() || {} : a
        e.transitionOverride && (u = e.transitionOverride)
        var s = i
            ? function () {
                return yr(t, i, e)
              }
            : function () {
                return Promise.resolve()
              },
          c = (
            null === (o = t.variantChildren) || void 0 === o ? void 0 : o.size
          )
            ? function (o) {
                void 0 === o && (o = 0)
                var i = u.delayChildren,
                  a = void 0 === i ? 0 : i,
                  s = u.staggerChildren,
                  c = u.staggerDirection
                return (function (t, n, e, o, i, a) {
                  void 0 === e && (e = 0)
                  void 0 === o && (o = 0)
                  void 0 === i && (i = 1)
                  var u = [],
                    s = (t.variantChildren.size - 1) * o,
                    c =
                      1 === i
                        ? function (t) {
                            return void 0 === t && (t = 0), t * o
                          }
                        : function (t) {
                            return void 0 === t && (t = 0), s - t * o
                          }
                  return (
                    Array.from(t.variantChildren)
                      .sort(gr)
                      .forEach(function (t, o) {
                        u.push(
                          hr(
                            t,
                            n,
                            (0, r.pi)((0, r.pi)({}, a), {delay: e + c(o)}),
                          ).then(function () {
                            return t.notifyAnimationComplete(n)
                          }),
                        )
                      }),
                    Promise.all(u)
                  )
                })(t, n, a + o, s, c, e)
              }
            : function () {
                return Promise.resolve()
              },
          l = u.when
        if (l) {
          var f = (0, r.CR)('beforeChildren' === l ? [s, c] : [c, s], 2),
            d = f[0],
            v = f[1]
          return d().then(v)
        }
        return Promise.all([s(), c(e.delay)])
      }
      function yr(t, n, e) {
        var o,
          i = void 0 === e ? {} : e,
          a = i.delay,
          u = void 0 === a ? 0 : a,
          s = i.transitionOverride,
          c = i.type,
          l = t.makeTargetAnimatable(n),
          f = l.transition,
          d = void 0 === f ? t.getDefaultTransition() : f,
          v = l.transitionEnd,
          p = (0, r._T)(l, ['transition', 'transitionEnd'])
        s && (d = s)
        var m = [],
          h =
            c &&
            (null === (o = t.animationState) || void 0 === o
              ? void 0
              : o.getState()[c])
        for (var y in p) {
          var g = t.getValue(y),
            x = p[y]
          if (!(!g || void 0 === x || (h && xr(h, y)))) {
            var b = ar(y, g, x, (0, r.pi)({delay: u}, d))
            m.push(b)
          }
        }
        return Promise.all(m).then(function () {
          v && pr(t, v)
        })
      }
      function gr(t, n) {
        return t.sortNodePosition(n)
      }
      function xr(t, n) {
        var e = t.protectedKeys,
          r = t.needsAnimating,
          o = e.hasOwnProperty(n) && !0 !== r[n]
        return (r[n] = !1), o
      }
      var br = [zt.Animate, zt.Hover, zt.Tap, zt.Drag, zt.Focus, zt.Exit],
        Pr = (0, r.ev)([], (0, r.CR)(br)).reverse(),
        Ar = br.length
      function Tr(t) {
        return function (n) {
          return Promise.all(
            n.map(function (n) {
              var e = n.animation,
                r = n.options
              return (function (t, n, e) {
                var r
                if (
                  (void 0 === e && (e = {}),
                  t.notifyAnimationStart(),
                  Array.isArray(n))
                ) {
                  var o = n.map(function (n) {
                    return hr(t, n, e)
                  })
                  r = Promise.all(o)
                } else if ('string' === typeof n) r = hr(t, n, e)
                else {
                  var i = 'function' === typeof n ? S(t, n, e.custom) : n
                  r = yr(t, i, e)
                }
                return r.then(function () {
                  return t.notifyAnimationComplete(n)
                })
              })(t, e, r)
            }),
          )
        }
      }
      function Er(t) {
        var n = Tr(t),
          e = (function () {
            var t
            return (
              ((t = {})[zt.Animate] = wr(!0)),
              (t[zt.Hover] = wr()),
              (t[zt.Tap] = wr()),
              (t[zt.Drag] = wr()),
              (t[zt.Focus] = wr()),
              (t[zt.Exit] = wr()),
              t
            )
          })(),
          o = {},
          i = !0,
          a = function (n, e) {
            var o = S(t, e)
            if (o) {
              o.transition
              var i = o.transitionEnd,
                a = (0, r._T)(o, ['transition', 'transitionEnd'])
              n = (0, r.pi)((0, r.pi)((0, r.pi)({}, n), a), i)
            }
            return n
          }
        function u(u, s) {
          for (
            var c,
              l = t.getProps(),
              f = t.getVariantContext(!0) || {},
              d = [],
              v = new Set(),
              p = {},
              m = 1 / 0,
              h = function (n) {
                var o = Pr[n],
                  h = e[o],
                  y = null !== (c = l[o]) && void 0 !== c ? c : f[o],
                  g = w(y),
                  x = o === s ? h.isActive : null
                !1 === x && (m = n)
                var b = y === f[o] && y !== l[o] && g
                if (
                  (b && i && t.manuallyAnimateOnMount && (b = !1),
                  (h.protectedKeys = (0, r.pi)({}, p)),
                  (!h.isActive && null === x) ||
                    (!y && !h.prevProp) ||
                    Ft(y) ||
                    'boolean' === typeof y)
                )
                  return 'continue'
                var P =
                    (function (t, n) {
                      if ('string' === typeof n) return n !== t
                      if (E(n)) return !xn(n, t)
                      return !1
                    })(h.prevProp, y) ||
                    (o === s && h.isActive && !b && g) ||
                    (n > m && g),
                  A = Array.isArray(y) ? y : [y],
                  T = A.reduce(a, {})
                !1 === x && (T = {})
                var C = h.prevResolvedValues,
                  S = void 0 === C ? {} : C,
                  L = (0, r.pi)((0, r.pi)({}, S), T),
                  R = function (t) {
                    ;(P = !0), v.delete(t), (h.needsAnimating[t] = !0)
                  }
                for (var M in L) {
                  var k = T[M],
                    V = S[M]
                  p.hasOwnProperty(M) ||
                    (k !== V
                      ? Ut(k) && Ut(V)
                        ? xn(k, V)
                          ? (h.protectedKeys[M] = !0)
                          : R(M)
                        : void 0 !== k
                        ? R(M)
                        : v.add(M)
                      : void 0 !== k && v.has(M)
                      ? R(M)
                      : (h.protectedKeys[M] = !0))
                }
                ;(h.prevProp = y),
                  (h.prevResolvedValues = T),
                  h.isActive && (p = (0, r.pi)((0, r.pi)({}, p), T)),
                  i && t.blockInitialAnimation && (P = !1),
                  P &&
                    !b &&
                    d.push.apply(
                      d,
                      (0, r.ev)(
                        [],
                        (0, r.CR)(
                          A.map(function (t) {
                            return {
                              animation: t,
                              options: (0, r.pi)({type: o}, u),
                            }
                          }),
                        ),
                      ),
                    )
              },
              y = 0;
            y < Ar;
            y++
          )
            h(y)
          if (((o = (0, r.pi)({}, p)), v.size)) {
            var g = {}
            v.forEach(function (n) {
              var e = t.getBaseTarget(n)
              void 0 !== e && (g[n] = e)
            }),
              d.push({animation: g})
          }
          var x = Boolean(d.length)
          return (
            i && !1 === l.initial && !t.manuallyAnimateOnMount && (x = !1),
            (i = !1),
            x ? n(d) : Promise.resolve()
          )
        }
        return {
          isAnimated: function (t) {
            return void 0 !== o[t]
          },
          animateChanges: u,
          setActive: function (n, r, o) {
            var i
            return e[n].isActive === r
              ? Promise.resolve()
              : (null === (i = t.variantChildren) ||
                  void 0 === i ||
                  i.forEach(function (t) {
                    var e
                    return null === (e = t.animationState) || void 0 === e
                      ? void 0
                      : e.setActive(n, r)
                  }),
                (e[n].isActive = r),
                u(o, n))
          },
          setAnimateFunction: function (e) {
            n = e(t)
          },
          getState: function () {
            return e
          },
        }
      }
      function wr(t) {
        return (
          void 0 === t && (t = !1),
          {
            isActive: t,
            protectedKeys: {},
            needsAnimating: {},
            prevResolvedValues: {},
          }
        )
      }
      var Cr = {
          animation: yn(function (t) {
            var n = t.visualElement,
              e = t.animate
            n.animationState || (n.animationState = Er(n)),
              Ft(e) &&
                (0, o.useEffect)(
                  function () {
                    return e.subscribe(n)
                  },
                  [e],
                )
          }),
          exit: yn(function (t) {
            var n = t.custom,
              e = t.visualElement,
              i = (0, r.CR)(p(), 2),
              a = i[0],
              u = i[1],
              s = (0, o.useContext)(d)
            ;(0, o.useEffect)(
              function () {
                var t,
                  r,
                  o =
                    null === (t = e.animationState) || void 0 === t
                      ? void 0
                      : t.setActive(zt.Exit, !a, {
                          custom:
                            null !==
                              (r =
                                null === s || void 0 === s
                                  ? void 0
                                  : s.custom) && void 0 !== r
                              ? r
                              : n,
                        })
                !a && (null === o || void 0 === o || o.then(u))
              },
              [a],
            )
          }),
        },
        Sr = function (t) {
          return t.hasOwnProperty('x') && t.hasOwnProperty('y')
        },
        Lr = function (t) {
          return Sr(t) && t.hasOwnProperty('z')
        },
        Rr = function (t, n) {
          return Math.abs(t - n)
        }
      function Mr(t, n) {
        if (Gn(t) && Gn(n)) return Rr(t, n)
        if (Sr(t) && Sr(n)) {
          var e = Rr(t.x, n.x),
            r = Rr(t.y, n.y),
            o = Lr(t) && Lr(n) ? Rr(t.z, n.z) : 0
          return Math.sqrt(Math.pow(e, 2) + Math.pow(r, 2) + Math.pow(o, 2))
        }
      }
      var kr = (function () {
        function t(t, n, e) {
          var o = this,
            i = (void 0 === e ? {} : e).transformPagePoint
          if (
            ((this.startEvent = null),
            (this.lastMoveEvent = null),
            (this.lastMoveEventInfo = null),
            (this.handlers = {}),
            (this.updatePoint = function () {
              if (o.lastMoveEvent && o.lastMoveEventInfo) {
                var t = jr(o.lastMoveEventInfo, o.history),
                  n = null !== o.startEvent,
                  e = Mr(t.offset, {x: 0, y: 0}) >= 3
                if (n || e) {
                  var i = t.point,
                    a = (0, Ce.$B)().timestamp
                  o.history.push((0, r.pi)((0, r.pi)({}, i), {timestamp: a}))
                  var u = o.handlers,
                    s = u.onStart,
                    c = u.onMove
                  n ||
                    (s && s(o.lastMoveEvent, t),
                    (o.startEvent = o.lastMoveEvent)),
                    c && c(o.lastMoveEvent, t)
                }
              }
            }),
            (this.handlePointerMove = function (t, n) {
              ;(o.lastMoveEvent = t),
                (o.lastMoveEventInfo = Vr(n, o.transformPagePoint)),
                qt(t) && 0 === t.buttons
                  ? o.handlePointerUp(t, n)
                  : Ce.ZP.update(o.updatePoint, !0)
            }),
            (this.handlePointerUp = function (t, n) {
              o.end()
              var e = o.handlers,
                r = e.onEnd,
                i = e.onSessionEnd,
                a = jr(Vr(n, o.transformPagePoint), o.history)
              o.startEvent && r && r(t, a), i && i(t, a)
            }),
            !(Kt(t) && t.touches.length > 1))
          ) {
            ;(this.handlers = n), (this.transformPagePoint = i)
            var a = Vr(Qt(t), this.transformPagePoint),
              u = a.point,
              s = (0, Ce.$B)().timestamp
            this.history = [(0, r.pi)((0, r.pi)({}, u), {timestamp: s})]
            var c = n.onSessionStart
            c && c(t, jr(a, this.history)),
              (this.removeListeners = hn(
                on(window, 'pointermove', this.handlePointerMove),
                on(window, 'pointerup', this.handlePointerUp),
                on(window, 'pointercancel', this.handlePointerUp),
              ))
          }
        }
        return (
          (t.prototype.updateHandlers = function (t) {
            this.handlers = t
          }),
          (t.prototype.end = function () {
            this.removeListeners && this.removeListeners(),
              Ce.qY.update(this.updatePoint)
          }),
          t
        )
      })()
      function Vr(t, n) {
        return n ? {point: n(t.point)} : t
      }
      function Dr(t, n) {
        return {x: t.x - n.x, y: t.y - n.y}
      }
      function jr(t, n) {
        var e = t.point
        return {
          point: e,
          delta: Dr(e, Or(n)),
          offset: Dr(e, Br(n)),
          velocity: Fr(n, 0.1),
        }
      }
      function Br(t) {
        return t[0]
      }
      function Or(t) {
        return t[t.length - 1]
      }
      function Fr(t, n) {
        if (t.length < 2) return {x: 0, y: 0}
        for (
          var e = t.length - 1, r = null, o = Or(t);
          e >= 0 && ((r = t[e]), !(o.timestamp - r.timestamp > ke(n)));

        )
          e--
        if (!r) return {x: 0, y: 0}
        var i = (o.timestamp - r.timestamp) / 1e3
        if (0 === i) return {x: 0, y: 0}
        var a = {x: (o.x - r.x) / i, y: (o.y - r.y) / i}
        return a.x === 1 / 0 && (a.x = 0), a.y === 1 / 0 && (a.y = 0), a
      }
      function Ur(t) {
        return t
      }
      function Ir(t) {
        var n = t.top
        return {x: {min: t.left, max: t.right}, y: {min: n, max: t.bottom}}
      }
      var Hr = {translate: 0, scale: 1, origin: 0, originPoint: 0}
      function _r() {
        return {x: (0, r.pi)({}, Hr), y: (0, r.pi)({}, Hr)}
      }
      function Yr(t) {
        return [t('x'), t('y')]
      }
      function Nr(t, n, e) {
        var r = n.min,
          o = n.max
        return (
          void 0 !== r && t < r
            ? (t = e ? Mn(r, t, e.min) : Math.max(t, r))
            : void 0 !== o &&
              t > o &&
              (t = e ? Mn(o, t, e.max) : Math.min(t, o)),
          t
        )
      }
      function zr(t, n, e) {
        return {
          min: void 0 !== n ? t.min + n : void 0,
          max: void 0 !== e ? t.max + e - (t.max - t.min) : void 0,
        }
      }
      function Xr(t, n) {
        var e,
          o = n.min - t.min,
          i = n.max - t.max
        return (
          n.max - n.min < t.max - t.min &&
            ((o = (e = (0, r.CR)([i, o], 2))[0]), (i = e[1])),
          {min: t.min + o, max: t.min + i}
        )
      }
      function Wr(t, n, e) {
        return {min: Zr(t, n), max: Zr(t, e)}
      }
      function Zr(t, n) {
        var e
        return 'number' === typeof t
          ? t
          : null !== (e = t[n]) && void 0 !== e
          ? e
          : 0
      }
      function qr(t, n) {
        return Ir(
          (function (t, n) {
            var e = t.top,
              r = t.left,
              o = t.bottom,
              i = t.right
            void 0 === n && (n = Ur)
            var a = n({x: r, y: e}),
              u = n({x: i, y: o})
            return {top: a.y, left: a.x, bottom: u.y, right: u.x}
          })(t.getBoundingClientRect(), n),
        )
      }
      function Kr(t, n, e) {
        return void 0 === n && (n = 0), void 0 === e && (e = 0.01), Mr(t, n) < e
      }
      function $r(t) {
        return t.max - t.min
      }
      function Gr(t, n) {
        var e = 0.5,
          r = $r(t),
          o = $r(n)
        return (
          o > r
            ? (e = Rn(n.min, n.max - r, t.min))
            : r > o && (e = Rn(t.min, t.max - o, n.min)),
          bn(0, 1, e)
        )
      }
      function Jr(t, n, e, r) {
        void 0 === r && (r = 0.5),
          (t.origin = r),
          (t.originPoint = Mn(n.min, n.max, t.origin)),
          (t.scale = $r(e) / $r(n)),
          Kr(t.scale, 1, 1e-4) && (t.scale = 1),
          (t.translate = Mn(e.min, e.max, t.origin) - t.originPoint),
          Kr(t.translate) && (t.translate = 0)
      }
      function Qr(t, n, e, r) {
        Jr(t.x, n.x, e.x, to(r.originX)), Jr(t.y, n.y, e.y, to(r.originY))
      }
      function to(t) {
        return 'number' === typeof t ? t : 0.5
      }
      function no(t, n, e) {
        ;(t.min = e.min + n.min), (t.max = t.min + $r(n))
      }
      var eo = function (t, n) {
        return t.depth - n.depth
      }
      function ro(t) {
        return t.projection.isEnabled || t.shouldResetTransform()
      }
      function oo(t, n) {
        void 0 === n && (n = [])
        var e = t.parent
        return e && oo(e, n), ro(t) && n.push(t), n
      }
      function io(t) {
        if (!t.shouldResetTransform()) {
          var n,
            e = t.getLayoutState()
          t.notifyBeforeLayoutMeasure(e.layout),
            (e.isHydrated = !0),
            (e.layout = t.measureViewportBox()),
            (e.layoutCorrected =
              ((n = e.layout), {x: (0, r.pi)({}, n.x), y: (0, r.pi)({}, n.y)})),
            t.notifyLayoutMeasure(e.layout, t.prevViewportBox || e.layout),
            Ce.ZP.update(function () {
              return t.rebaseProjectionTarget()
            })
        }
      }
      function ao(t, n) {
        return {min: n.min - t.min, max: n.max - t.min}
      }
      function uo(t, n) {
        return {x: ao(t.x, n.x), y: ao(t.y, n.y)}
      }
      function so(t, n) {
        var e = t.getLayoutId(),
          r = n.getLayoutId()
        return e !== r || (void 0 === r && t !== n)
      }
      function co(t) {
        var n = t.getProps(),
          e = n.drag,
          r = n._dragX
        return e && !r
      }
      function lo(t, n) {
        ;(t.min = n.min), (t.max = n.max)
      }
      function fo(t, n, e) {
        return e + n * (t - e)
      }
      function vo(t, n, e, r, o) {
        return void 0 !== o && (t = fo(t, o, r)), fo(t, e, r) + n
      }
      function po(t, n, e, r, o) {
        void 0 === n && (n = 0),
          void 0 === e && (e = 1),
          (t.min = vo(t.min, n, e, r, o)),
          (t.max = vo(t.max, n, e, r, o))
      }
      function mo(t, n) {
        var e = n.x,
          r = n.y
        po(t.x, e.translate, e.scale, e.originPoint),
          po(t.y, r.translate, r.scale, r.originPoint)
      }
      function ho(t, n, e, o) {
        var i = (0, r.CR)(o, 3),
          a = i[0],
          u = i[1],
          s = i[2]
        ;(t.min = n.min), (t.max = n.max)
        var c = void 0 !== e[s] ? e[s] : 0.5,
          l = Mn(n.min, n.max, c)
        po(t, e[a], e[u], l, e.scale)
      }
      var yo = ['x', 'scaleX', 'originX'],
        go = ['y', 'scaleY', 'originY']
      function xo(t, n, e) {
        ho(t.x, n.x, e, yo), ho(t.y, n.y, e, go)
      }
      function bo(t, n, e, r, o) {
        return (
          (t = fo((t -= n), 1 / e, r)), void 0 !== o && (t = fo(t, 1 / o, r)), t
        )
      }
      function Po(t, n, e) {
        var o = (0, r.CR)(e, 3),
          i = o[0],
          a = o[1],
          u = o[2]
        !(function (t, n, e, r, o) {
          void 0 === n && (n = 0),
            void 0 === e && (e = 1),
            void 0 === r && (r = 0.5)
          var i = Mn(t.min, t.max, r) - n
          ;(t.min = bo(t.min, n, e, i, o)), (t.max = bo(t.max, n, e, i, o))
        })(t, n[i], n[a], n[u], n.scale)
      }
      function Ao(t, n) {
        Po(t.x, n, yo), Po(t.y, n, go)
      }
      var To = new Set()
      function Eo(t, n, e) {
        t[e] || (t[e] = []), t[e].push(n)
      }
      function wo(t) {
        return (
          To.add(t),
          function () {
            return To.delete(t)
          }
        )
      }
      function Co() {
        if (To.size) {
          var t = 0,
            n = [[]],
            e = [],
            r = function (e) {
              return Eo(n, e, t)
            },
            o = function (n) {
              Eo(e, n, t), t++
            }
          To.forEach(function (n) {
            n(r, o), (t = 0)
          }),
            To.clear()
          for (var i = e.length, a = 0; a <= i; a++)
            n[a] && n[a].forEach(Lo), e[a] && e[a].forEach(Lo)
        }
      }
      var So,
        Lo = function (t) {
          return t()
        },
        Ro = new WeakMap(),
        Mo = (function () {
          function t(t) {
            var n = t.visualElement
            ;(this.isDragging = !1),
              (this.currentDirection = null),
              (this.constraints = !1),
              (this.elastic = {x: {min: 0, max: 1}, y: {min: 0, max: 1}}),
              (this.props = {}),
              (this.hasMutatedConstraints = !1),
              (this.cursorProgress = {x: 0.5, y: 0.5}),
              (this.originPoint = {}),
              (this.openGlobalLock = null),
              (this.panSession = null),
              (this.visualElement = n),
              this.visualElement.enableLayoutProjection(),
              Ro.set(n, this)
          }
          return (
            (t.prototype.start = function (t, n) {
              var e = this,
                o = void 0 === n ? {} : n,
                i = o.snapToCursor,
                a = void 0 !== i && i,
                u = o.cursorProgress,
                s = this.props.transformPagePoint
              this.panSession = new kr(
                t,
                {
                  onSessionStart: function (t) {
                    var n
                    e.stopMotion()
                    var o = (function (t) {
                      return Qt(t, 'client')
                    })(t).point
                    null === (n = e.cancelLayout) || void 0 === n || n.call(e),
                      (e.cancelLayout = wo(function (t, n) {
                        var i = oo(e.visualElement),
                          s = (function (t) {
                            var n = [],
                              e = function (t) {
                                ro(t) && n.push(t), t.children.forEach(e)
                              }
                            return t.children.forEach(e), n.sort(eo)
                          })(e.visualElement),
                          c = (0, r.ev)(
                            (0, r.ev)([], (0, r.CR)(i)),
                            (0, r.CR)(s),
                          ),
                          l = !1
                        e.isLayoutDrag() &&
                          e.visualElement.lockProjectionTarget(),
                          n(function () {
                            c.forEach(function (t) {
                              return t.resetTransform()
                            })
                          }),
                          t(function () {
                            io(e.visualElement), s.forEach(io)
                          }),
                          n(function () {
                            c.forEach(function (t) {
                              return t.restoreTransform()
                            }),
                              a && (l = e.snapToCursor(o))
                          }),
                          t(function () {
                            Boolean(
                              e.getAxisMotionValue('x') && !e.isExternalDrag(),
                            ) ||
                              e.visualElement.rebaseProjectionTarget(
                                !0,
                                e.visualElement.measureViewportBox(!1),
                              ),
                              e.visualElement.scheduleUpdateLayoutProjection()
                            var t = e.visualElement.projection
                            Yr(function (n) {
                              if (!l) {
                                var r = t.target[n],
                                  i = r.min,
                                  a = r.max
                                e.cursorProgress[n] = u ? u[n] : Rn(i, a, o[n])
                              }
                              var s = e.getAxisMotionValue(n)
                              s && (e.originPoint[n] = s.get())
                            })
                          }),
                          n(function () {
                            Ce.iW.update(),
                              Ce.iW.preRender(),
                              Ce.iW.render(),
                              Ce.iW.postRender()
                          }),
                          t(function () {
                            return e.resolveDragConstraints()
                          })
                      }))
                  },
                  onStart: function (t, n) {
                    var r,
                      o,
                      i,
                      a = e.props,
                      u = a.drag,
                      s = a.dragPropagation
                    ;(!u ||
                      s ||
                      (e.openGlobalLock && e.openGlobalLock(),
                      (e.openGlobalLock = ln(u)),
                      e.openGlobalLock)) &&
                      (Co(),
                      (e.isDragging = !0),
                      (e.currentDirection = null),
                      null === (o = (r = e.props).onDragStart) ||
                        void 0 === o ||
                        o.call(r, t, n),
                      null === (i = e.visualElement.animationState) ||
                        void 0 === i ||
                        i.setActive(zt.Drag, !0))
                  },
                  onMove: function (t, n) {
                    var r,
                      o,
                      i,
                      a,
                      u = e.props,
                      s = u.dragPropagation,
                      c = u.dragDirectionLock
                    if (s || e.openGlobalLock) {
                      var l = n.offset
                      if (c && null === e.currentDirection)
                        return (
                          (e.currentDirection = (function (t, n) {
                            void 0 === n && (n = 10)
                            var e = null
                            Math.abs(t.y) > n
                              ? (e = 'y')
                              : Math.abs(t.x) > n && (e = 'x')
                            return e
                          })(l)),
                          void (
                            null !== e.currentDirection &&
                            (null === (o = (r = e.props).onDirectionLock) ||
                              void 0 === o ||
                              o.call(r, e.currentDirection))
                          )
                        )
                      e.updateAxis('x', n.point, l),
                        e.updateAxis('y', n.point, l),
                        null === (a = (i = e.props).onDrag) ||
                          void 0 === a ||
                          a.call(i, t, n),
                        (So = t)
                    }
                  },
                  onSessionEnd: function (t, n) {
                    return e.stop(t, n)
                  },
                },
                {transformPagePoint: s},
              )
            }),
            (t.prototype.resolveDragConstraints = function () {
              var t = this,
                n = this.props,
                e = n.dragConstraints,
                r = n.dragElastic,
                o = this.visualElement.getLayoutState().layoutCorrected
              ;(this.constraints =
                !!e &&
                (T(e)
                  ? this.resolveRefConstraints(o, e)
                  : (function (t, n) {
                      var e = n.top,
                        r = n.left,
                        o = n.bottom,
                        i = n.right
                      return {x: zr(t.x, r, i), y: zr(t.y, e, o)}
                    })(o, e))),
                (this.elastic = (function (t) {
                  return (
                    !1 === t ? (t = 0) : !0 === t && (t = 0.35),
                    {x: Wr(t, 'left', 'right'), y: Wr(t, 'top', 'bottom')}
                  )
                })(r)),
                this.constraints &&
                  !this.hasMutatedConstraints &&
                  Yr(function (n) {
                    t.getAxisMotionValue(n) &&
                      (t.constraints[n] = (function (t, n) {
                        var e = {}
                        return (
                          void 0 !== n.min && (e.min = n.min - t.min),
                          void 0 !== n.max && (e.max = n.max - t.min),
                          e
                        )
                      })(o[n], t.constraints[n]))
                  })
            }),
            (t.prototype.resolveRefConstraints = function (t, n) {
              var e = this.props,
                r = e.onMeasureDragConstraints,
                o = e.transformPagePoint,
                i = n.current
              this.constraintsBox = qr(i, o)
              var a = (function (t, n) {
                return {x: Xr(t.x, n.x), y: Xr(t.y, n.y)}
              })(t, this.constraintsBox)
              if (r) {
                var u = r(
                  (function (t) {
                    var n = t.x,
                      e = t.y
                    return {
                      top: e.min,
                      bottom: e.max,
                      left: n.min,
                      right: n.max,
                    }
                  })(a),
                )
                ;(this.hasMutatedConstraints = !!u), u && (a = Ir(u))
              }
              return a
            }),
            (t.prototype.cancelDrag = function () {
              var t, n
              this.visualElement.unlockProjectionTarget(),
                null === (t = this.cancelLayout) ||
                  void 0 === t ||
                  t.call(this),
                (this.isDragging = !1),
                this.panSession && this.panSession.end(),
                (this.panSession = null),
                !this.props.dragPropagation &&
                  this.openGlobalLock &&
                  (this.openGlobalLock(), (this.openGlobalLock = null)),
                null === (n = this.visualElement.animationState) ||
                  void 0 === n ||
                  n.setActive(zt.Drag, !1)
            }),
            (t.prototype.stop = function (t, n) {
              var e, r, o
              null === (e = this.panSession) || void 0 === e || e.end(),
                (this.panSession = null)
              var i = this.isDragging
              if ((this.cancelDrag(), i)) {
                var a = n.velocity
                this.animateDragEnd(a),
                  null === (o = (r = this.props).onDragEnd) ||
                    void 0 === o ||
                    o.call(r, t, n)
              }
            }),
            (t.prototype.snapToCursor = function (t) {
              var n = this
              return Yr(function (e) {
                if (ko(e, n.props.drag, n.currentDirection)) {
                  var r = n.getAxisMotionValue(e)
                  if (!r) return (n.cursorProgress[e] = 0.5), !0
                  var o = n.visualElement.getLayoutState().layout,
                    i = o[e].max - o[e].min,
                    a = o[e].min + i / 2,
                    u = t[e] - a
                  ;(n.originPoint[e] = t[e]), r.set(u)
                }
              }).includes(!0)
            }),
            (t.prototype.updateAxis = function (t, n, e) {
              if (ko(t, this.props.drag, this.currentDirection))
                return this.getAxisMotionValue(t)
                  ? this.updateAxisMotionValue(t, e)
                  : this.updateVisualElementAxis(t, n)
            }),
            (t.prototype.updateAxisMotionValue = function (t, n) {
              var e = this.getAxisMotionValue(t)
              if (n && e) {
                var r = this.originPoint[t] + n[t],
                  o = this.constraints
                    ? Nr(r, this.constraints[t], this.elastic[t])
                    : r
                e.set(o)
              }
            }),
            (t.prototype.updateVisualElementAxis = function (t, n) {
              var e,
                r = this.visualElement.getLayoutState().layout[t],
                o = r.max - r.min,
                i = this.cursorProgress[t],
                a = (function (t, n, e, r, o) {
                  var i = t - n * e
                  return r ? Nr(i, r, o) : i
                })(
                  n[t],
                  o,
                  i,
                  null === (e = this.constraints) || void 0 === e
                    ? void 0
                    : e[t],
                  this.elastic[t],
                )
              this.visualElement.setProjectionTargetAxis(t, a, a + o)
            }),
            (t.prototype.setProps = function (t) {
              var n = t.drag,
                e = void 0 !== n && n,
                o = t.dragDirectionLock,
                i = void 0 !== o && o,
                a = t.dragPropagation,
                u = void 0 !== a && a,
                s = t.dragConstraints,
                c = void 0 !== s && s,
                l = t.dragElastic,
                f = void 0 === l ? 0.35 : l,
                d = t.dragMomentum,
                v = void 0 === d || d,
                p = (0, r._T)(t, [
                  'drag',
                  'dragDirectionLock',
                  'dragPropagation',
                  'dragConstraints',
                  'dragElastic',
                  'dragMomentum',
                ])
              this.props = (0, r.pi)(
                {
                  drag: e,
                  dragDirectionLock: i,
                  dragPropagation: u,
                  dragConstraints: c,
                  dragElastic: f,
                  dragMomentum: v,
                },
                p,
              )
            }),
            (t.prototype.getAxisMotionValue = function (t) {
              var n = this.props,
                e = n.layout,
                r = n.layoutId,
                o = '_drag' + t.toUpperCase()
              return this.props[o]
                ? this.props[o]
                : e || void 0 !== r
                ? void 0
                : this.visualElement.getValue(t, 0)
            }),
            (t.prototype.isLayoutDrag = function () {
              return !this.getAxisMotionValue('x')
            }),
            (t.prototype.isExternalDrag = function () {
              var t = this.props,
                n = t._dragX,
                e = t._dragY
              return n || e
            }),
            (t.prototype.animateDragEnd = function (t) {
              var n = this,
                e = this.props,
                o = e.drag,
                i = e.dragMomentum,
                a = e.dragElastic,
                u = e.dragTransition,
                s = (function (t, n) {
                  void 0 === n && (n = !0)
                  var e,
                    r = t.getProjectionParent()
                  return (
                    !!r &&
                    (n
                      ? Ao(
                          (e = uo(r.projection.target, t.projection.target)),
                          r.getLatestValues(),
                        )
                      : (e = uo(
                          r.getLayoutState().layout,
                          t.getLayoutState().layout,
                        )),
                    Yr(function (n) {
                      return t.setProjectionTargetAxis(
                        n,
                        e[n].min,
                        e[n].max,
                        !0,
                      )
                    }),
                    !0)
                  )
                })(
                  this.visualElement,
                  this.isLayoutDrag() && !this.isExternalDrag(),
                ),
                c = this.constraints || {}
              if (s && Object.keys(c).length && this.isLayoutDrag()) {
                var l = this.visualElement.getProjectionParent()
                if (l) {
                  var f = uo(l.projection.targetFinal, c)
                  Yr(function (t) {
                    var n = f[t],
                      e = n.min,
                      r = n.max
                    c[t] = {
                      min: isNaN(e) ? void 0 : e,
                      max: isNaN(r) ? void 0 : r,
                    }
                  })
                }
              }
              var d = Yr(function (e) {
                var l
                if (ko(e, o, n.currentDirection)) {
                  var f =
                      null !==
                        (l = null === c || void 0 === c ? void 0 : c[e]) &&
                      void 0 !== l
                        ? l
                        : {},
                    d = a ? 200 : 1e6,
                    v = a ? 40 : 1e7,
                    p = (0, r.pi)(
                      (0, r.pi)(
                        {
                          type: 'inertia',
                          velocity: i ? t[e] : 0,
                          bounceStiffness: d,
                          bounceDamping: v,
                          timeConstant: 750,
                          restDelta: 1,
                          restSpeed: 10,
                        },
                        u,
                      ),
                      f,
                    )
                  return n.getAxisMotionValue(e)
                    ? n.startAxisValueAnimation(e, p)
                    : n.visualElement.startLayoutAnimation(e, p, s)
                }
              })
              return Promise.all(d).then(function () {
                var t, e
                null === (e = (t = n.props).onDragTransitionEnd) ||
                  void 0 === e ||
                  e.call(t)
              })
            }),
            (t.prototype.stopMotion = function () {
              var t = this
              Yr(function (n) {
                var e = t.getAxisMotionValue(n)
                e ? e.stop() : t.visualElement.stopLayoutAnimation()
              })
            }),
            (t.prototype.startAxisValueAnimation = function (t, n) {
              var e = this.getAxisMotionValue(t)
              if (e) {
                var r = e.get()
                return e.set(r), e.set(r), ar(t, e, 0, n)
              }
            }),
            (t.prototype.scalePoint = function () {
              var t = this,
                n = this.props,
                e = n.drag
              if (T(n.dragConstraints) && this.constraintsBox) {
                this.stopMotion()
                var r = {x: 0, y: 0}
                Yr(function (n) {
                  r[n] = Gr(
                    t.visualElement.projection.target[n],
                    t.constraintsBox[n],
                  )
                }),
                  this.updateConstraints(function () {
                    Yr(function (n) {
                      if (ko(n, e, null)) {
                        var o = (function (t, n, e) {
                            var r = t.max - t.min,
                              o = Mn(n.min, n.max - r, e)
                            return {min: o, max: o + r}
                          })(
                            t.visualElement.projection.target[n],
                            t.constraintsBox[n],
                            r[n],
                          ),
                          i = o.min,
                          a = o.max
                        t.visualElement.setProjectionTargetAxis(n, i, a)
                      }
                    })
                  }),
                  setTimeout(Co, 1)
              }
            }),
            (t.prototype.updateConstraints = function (t) {
              var n = this
              this.cancelLayout = wo(function (e, r) {
                var o = oo(n.visualElement)
                r(function () {
                  return o.forEach(function (t) {
                    return t.resetTransform()
                  })
                }),
                  e(function () {
                    return io(n.visualElement)
                  }),
                  r(function () {
                    return o.forEach(function (t) {
                      return t.restoreTransform()
                    })
                  }),
                  e(function () {
                    n.resolveDragConstraints()
                  }),
                  t && r(t)
              })
            }),
            (t.prototype.mount = function (t) {
              var n = this,
                e = on(t.getInstance(), 'pointerdown', function (t) {
                  var e = n.props,
                    r = e.drag,
                    o = e.dragListener
                  r && (void 0 === o || o) && n.start(t)
                }),
                r = Wt(window, 'resize', function () {
                  n.scalePoint()
                }),
                o = t.onLayoutUpdate(function () {
                  n.isDragging && n.resolveDragConstraints()
                }),
                i = t.prevDragCursor
              return (
                i && this.start(So, {cursorProgress: i}),
                function () {
                  null === e || void 0 === e || e(),
                    null === r || void 0 === r || r(),
                    null === o || void 0 === o || o(),
                    n.cancelDrag()
                }
              )
            }),
            t
          )
        })()
      function ko(t, n, e) {
        return (!0 === n || n === t) && (null === e || e === t)
      }
      var Vo,
        Do,
        jo = {
          pan: yn(function (t) {
            var n = t.onPan,
              e = t.onPanStart,
              r = t.onPanEnd,
              i = t.onPanSessionStart,
              a = t.visualElement,
              u = n || e || r || i,
              s = (0, o.useRef)(null),
              c = (0, o.useContext)(l).transformPagePoint,
              f = {
                onSessionStart: i,
                onStart: e,
                onMove: n,
                onEnd: function (t, n) {
                  ;(s.current = null), r && r(t, n)
                },
              }
            ;(0, o.useEffect)(function () {
              null !== s.current && s.current.updateHandlers(f)
            }),
              an(
                a,
                'pointerdown',
                u &&
                  function (t) {
                    s.current = new kr(t, f, {transformPagePoint: c})
                  },
              ),
              pn(function () {
                return s.current && s.current.end()
              })
          }),
          drag: yn(function (t) {
            var n = t.dragControls,
              e = t.visualElement,
              i = (0, o.useContext)(l).transformPagePoint,
              a = v(function () {
                return new Mo({visualElement: e})
              })
            a.setProps((0, r.pi)((0, r.pi)({}, t), {transformPagePoint: i})),
              (0, o.useEffect)(
                function () {
                  return n && n.subscribe(a)
                },
                [a],
              ),
              (0, o.useEffect)(function () {
                return a.mount(e)
              }, [])
          }),
        }
      function Bo(t) {
        return 'string' === typeof t && t.startsWith('var(--')
      }
      !(function (t) {
        ;(t[(t.Entering = 0)] = 'Entering'),
          (t[(t.Present = 1)] = 'Present'),
          (t[(t.Exiting = 2)] = 'Exiting')
      })(Vo || (Vo = {})),
        (function (t) {
          ;(t[(t.Hide = 0)] = 'Hide'), (t[(t.Show = 1)] = 'Show')
        })(Do || (Do = {}))
      var Oo = /var\((--[a-zA-Z0-9-_]+),? ?([a-zA-Z0-9 ()%#.,-]+)?\)/
      function Fo(t, n, e) {
        void 0 === e && (e = 1)
        var o = (0, r.CR)(
            (function (t) {
              var n = Oo.exec(t)
              if (!n) return [,]
              var e = (0, r.CR)(n, 3)
              return [e[1], e[2]]
            })(t),
            2,
          ),
          i = o[0],
          a = o[1]
        if (i) {
          var u = window.getComputedStyle(n).getPropertyValue(i)
          return u ? u.trim() : Bo(a) ? Fo(a, n, e + 1) : a
        }
      }
      function Uo(t, n) {
        return (t / (n.max - n.min)) * 100
      }
      var Io = '_$css'
      var Ho = {
          process: function (t, n, e) {
            var r = e.target
            if ('string' === typeof t) {
              if (!ot.test(t)) return t
              t = parseFloat(t)
            }
            return Uo(t, r.x) + '% ' + Uo(t, r.y) + '%'
          },
        },
        _o = {
          borderRadius: (0, r.pi)((0, r.pi)({}, Ho), {
            applyTo: [
              'borderTopLeftRadius',
              'borderTopRightRadius',
              'borderBottomLeftRadius',
              'borderBottomRightRadius',
            ],
          }),
          borderTopLeftRadius: Ho,
          borderTopRightRadius: Ho,
          borderBottomLeftRadius: Ho,
          borderBottomRightRadius: Ho,
          boxShadow: {
            process: function (t, n) {
              var e = n.delta,
                r = n.treeScale,
                o = t,
                i = t.includes('var('),
                a = []
              i &&
                (t = t.replace(Oo, function (t) {
                  return a.push(t), Io
                }))
              var u = $n.parse(t)
              if (u.length > 5) return o
              var s = $n.createTransformer(t),
                c = 'number' !== typeof u[0] ? 1 : 0,
                l = e.x.scale * r.x,
                f = e.y.scale * r.y
              ;(u[0 + c] /= l), (u[1 + c] /= f)
              var d = Mn(l, f, 0.5)
              'number' === typeof u[2 + c] && (u[2 + c] /= d),
                'number' === typeof u[3 + c] && (u[3 + c] /= d)
              var v = s(u)
              if (i) {
                var p = 0
                v = v.replace(Io, function () {
                  var t = a[p]
                  return p++, t
                })
              }
              return v
            },
          },
        },
        Yo = (function (t) {
          function n() {
            var n = (null !== t && t.apply(this, arguments)) || this
            return (
              (n.frameTarget = {x: {min: 0, max: 1}, y: {min: 0, max: 1}}),
              (n.currentAnimationTarget = {
                x: {min: 0, max: 1},
                y: {min: 0, max: 1},
              }),
              (n.isAnimating = {x: !1, y: !1}),
              (n.stopAxisAnimation = {x: void 0, y: void 0}),
              (n.isAnimatingTree = !1),
              (n.animate = function (t, e, o) {
                void 0 === o && (o = {})
                var i = o.originBox,
                  a = o.targetBox,
                  u = o.visibilityAction,
                  s = o.shouldStackAnimate,
                  c = o.onComplete,
                  l = o.prevParent,
                  f = (0, r._T)(o, [
                    'originBox',
                    'targetBox',
                    'visibilityAction',
                    'shouldStackAnimate',
                    'onComplete',
                    'prevParent',
                  ]),
                  d = n.props,
                  v = d.visualElement,
                  p = d.layout
                if (!1 === s) return (n.isAnimatingTree = !1), n.safeToRemove()
                if (!n.isAnimatingTree || !0 === s) {
                  s && (n.isAnimatingTree = !0), (e = i || e), (t = a || t)
                  var m = !1,
                    h = v.getProjectionParent()
                  if (h) {
                    var y = h.prevViewportBox,
                      g = h.getLayoutState().layout
                    l &&
                      (a && (g = l.getLayoutState().layout),
                      i &&
                        !so(l, h) &&
                        l.prevViewportBox &&
                        (y = l.prevViewportBox)),
                      y &&
                        qo(l, i, a) &&
                        ((m = !0), (e = uo(y, e)), (t = uo(g, t)))
                  }
                  var x = No(e, t),
                    b = Yr(function (o) {
                      var i, a
                      if ('position' === p) {
                        var s = t[o].max - t[o].min
                        e[o].max = e[o].min + s
                      }
                      if (!v.projection.isTargetLocked)
                        return void 0 === u
                          ? x
                            ? n.animateAxis(
                                o,
                                t[o],
                                e[o],
                                (0, r.pi)((0, r.pi)({}, f), {isRelative: m}),
                              )
                            : (null === (a = (i = n.stopAxisAnimation)[o]) ||
                                void 0 === a ||
                                a.call(i),
                              v.setProjectionTargetAxis(
                                o,
                                t[o].min,
                                t[o].max,
                                m,
                              ))
                          : void v.setVisibility(u === Do.Show)
                    })
                  return (
                    v.syncRender(),
                    Promise.all(b).then(function () {
                      ;(n.isAnimatingTree = !1),
                        c && c(),
                        v.notifyLayoutAnimationComplete()
                    })
                  )
                }
              }),
              n
            )
          }
          return (
            (0, r.ZT)(n, t),
            (n.prototype.componentDidMount = function () {
              var t = this,
                n = this.props.visualElement
              ;(n.animateMotionValue = ar),
                n.enableLayoutProjection(),
                (this.unsubLayoutReady = n.onLayoutUpdate(this.animate)),
                (n.layoutSafeToRemove = function () {
                  return t.safeToRemove()
                }),
                (function (t) {
                  for (var n in t) O[n] = t[n]
                })(_o)
            }),
            (n.prototype.componentWillUnmount = function () {
              var t = this
              this.unsubLayoutReady(),
                Yr(function (n) {
                  var e, r
                  return null === (r = (e = t.stopAxisAnimation)[n]) ||
                    void 0 === r
                    ? void 0
                    : r.call(e)
                })
            }),
            (n.prototype.animateAxis = function (t, n, e, r) {
              var o,
                i,
                a = this,
                u = void 0 === r ? {} : r,
                s = u.transition,
                c = u.isRelative
              if (
                !this.isAnimating[t] ||
                !Wo(n, this.currentAnimationTarget[t])
              ) {
                null === (i = (o = this.stopAxisAnimation)[t]) ||
                  void 0 === i ||
                  i.call(o),
                  (this.isAnimating[t] = !0)
                var l = this.props.visualElement,
                  f = this.frameTarget[t],
                  d = l.getProjectionAnimationProgress()[t]
                d.clearListeners(), d.set(0), d.set(0)
                var v = function () {
                  var r = d.get() / 1e3
                  !(function (t, n, e, r) {
                    ;(t.min = Mn(n.min, e.min, r)),
                      (t.max = Mn(n.max, e.max, r))
                  })(f, e, n, r),
                    l.setProjectionTargetAxis(t, f.min, f.max, c)
                }
                v()
                var p = d.onChange(v)
                ;(this.stopAxisAnimation[t] = function () {
                  ;(a.isAnimating[t] = !1), d.stop(), p()
                }),
                  (this.currentAnimationTarget[t] = n)
                var m = s || l.getDefaultTransition() || Zo
                return ar(
                  'x' === t ? 'layoutX' : 'layoutY',
                  d,
                  1e3,
                  m && ir(m, 'layout'),
                ).then(this.stopAxisAnimation[t])
              }
            }),
            (n.prototype.safeToRemove = function () {
              var t, n
              null === (n = (t = this.props).safeToRemove) ||
                void 0 === n ||
                n.call(t)
            }),
            (n.prototype.render = function () {
              return null
            }),
            n
          )
        })(o.Component)
      function No(t, n) {
        return !Xo(t) && !Xo(n) && (!Wo(t.x, n.x) || !Wo(t.y, n.y))
      }
      var zo = {min: 0, max: 0}
      function Xo(t) {
        return Wo(t.x, zo) && Wo(t.y, zo)
      }
      function Wo(t, n) {
        return t.min === n.min && t.max === n.max
      }
      var Zo = {duration: 0.45, ease: [0.4, 0, 0.1, 1]}
      function qo(t, n, e) {
        return t || (!t && !(n || e))
      }
      var Ko = {
        layoutReady: function (t) {
          return t.notifyLayoutReady()
        },
      }
      function $o() {
        var t = new Set()
        return {
          add: function (n) {
            return t.add(n)
          },
          flush: function (n) {
            var e = void 0 === n ? Ko : n,
              o = e.layoutReady,
              i = e.parent
            wo(function (n, e) {
              var a = Array.from(t).sort(eo),
                u = i ? oo(i) : []
              e(function () {
                ;(0, r.ev)((0, r.ev)([], (0, r.CR)(u)), (0, r.CR)(a)).forEach(
                  function (t) {
                    return t.resetTransform()
                  },
                )
              }),
                n(function () {
                  a.forEach(io)
                }),
                e(function () {
                  u.forEach(function (t) {
                    return t.restoreTransform()
                  }),
                    a.forEach(o)
                }),
                n(function () {
                  a.forEach(function (t) {
                    t.isPresent && (t.presence = Vo.Present)
                  })
                }),
                e(function () {
                  Ce.iW.preRender(), Ce.iW.render()
                }),
                n(function () {
                  Ce.ZP.postRender(function () {
                    return a.forEach(Go)
                  }),
                    t.clear()
                })
            }),
              Co()
          },
        }
      }
      function Go(t) {
        t.prevViewportBox = t.projection.target
      }
      var Jo = (0, o.createContext)($o()),
        Qo = (0, o.createContext)($o())
      function ti(t) {
        return !!t.forceUpdate
      }
      var ni = (function (t) {
        function n() {
          return (null !== t && t.apply(this, arguments)) || this
        }
        return (
          (0, r.ZT)(n, t),
          (n.prototype.componentDidMount = function () {
            var t = this.props,
              n = t.syncLayout,
              e = t.framerSyncLayout,
              r = t.visualElement
            ti(n) && n.register(r),
              ti(e) && e.register(r),
              r.onUnmount(function () {
                ti(n) && n.remove(r), ti(e) && e.remove(r)
              })
          }),
          (n.prototype.getSnapshotBeforeUpdate = function () {
            var t = this.props,
              n = t.syncLayout,
              e = t.visualElement
            return (
              ti(n)
                ? n.syncUpdate()
                : (!(function (t) {
                    t.shouldResetTransform() ||
                      ((t.prevViewportBox = t.measureViewportBox(!1)),
                      t.rebaseProjectionTarget(!1, t.prevViewportBox))
                  })(e),
                  n.add(e)),
              null
            )
          }),
          (n.prototype.componentDidUpdate = function () {
            var t = this.props.syncLayout
            ti(t) || t.flush()
          }),
          (n.prototype.render = function () {
            return null
          }),
          n
        )
      })(o.Component)
      var ei = {
        measureLayout: function (t) {
          var n = (0, o.useContext)(Jo),
            e = (0, o.useContext)(Qo)
          return o.createElement(
            ni,
            (0, r.pi)({}, t, {syncLayout: n, framerSyncLayout: e}),
          )
        },
        layoutAnimation: function (t) {
          var n = (0, r.CR)(p(), 2)[1]
          return o.createElement(Yo, (0, r.pi)({}, t, {safeToRemove: n}))
        },
      }
      function ri() {
        return {
          isHydrated: !1,
          layout: {x: {min: 0, max: 1}, y: {min: 0, max: 1}},
          layoutCorrected: {x: {min: 0, max: 1}, y: {min: 0, max: 1}},
          treeScale: {x: 1, y: 1},
          delta: _r(),
          deltaFinal: _r(),
          deltaTransform: '',
        }
      }
      var oi = ri()
      function ii(t, n, e) {
        var r = t.x,
          o = t.y,
          i =
            'translate3d(' +
            r.translate / n.x +
            'px, ' +
            o.translate / n.y +
            'px, 0) '
        if (e) {
          var a = e.rotate,
            u = e.rotateX,
            s = e.rotateY
          a && (i += 'rotate(' + a + ') '),
            u && (i += 'rotateX(' + u + ') '),
            s && (i += 'rotateY(' + s + ') ')
        }
        return (
          (i += 'scale(' + r.scale + ', ' + o.scale + ')'),
          e || i !== ui ? i : ''
        )
      }
      function ai(t) {
        var n = t.deltaFinal
        return 100 * n.x.origin + '% ' + 100 * n.y.origin + '% 0'
      }
      var ui = ii(oi.delta, oi.treeScale, {x: 1, y: 1}),
        si = e(71206),
        ci = [
          'LayoutMeasure',
          'BeforeLayoutMeasure',
          'LayoutUpdate',
          'ViewportBoxUpdate',
          'Update',
          'Render',
          'AnimationComplete',
          'LayoutAnimationComplete',
          'AnimationStart',
          'SetAxisTarget',
          'Unmount',
        ]
      function li(t, n, e, r) {
        var o,
          i,
          a = t.delta,
          u = t.layout,
          s = t.layoutCorrected,
          c = t.treeScale,
          l = n.target
        ;(i = u),
          lo((o = s).x, i.x),
          lo(o.y, i.y),
          (function (t, n, e) {
            var r = e.length
            if (r) {
              var o, i
              n.x = n.y = 1
              for (var a = 0; a < r; a++)
                (i = (o = e[a]).getLayoutState().delta),
                  (n.x *= i.x.scale),
                  (n.y *= i.y.scale),
                  mo(t, i),
                  co(o) && xo(t, t, o.getLatestValues())
            }
          })(s, c, e),
          Qr(a, s, l, r)
      }
      var fi = e(70664),
        di = (function () {
          function t() {
            ;(this.children = []), (this.isDirty = !1)
          }
          return (
            (t.prototype.add = function (t) {
              ;(0, fi.y)(this.children, t), (this.isDirty = !0)
            }),
            (t.prototype.remove = function (t) {
              ;(0, fi.c)(this.children, t), (this.isDirty = !0)
            }),
            (t.prototype.forEach = function (t) {
              this.isDirty && this.children.sort(eo),
                (this.isDirty = !1),
                this.children.forEach(t)
            }),
            t
          )
        })()
      var vi = function (t) {
        var n = t.treeType,
          e = void 0 === n ? '' : n,
          o = t.build,
          i = t.getBaseTarget,
          a = t.makeTargetAnimatable,
          u = t.measureViewportBox,
          s = t.render,
          c = t.readValueFromInstance,
          l = t.resetTransform,
          f = t.restoreTransform,
          d = t.removeValueFromRenderState,
          v = t.sortNodePosition,
          p = t.scrapeMotionValuesFromProps
        return function (t, n) {
          var m = t.parent,
            h = t.props,
            y = t.presenceId,
            g = t.blockInitialAnimation,
            x = t.visualState
          void 0 === n && (n = {})
          var b,
            P,
            A,
            T,
            E,
            C,
            S = x.latestValues,
            M = x.renderState,
            k = (function () {
              var t = ci.map(function () {
                  return new si.L()
                }),
                n = {},
                e = {
                  clearAllListeners: function () {
                    return t.forEach(function (t) {
                      return t.clear()
                    })
                  },
                  updatePropListeners: function (t) {
                    return ci.forEach(function (r) {
                      var o
                      null === (o = n[r]) || void 0 === o || o.call(n)
                      var i = 'on' + r,
                        a = t[i]
                      a && (n[r] = e[i](a))
                    })
                  },
                }
              return (
                t.forEach(function (t, n) {
                  ;(e['on' + ci[n]] = function (n) {
                    return t.add(n)
                  }),
                    (e['notify' + ci[n]] = function () {
                      for (var n = [], e = 0; e < arguments.length; e++)
                        n[e] = arguments[e]
                      return t.notify.apply(t, (0, r.ev)([], (0, r.CR)(n)))
                    })
                }),
                e
              )
            })(),
            V = {
              isEnabled: !1,
              isHydrated: !1,
              isTargetLocked: !1,
              target: {x: {min: 0, max: 1}, y: {min: 0, max: 1}},
              targetFinal: {x: {min: 0, max: 1}, y: {min: 0, max: 1}},
            },
            D = V,
            j = S,
            B = ri(),
            O = !1,
            F = new Map(),
            U = new Map(),
            I = {},
            H = (0, r.pi)({}, S)
          function _() {
            b &&
              (G.isProjectionReady() &&
                (xo(D.targetFinal, D.target, j),
                Qr(B.deltaFinal, B.layoutCorrected, D.targetFinal, S)),
              Y(),
              s(b, M))
          }
          function Y() {
            var t = S
            if (T && T.isActive()) {
              var e = T.getCrossfadeState(G)
              e && (t = e)
            }
            o(G, M, t, D, B, n, h)
          }
          function N() {
            k.notifyUpdate(S)
          }
          function z() {
            G.layoutTree.forEach(mi)
          }
          var W = p(h)
          for (var Z in W) {
            var q = W[Z]
            void 0 !== S[Z] && (0, X.i)(q) && q.set(S[Z], !1)
          }
          var K = L(h),
            $ = R(h),
            G = (0, r.pi)(
              (0, r.pi)(
                {
                  treeType: e,
                  current: null,
                  depth: m ? m.depth + 1 : 0,
                  parent: m,
                  children: new Set(),
                  path: m
                    ? (0, r.ev)((0, r.ev)([], (0, r.CR)(m.path)), [m])
                    : [],
                  layoutTree: m ? m.layoutTree : new di(),
                  presenceId: y,
                  projection: V,
                  variantChildren: $ ? new Set() : void 0,
                  isVisible: void 0,
                  manuallyAnimateOnMount: Boolean(
                    null === m || void 0 === m ? void 0 : m.isMounted(),
                  ),
                  blockInitialAnimation: g,
                  isMounted: function () {
                    return Boolean(b)
                  },
                  mount: function (t) {
                    ;(b = G.current = t),
                      G.pointTo(G),
                      $ &&
                        m &&
                        !K &&
                        (C =
                          null === m || void 0 === m
                            ? void 0
                            : m.addVariantChild(G)),
                      null === m || void 0 === m || m.children.add(G)
                  },
                  unmount: function () {
                    Ce.qY.update(N),
                      Ce.qY.render(_),
                      Ce.qY.preRender(G.updateLayoutProjection),
                      U.forEach(function (t) {
                        return t()
                      }),
                      G.stopLayoutAnimation(),
                      G.layoutTree.remove(G),
                      null === C || void 0 === C || C(),
                      null === m || void 0 === m || m.children.delete(G),
                      null === A || void 0 === A || A(),
                      k.clearAllListeners()
                  },
                  addVariantChild: function (t) {
                    var n,
                      e = G.getClosestVariantNode()
                    if (e)
                      return (
                        null === (n = e.variantChildren) ||
                          void 0 === n ||
                          n.add(t),
                        function () {
                          return e.variantChildren.delete(t)
                        }
                      )
                  },
                  sortNodePosition: function (t) {
                    return v && e === t.treeType
                      ? v(G.getInstance(), t.getInstance())
                      : 0
                  },
                  getClosestVariantNode: function () {
                    return $
                      ? G
                      : null === m || void 0 === m
                      ? void 0
                      : m.getClosestVariantNode()
                  },
                  scheduleUpdateLayoutProjection: m
                    ? m.scheduleUpdateLayoutProjection
                    : function () {
                        return Ce.ZP.preRender(
                          G.updateTreeLayoutProjection,
                          !1,
                          !0,
                        )
                      },
                  getLayoutId: function () {
                    return h.layoutId
                  },
                  getInstance: function () {
                    return b
                  },
                  getStaticValue: function (t) {
                    return S[t]
                  },
                  setStaticValue: function (t, n) {
                    return (S[t] = n)
                  },
                  getLatestValues: function () {
                    return S
                  },
                  setVisibility: function (t) {
                    G.isVisible !== t && ((G.isVisible = t), G.scheduleRender())
                  },
                  makeTargetAnimatable: function (t, n) {
                    return void 0 === n && (n = !0), a(G, t, h, n)
                  },
                  addValue: function (t, n) {
                    G.hasValue(t) && G.removeValue(t),
                      F.set(t, n),
                      (S[t] = n.get()),
                      (function (t, n) {
                        var e = n.onChange(function (n) {
                            ;(S[t] = n), h.onUpdate && Ce.ZP.update(N, !1, !0)
                          }),
                          r = n.onRenderRequest(G.scheduleRender)
                        U.set(t, function () {
                          e(), r()
                        })
                      })(t, n)
                  },
                  removeValue: function (t) {
                    var n
                    F.delete(t),
                      null === (n = U.get(t)) || void 0 === n || n(),
                      U.delete(t),
                      delete S[t],
                      d(t, M)
                  },
                  hasValue: function (t) {
                    return F.has(t)
                  },
                  getValue: function (t, n) {
                    var e = F.get(t)
                    return (
                      void 0 === e &&
                        void 0 !== n &&
                        ((e = (0, ur.B)(n)), G.addValue(t, e)),
                      e
                    )
                  },
                  forEachValue: function (t) {
                    return F.forEach(t)
                  },
                  readValue: function (t) {
                    var e
                    return null !== (e = S[t]) && void 0 !== e ? e : c(b, t, n)
                  },
                  setBaseTarget: function (t, n) {
                    H[t] = n
                  },
                  getBaseTarget: function (t) {
                    if (i) {
                      var n = i(h, t)
                      if (void 0 !== n && !(0, X.i)(n)) return n
                    }
                    return H[t]
                  },
                },
                k,
              ),
              {
                build: function () {
                  return Y(), M
                },
                scheduleRender: function () {
                  Ce.ZP.render(_, !1, !0)
                },
                syncRender: _,
                setProps: function (t) {
                  ;(h = t),
                    k.updatePropListeners(t),
                    (I = (function (t, n, e) {
                      var r
                      for (var o in n) {
                        var i = n[o],
                          a = e[o]
                        if ((0, X.i)(i)) t.addValue(o, i)
                        else if ((0, X.i)(a)) t.addValue(o, (0, ur.B)(i))
                        else if (a !== i)
                          if (t.hasValue(o)) {
                            var u = t.getValue(o)
                            !u.hasAnimated && u.set(i)
                          } else
                            t.addValue(
                              o,
                              (0, ur.B)(
                                null !== (r = t.getStaticValue(o)) &&
                                  void 0 !== r
                                  ? r
                                  : i,
                              ),
                            )
                      }
                      for (var o in e) void 0 === n[o] && t.removeValue(o)
                      return n
                    })(G, p(h), I))
                },
                getProps: function () {
                  return h
                },
                getVariant: function (t) {
                  var n
                  return null === (n = h.variants) || void 0 === n
                    ? void 0
                    : n[t]
                },
                getDefaultTransition: function () {
                  return h.transition
                },
                getVariantContext: function (t) {
                  if ((void 0 === t && (t = !1), t))
                    return null === m || void 0 === m
                      ? void 0
                      : m.getVariantContext()
                  if (!K) {
                    var n =
                      (null === m || void 0 === m
                        ? void 0
                        : m.getVariantContext()) || {}
                    return void 0 !== h.initial && (n.initial = h.initial), n
                  }
                  for (var e = {}, r = 0; r < gi; r++) {
                    var o = yi[r],
                      i = h[o]
                    ;(w(i) || !1 === i) && (e[o] = i)
                  }
                  return e
                },
                enableLayoutProjection: function () {
                  ;(V.isEnabled = !0), G.layoutTree.add(G)
                },
                lockProjectionTarget: function () {
                  V.isTargetLocked = !0
                },
                unlockProjectionTarget: function () {
                  G.stopLayoutAnimation(), (V.isTargetLocked = !1)
                },
                getLayoutState: function () {
                  return B
                },
                setCrossfader: function (t) {
                  T = t
                },
                isProjectionReady: function () {
                  return V.isEnabled && V.isHydrated && B.isHydrated
                },
                startLayoutAnimation: function (t, n, e) {
                  void 0 === e && (e = !1)
                  var r = G.getProjectionAnimationProgress()[t],
                    o = e ? V.relativeTarget[t] : V.target[t],
                    i = o.min,
                    a = o.max - i
                  return (
                    r.clearListeners(),
                    r.set(i),
                    r.set(i),
                    r.onChange(function (n) {
                      G.setProjectionTargetAxis(t, n, n + a, e)
                    }),
                    G.animateMotionValue(t, r, 0, n)
                  )
                },
                stopLayoutAnimation: function () {
                  Yr(function (t) {
                    return G.getProjectionAnimationProgress()[t].stop()
                  })
                },
                measureViewportBox: function (t) {
                  void 0 === t && (t = !0)
                  var e = u(b, n)
                  return t || Ao(e, S), e
                },
                getProjectionAnimationProgress: function () {
                  return E || (E = {x: (0, ur.B)(0), y: (0, ur.B)(0)}), E
                },
                setProjectionTargetAxis: function (t, n, e, r) {
                  var o
                  void 0 === r && (r = !1),
                    r
                      ? (V.relativeTarget ||
                          (V.relativeTarget = {
                            x: {min: 0, max: 1},
                            y: {min: 0, max: 1},
                          }),
                        (o = V.relativeTarget[t]))
                      : ((V.relativeTarget = void 0), (o = V.target[t])),
                    (V.isHydrated = !0),
                    (o.min = n),
                    (o.max = e),
                    (O = !0),
                    k.notifySetAxisTarget()
                },
                rebaseProjectionTarget: function (t, n) {
                  void 0 === n && (n = B.layout)
                  var e = G.getProjectionAnimationProgress(),
                    r = e.x,
                    o = e.y,
                    i =
                      !V.relativeTarget &&
                      !V.isTargetLocked &&
                      !r.isAnimating() &&
                      !o.isAnimating()
                  ;(t || i) &&
                    Yr(function (t) {
                      var e = n[t],
                        r = e.min,
                        o = e.max
                      G.setProjectionTargetAxis(t, r, o)
                    })
                },
                notifyLayoutReady: function (t) {
                  !(function (t) {
                    var n = t.getProjectionParent()
                    if (n) {
                      var e = uo(
                        n.getLayoutState().layout,
                        t.getLayoutState().layout,
                      )
                      Yr(function (n) {
                        t.setProjectionTargetAxis(n, e[n].min, e[n].max, !0)
                      })
                    } else t.rebaseProjectionTarget()
                  })(G),
                    G.notifyLayoutUpdate(
                      B.layout,
                      G.prevViewportBox || B.layout,
                      t,
                    )
                },
                resetTransform: function () {
                  return l(G, b, h)
                },
                restoreTransform: function () {
                  return f(b, M)
                },
                updateLayoutProjection: function () {
                  if (G.isProjectionReady()) {
                    var t = B.delta,
                      n = B.treeScale,
                      e = n.x,
                      r = n.y,
                      o = B.deltaTransform
                    li(B, D, G.path, S),
                      O && G.notifyViewportBoxUpdate(D.target, t),
                      (O = !1)
                    var i = ii(t, n)
                    ;(i === o && e === n.x && r === n.y) || G.scheduleRender(),
                      (B.deltaTransform = i)
                  }
                },
                updateTreeLayoutProjection: function () {
                  G.layoutTree.forEach(pi), Ce.ZP.preRender(z, !1, !0)
                },
                getProjectionParent: function () {
                  if (void 0 === P) {
                    for (var t = !1, n = G.path.length - 1; n >= 0; n--) {
                      var e = G.path[n]
                      if (e.projection.isEnabled) {
                        t = e
                        break
                      }
                    }
                    P = t
                  }
                  return P
                },
                resolveRelativeTargetBox: function () {
                  var t = G.getProjectionParent()
                  if (
                    V.relativeTarget &&
                    t &&
                    ((function (t, n) {
                      no(t.target.x, t.relativeTarget.x, n.target.x),
                        no(t.target.y, t.relativeTarget.y, n.target.y)
                    })(V, t.projection),
                    co(t))
                  ) {
                    var n = V.target
                    xo(n, n, t.getLatestValues())
                  }
                },
                shouldResetTransform: function () {
                  return Boolean(h._layoutResetTransform)
                },
                pointTo: function (t) {
                  ;(D = t.projection),
                    (j = t.getLatestValues()),
                    null === A || void 0 === A || A(),
                    (A = hn(
                      t.onSetAxisTarget(G.scheduleUpdateLayoutProjection),
                      t.onLayoutAnimationComplete(function () {
                        var t
                        G.isPresent
                          ? (G.presence = Vo.Present)
                          : null === (t = G.layoutSafeToRemove) ||
                            void 0 === t ||
                            t.call(G)
                      }),
                    ))
                },
                isPresent: !0,
                presence: Vo.Entering,
              },
            )
          return G
        }
      }
      function pi(t) {
        t.resolveRelativeTargetBox()
      }
      function mi(t) {
        t.updateLayoutProjection()
      }
      var hi,
        yi = (0, r.ev)(['initial'], (0, r.CR)(br)),
        gi = yi.length,
        xi = new Set([
          'width',
          'height',
          'top',
          'left',
          'right',
          'bottom',
          'x',
          'y',
        ]),
        bi = function (t) {
          return xi.has(t)
        },
        Pi = function (t, n) {
          t.set(n, !1), t.set(n)
        },
        Ai = function (t) {
          return t === st || t === ot
        }
      !(function (t) {
        ;(t.width = 'width'),
          (t.height = 'height'),
          (t.left = 'left'),
          (t.right = 'right'),
          (t.top = 'top'),
          (t.bottom = 'bottom')
      })(hi || (hi = {}))
      var Ti = function (t, n) {
          return parseFloat(t.split(', ')[n])
        },
        Ei = function (t, n) {
          return function (e, r) {
            var o = r.transform
            if ('none' === o || !o) return 0
            var i = o.match(/^matrix3d\((.+)\)$/)
            if (i) return Ti(i[1], n)
            var a = o.match(/^matrix\((.+)\)$/)
            return a ? Ti(a[1], t) : 0
          }
        },
        wi = new Set(['x', 'y', 'z']),
        Ci = U.filter(function (t) {
          return !wi.has(t)
        })
      var Si = {
          width: function (t) {
            var n = t.x
            return n.max - n.min
          },
          height: function (t) {
            var n = t.y
            return n.max - n.min
          },
          top: function (t, n) {
            var e = n.top
            return parseFloat(e)
          },
          left: function (t, n) {
            var e = n.left
            return parseFloat(e)
          },
          bottom: function (t, n) {
            var e = t.y,
              r = n.top
            return parseFloat(r) + (e.max - e.min)
          },
          right: function (t, n) {
            var e = t.x,
              r = n.left
            return parseFloat(r) + (e.max - e.min)
          },
          x: Ei(4, 13),
          y: Ei(5, 14),
        },
        Li = function (t, n, e, o) {
          void 0 === e && (e = {}),
            void 0 === o && (o = {}),
            (n = (0, r.pi)({}, n)),
            (o = (0, r.pi)({}, o))
          var i = Object.keys(n).filter(bi),
            a = [],
            u = !1,
            s = []
          if (
            (i.forEach(function (r) {
              var i = t.getValue(r)
              if (t.hasValue(r)) {
                var c,
                  l = e[r],
                  f = n[r],
                  d = lr(l)
                if (Ut(f))
                  for (var v = f.length, p = null === f[0] ? 1 : 0; p < v; p++)
                    c ? lr(f[p]) : (c = lr(f[p])) === d || (Ai(d) && Ai(c))
                else c = lr(f)
                if (d !== c)
                  if (Ai(d) && Ai(c)) {
                    var m = i.get()
                    'string' === typeof m && i.set(parseFloat(m)),
                      'string' === typeof f
                        ? (n[r] = parseFloat(f))
                        : Array.isArray(f) &&
                          c === ot &&
                          (n[r] = f.map(parseFloat))
                  } else
                    (null === d || void 0 === d ? void 0 : d.transform) &&
                    (null === c || void 0 === c ? void 0 : c.transform) &&
                    (0 === l || 0 === f)
                      ? 0 === l
                        ? i.set(c.transform(l))
                        : (n[r] = d.transform(f))
                      : (u ||
                          ((a = (function (t) {
                            var n = []
                            return (
                              Ci.forEach(function (e) {
                                var r = t.getValue(e)
                                void 0 !== r &&
                                  (n.push([e, r.get()]),
                                  r.set(e.startsWith('scale') ? 1 : 0))
                              }),
                              n.length && t.syncRender(),
                              n
                            )
                          })(t)),
                          (u = !0)),
                        s.push(r),
                        (o[r] = void 0 !== o[r] ? o[r] : n[r]),
                        Pi(i, f))
              }
            }),
            s.length)
          ) {
            var c = (function (t, n, e) {
              var r = n.measureViewportBox(),
                o = n.getInstance(),
                i = getComputedStyle(o),
                a = i.display,
                u = {
                  top: i.top,
                  left: i.left,
                  bottom: i.bottom,
                  right: i.right,
                  transform: i.transform,
                }
              'none' === a && n.setStaticValue('display', t.display || 'block'),
                n.syncRender()
              var s = n.measureViewportBox()
              return (
                e.forEach(function (e) {
                  var o = n.getValue(e)
                  Pi(o, Si[e](r, u)), (t[e] = Si[e](s, i))
                }),
                t
              )
            })(n, t, s)
            return (
              a.length &&
                a.forEach(function (n) {
                  var e = (0, r.CR)(n, 2),
                    o = e[0],
                    i = e[1]
                  t.getValue(o).set(i)
                }),
              t.syncRender(),
              {target: c, transitionEnd: o}
            )
          }
          return {target: n, transitionEnd: o}
        }
      function Ri(t, n, e, r) {
        return (function (t) {
          return Object.keys(t).some(bi)
        })(n)
          ? Li(t, n, e, r)
          : {target: n, transitionEnd: r}
      }
      var Mi = function (t, n, e, o) {
        var i = (function (t, n, e) {
          var o,
            i = (0, r._T)(n, []),
            a = t.getInstance()
          if (!(a instanceof HTMLElement)) return {target: i, transitionEnd: e}
          for (var u in (e && (e = (0, r.pi)({}, e)),
          t.forEachValue(function (t) {
            var n = t.get()
            if (Bo(n)) {
              var e = Fo(n, a)
              e && t.set(e)
            }
          }),
          i)) {
            var s = i[u]
            if (Bo(s)) {
              var c = Fo(s, a)
              c &&
                ((i[u] = c),
                e && ((null !== (o = e[u]) && void 0 !== o) || (e[u] = s)))
            }
          }
          return {target: i, transitionEnd: e}
        })(t, n, o)
        return Ri(t, (n = i.target), e, (o = i.transitionEnd))
      }
      var ki = {
          treeType: 'dom',
          readValueFromInstance: function (t, n) {
            if (_(n)) {
              var e = Je(n)
              return (e && e.default) || 0
            }
            var r,
              o = ((r = t), window.getComputedStyle(r))
            return (Z(n) ? o.getPropertyValue(n) : o[n]) || 0
          },
          sortNodePosition: function (t, n) {
            return 2 & t.compareDocumentPosition(n) ? 1 : -1
          },
          getBaseTarget: function (t, n) {
            var e
            return null === (e = t.style) || void 0 === e ? void 0 : e[n]
          },
          measureViewportBox: function (t, n) {
            return qr(t, n.transformPagePoint)
          },
          resetTransform: function (t, n, e) {
            var r = e.transformTemplate
            ;(n.style.transform = r ? r({}, '') : 'none'), t.scheduleRender()
          },
          restoreTransform: function (t, n) {
            t.style.transform = n.style.transform
          },
          removeValueFromRenderState: function (t, n) {
            var e = n.vars,
              r = n.style
            delete e[t], delete r[t]
          },
          makeTargetAnimatable: function (t, n, e, o) {
            var i = e.transformValues
            void 0 === o && (o = !0)
            var a = n.transition,
              u = n.transitionEnd,
              s = (0, r._T)(n, ['transition', 'transitionEnd']),
              c = (function (t, n, e) {
                var r,
                  o,
                  i = {}
                for (var a in t)
                  i[a] =
                    null !== (r = mr(a, n)) && void 0 !== r
                      ? r
                      : null === (o = e.getValue(a)) || void 0 === o
                      ? void 0
                      : o.get()
                return i
              })(s, a || {}, t)
            if ((i && (u && (u = i(u)), s && (s = i(s)), c && (c = i(c))), o)) {
              !(function (t, n, e) {
                var r,
                  o,
                  i,
                  a,
                  u = Object.keys(n).filter(function (n) {
                    return !t.hasValue(n)
                  }),
                  s = u.length
                if (s)
                  for (var c = 0; c < s; c++) {
                    var l = u[c],
                      f = n[l],
                      d = null
                    Array.isArray(f) && (d = f[0]),
                      null === d &&
                        (d =
                          null !==
                            (o =
                              null !== (r = e[l]) && void 0 !== r
                                ? r
                                : t.readValue(l)) && void 0 !== o
                            ? o
                            : n[l]),
                      void 0 !== d &&
                        null !== d &&
                        ('string' === typeof d && /^\-?\d*\.?\d+$/.test(d)
                          ? (d = parseFloat(d))
                          : !dr(d) && $n.test(f) && (d = Qe(l, f)),
                        t.addValue(l, (0, ur.B)(d)),
                        (null !== (i = (a = e)[l]) && void 0 !== i) ||
                          (a[l] = d),
                        t.setBaseTarget(l, d))
                  }
              })(t, s, c)
              var l = Mi(t, s, c, u)
              ;(u = l.transitionEnd), (s = l.target)
            }
            return (0, r.pi)({transition: a, transitionEnd: u}, s)
          },
          scrapeMotionValuesFromProps: Bt,
          build: function (t, n, e, r, o, i, a) {
            void 0 !== t.isVisible &&
              (n.style.visibility = t.isVisible ? 'visible' : 'hidden')
            var u = r.isEnabled && o.isHydrated
            vt(
              n,
              e,
              r,
              o,
              i,
              a.transformTemplate,
              u ? ii : void 0,
              u ? ai : void 0,
            )
          },
          render: Vt,
        },
        Vi = vi(ki),
        Di = vi(
          (0, r.pi)((0, r.pi)({}, ki), {
            getBaseTarget: function (t, n) {
              return t[n]
            },
            readValueFromInstance: function (t, n) {
              var e
              return _(n)
                ? (null === (e = Je(n)) || void 0 === e ? void 0 : e.default) ||
                    0
                : ((n = Dt.has(n) ? n : kt(n)), t.getAttribute(n))
            },
            scrapeMotionValuesFromProps: Ot,
            build: function (t, n, e, r, o, i, a) {
              var u = r.isEnabled && o.isHydrated
              Ct(
                n,
                e,
                r,
                o,
                i,
                a.transformTemplate,
                u ? ii : void 0,
                u ? ai : void 0,
              )
            },
            render: jt,
          }),
        ),
        ji = function (t, n) {
          return B(t)
            ? Di(n, {enableHardwareAcceleration: !1})
            : Vi(n, {enableHardwareAcceleration: !0})
        },
        Bi = (0, r.pi)((0, r.pi)((0, r.pi)((0, r.pi)({}, Cr), gn), jo), ei),
        Oi = D(function (t, n) {
          return (function (t, n, e, o) {
            var i = n.forwardMotionProps,
              a = void 0 !== i && i,
              u = B(t) ? Nt : Xt
            return (0,
            r.pi)((0, r.pi)({}, u), {preloadedFeatures: e, useRender: Rt(a), createVisualElement: o, Component: t})
          })(t, n, Bi, ji)
        })
    },
    70664: function (t, n, e) {
      'use strict'
      function r(t, n) {
        ;-1 === t.indexOf(n) && t.push(n)
      }
      function o(t, n) {
        var e = t.indexOf(n)
        e > -1 && t.splice(e, 1)
      }
      e.d(n, {
        y: function () {
          return r
        },
        c: function () {
          return o
        },
      })
    },
    71206: function (t, n, e) {
      'use strict'
      e.d(n, {
        L: function () {
          return o
        },
      })
      var r = e(70664),
        o = (function () {
          function t() {
            this.subscriptions = []
          }
          return (
            (t.prototype.add = function (t) {
              var n = this
              return (
                (0, r.y)(this.subscriptions, t),
                function () {
                  return (0, r.c)(n.subscriptions, t)
                }
              )
            }),
            (t.prototype.notify = function (t, n, e) {
              var r = this.subscriptions.length
              if (r)
                if (1 === r) this.subscriptions[0](t, n, e)
                else
                  for (var o = 0; o < r; o++) {
                    var i = this.subscriptions[o]
                    i && i(t, n, e)
                  }
            }),
            (t.prototype.getSize = function () {
              return this.subscriptions.length
            }),
            (t.prototype.clear = function () {
              this.subscriptions.length = 0
            }),
            t
          )
        })()
    },
    3902: function (t, n, e) {
      'use strict'
      e.d(n, {
        B: function () {
          return u
        },
      })
      var r = e(15148),
        o = e(27349),
        i = e(71206),
        a = (function () {
          function t(t) {
            var n,
              e = this
            ;(this.timeDelta = 0),
              (this.lastUpdated = 0),
              (this.updateSubscribers = new i.L()),
              (this.velocityUpdateSubscribers = new i.L()),
              (this.renderSubscribers = new i.L()),
              (this.canTrackVelocity = !1),
              (this.updateAndNotify = function (t, n) {
                void 0 === n && (n = !0), (e.prev = e.current), (e.current = t)
                var o = (0, r.$B)(),
                  i = o.delta,
                  a = o.timestamp
                e.lastUpdated !== a &&
                  ((e.timeDelta = i),
                  (e.lastUpdated = a),
                  r.ZP.postRender(e.scheduleVelocityCheck)),
                  e.prev !== e.current && e.updateSubscribers.notify(e.current),
                  e.velocityUpdateSubscribers.getSize() &&
                    e.velocityUpdateSubscribers.notify(e.getVelocity()),
                  n && e.renderSubscribers.notify(e.current)
              }),
              (this.scheduleVelocityCheck = function () {
                return r.ZP.postRender(e.velocityCheck)
              }),
              (this.velocityCheck = function (t) {
                t.timestamp !== e.lastUpdated &&
                  ((e.prev = e.current),
                  e.velocityUpdateSubscribers.notify(e.getVelocity()))
              }),
              (this.hasAnimated = !1),
              (this.prev = this.current = t),
              (this.canTrackVelocity =
                ((n = this.current), !isNaN(parseFloat(n))))
          }
          return (
            (t.prototype.onChange = function (t) {
              return this.updateSubscribers.add(t)
            }),
            (t.prototype.clearListeners = function () {
              this.updateSubscribers.clear()
            }),
            (t.prototype.onRenderRequest = function (t) {
              return t(this.get()), this.renderSubscribers.add(t)
            }),
            (t.prototype.attach = function (t) {
              this.passiveEffect = t
            }),
            (t.prototype.set = function (t, n) {
              void 0 === n && (n = !0),
                n && this.passiveEffect
                  ? this.passiveEffect(t, this.updateAndNotify)
                  : this.updateAndNotify(t, n)
            }),
            (t.prototype.get = function () {
              return this.current
            }),
            (t.prototype.getPrevious = function () {
              return this.prev
            }),
            (t.prototype.getVelocity = function () {
              return this.canTrackVelocity
                ? (0, o.R)(
                    parseFloat(this.current) - parseFloat(this.prev),
                    this.timeDelta,
                  )
                : 0
            }),
            (t.prototype.start = function (t) {
              var n = this
              return (
                this.stop(),
                new Promise(function (e) {
                  ;(n.hasAnimated = !0), (n.stopAnimation = t(e))
                }).then(function () {
                  return n.clearAnimation()
                })
              )
            }),
            (t.prototype.stop = function () {
              this.stopAnimation && this.stopAnimation(), this.clearAnimation()
            }),
            (t.prototype.isAnimating = function () {
              return !!this.stopAnimation
            }),
            (t.prototype.clearAnimation = function () {
              this.stopAnimation = null
            }),
            (t.prototype.destroy = function () {
              this.updateSubscribers.clear(),
                this.renderSubscribers.clear(),
                this.stop()
            }),
            t
          )
        })()
      function u(t) {
        return new a(t)
      }
    },
    33266: function (t, n, e) {
      'use strict'
      e.d(n, {
        i: function () {
          return r
        },
      })
      var r = function (t) {
        return null !== t && 'object' === typeof t && t.getVelocity
      }
    },
    15148: function (t, n, e) {
      'use strict'
      e.d(n, {
        qY: function () {
          return v
        },
        ZP: function () {
          return x
        },
        iW: function () {
          return p
        },
        $B: function () {
          return g
        },
      })
      var r = (1 / 60) * 1e3,
        o =
          'undefined' !== typeof performance
            ? function () {
                return performance.now()
              }
            : function () {
                return Date.now()
              },
        i =
          'undefined' !== typeof window
            ? function (t) {
                return window.requestAnimationFrame(t)
              }
            : function (t) {
                return setTimeout(function () {
                  return t(o())
                }, r)
              }
      var a = !0,
        u = !1,
        s = !1,
        c = {delta: 0, timestamp: 0},
        l = ['read', 'update', 'preRender', 'render', 'postRender'],
        f = l.reduce(function (t, n) {
          return (
            (t[n] = (function (t) {
              var n = [],
                e = [],
                r = 0,
                o = !1,
                i = new WeakSet(),
                a = {
                  schedule: function (t, a, u) {
                    void 0 === a && (a = !1), void 0 === u && (u = !1)
                    var s = u && o,
                      c = s ? n : e
                    return (
                      a && i.add(t),
                      -1 === c.indexOf(t) &&
                        (c.push(t), s && o && (r = n.length)),
                      t
                    )
                  },
                  cancel: function (t) {
                    var n = e.indexOf(t)
                    ;-1 !== n && e.splice(n, 1), i.delete(t)
                  },
                  process: function (u) {
                    var s
                    if (
                      ((o = !0),
                      (n = (s = [e, n])[0]),
                      ((e = s[1]).length = 0),
                      (r = n.length))
                    )
                      for (var c = 0; c < r; c++) {
                        var l = n[c]
                        l(u), i.has(l) && (a.schedule(l), t())
                      }
                    o = !1
                  },
                }
              return a
            })(function () {
              return (u = !0)
            })),
            t
          )
        }, {}),
        d = l.reduce(function (t, n) {
          var e = f[n]
          return (
            (t[n] = function (t, n, r) {
              return (
                void 0 === n && (n = !1),
                void 0 === r && (r = !1),
                u || y(),
                e.schedule(t, n, r)
              )
            }),
            t
          )
        }, {}),
        v = l.reduce(function (t, n) {
          return (t[n] = f[n].cancel), t
        }, {}),
        p = l.reduce(function (t, n) {
          return (
            (t[n] = function () {
              return f[n].process(c)
            }),
            t
          )
        }, {}),
        m = function (t) {
          return f[t].process(c)
        },
        h = function (t) {
          ;(u = !1),
            (c.delta = a ? r : Math.max(Math.min(t - c.timestamp, 40), 1)),
            (c.timestamp = t),
            (s = !0),
            l.forEach(m),
            (s = !1),
            u && ((a = !1), i(h))
        },
        y = function () {
          ;(u = !0), (a = !0), s || i(h)
        },
        g = function () {
          return c
        },
        x = d
    },
    50102: function (t, n, e) {
      'use strict'
      var r = e(66093)
      n.default = void 0
      var o,
        i = (o = e(29901)) && o.__esModule ? o : {default: o},
        a = e(92520),
        u = e(21469),
        s = e(95345)
      var c = {}
      function l(t, n, e, r) {
        if (t && a.isLocalURL(n)) {
          t.prefetch(n, e, r).catch(function (t) {
            0
          })
          var o =
            r && 'undefined' !== typeof r.locale ? r.locale : t && t.locale
          c[n + '%' + e + (o ? '%' + o : '')] = !0
        }
      }
      var f = function (t) {
        var n,
          e = !1 !== t.prefetch,
          o = u.useRouter(),
          f = i.default.useMemo(
            function () {
              var n = a.resolveHref(o, t.href, !0),
                e = r(n, 2),
                i = e[0],
                u = e[1]
              return {href: i, as: t.as ? a.resolveHref(o, t.as) : u || i}
            },
            [o, t.href, t.as],
          ),
          d = f.href,
          v = f.as,
          p = t.children,
          m = t.replace,
          h = t.shallow,
          y = t.scroll,
          g = t.locale
        'string' === typeof p && (p = i.default.createElement('a', null, p))
        var x =
            (n = i.default.Children.only(p)) && 'object' === typeof n && n.ref,
          b = s.useIntersection({rootMargin: '200px'}),
          P = r(b, 2),
          A = P[0],
          T = P[1],
          E = i.default.useCallback(
            function (t) {
              A(t),
                x &&
                  ('function' === typeof x
                    ? x(t)
                    : 'object' === typeof x && (x.current = t))
            },
            [x, A],
          )
        i.default.useEffect(
          function () {
            var t = T && e && a.isLocalURL(d),
              n = 'undefined' !== typeof g ? g : o && o.locale,
              r = c[d + '%' + v + (n ? '%' + n : '')]
            t && !r && l(o, d, v, {locale: n})
          },
          [v, d, T, g, e, o],
        )
        var w = {
          ref: E,
          onClick: function (t) {
            n.props &&
              'function' === typeof n.props.onClick &&
              n.props.onClick(t),
              t.defaultPrevented ||
                (function (t, n, e, r, o, i, u, s) {
                  ;('A' !== t.currentTarget.nodeName ||
                    (!(function (t) {
                      var n = t.currentTarget.target
                      return (
                        (n && '_self' !== n) ||
                        t.metaKey ||
                        t.ctrlKey ||
                        t.shiftKey ||
                        t.altKey ||
                        (t.nativeEvent && 2 === t.nativeEvent.which)
                      )
                    })(t) &&
                      a.isLocalURL(e))) &&
                    (t.preventDefault(),
                    null == u && r.indexOf('#') >= 0 && (u = !1),
                    n[o ? 'replace' : 'push'](e, r, {
                      shallow: i,
                      locale: s,
                      scroll: u,
                    }))
                })(t, o, d, v, m, h, y, g)
          },
          onMouseEnter: function (t) {
            a.isLocalURL(d) &&
              (n.props &&
                'function' === typeof n.props.onMouseEnter &&
                n.props.onMouseEnter(t),
              l(o, d, v, {priority: !0}))
          },
        }
        if (t.passHref || ('a' === n.type && !('href' in n.props))) {
          var C = 'undefined' !== typeof g ? g : o && o.locale,
            S =
              o &&
              o.isLocaleDomain &&
              a.getDomainLocale(v, C, o && o.locales, o && o.domainLocales)
          w.href = S || a.addBasePath(a.addLocale(v, C, o && o.defaultLocale))
        }
        return i.default.cloneElement(n, w)
      }
      n.default = f
    },
    53676: function (t, n, e) {
      t.exports = e(50102)
    },
    27349: function (t, n, e) {
      'use strict'
      function r(t, n) {
        return n ? t * (1e3 / n) : 0
      }
      e.d(n, {
        R: function () {
          return r
        },
      })
    },
    64873: function (t, n, e) {
      'use strict'
      e.d(n, {
        ZT: function () {
          return o
        },
        pi: function () {
          return i
        },
        _T: function () {
          return a
        },
        CR: function () {
          return u
        },
        ev: function () {
          return s
        },
      })
      var r = function (t, n) {
        return (r =
          Object.setPrototypeOf ||
          ({__proto__: []} instanceof Array &&
            function (t, n) {
              t.__proto__ = n
            }) ||
          function (t, n) {
            for (var e in n)
              Object.prototype.hasOwnProperty.call(n, e) && (t[e] = n[e])
          })(t, n)
      }
      function o(t, n) {
        if ('function' !== typeof n && null !== n)
          throw new TypeError(
            'Class extends value ' +
              String(n) +
              ' is not a constructor or null',
          )
        function e() {
          this.constructor = t
        }
        r(t, n),
          (t.prototype =
            null === n
              ? Object.create(n)
              : ((e.prototype = n.prototype), new e()))
      }
      var i = function () {
        return (i =
          Object.assign ||
          function (t) {
            for (var n, e = 1, r = arguments.length; e < r; e++)
              for (var o in (n = arguments[e]))
                Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o])
            return t
          }).apply(this, arguments)
      }
      function a(t, n) {
        var e = {}
        for (var r in t)
          Object.prototype.hasOwnProperty.call(t, r) &&
            n.indexOf(r) < 0 &&
            (e[r] = t[r])
        if (null != t && 'function' === typeof Object.getOwnPropertySymbols) {
          var o = 0
          for (r = Object.getOwnPropertySymbols(t); o < r.length; o++)
            n.indexOf(r[o]) < 0 &&
              Object.prototype.propertyIsEnumerable.call(t, r[o]) &&
              (e[r[o]] = t[r[o]])
        }
        return e
      }
      Object.create
      function u(t, n) {
        var e = 'function' === typeof Symbol && t[Symbol.iterator]
        if (!e) return t
        var r,
          o,
          i = e.call(t),
          a = []
        try {
          for (; (void 0 === n || n-- > 0) && !(r = i.next()).done; )
            a.push(r.value)
        } catch (u) {
          o = {error: u}
        } finally {
          try {
            r && !r.done && (e = i.return) && e.call(i)
          } finally {
            if (o) throw o.error
          }
        }
        return a
      }
      function s(t, n, e) {
        if (e || 2 === arguments.length)
          for (var r, o = 0, i = n.length; o < i; o++)
            (!r && o in n) ||
              (r || (r = Array.prototype.slice.call(n, 0, o)), (r[o] = n[o]))
        return t.concat(r || n)
      }
      Object.create
    },
  },
])
