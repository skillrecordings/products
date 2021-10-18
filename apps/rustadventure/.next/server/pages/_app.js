'use strict'
;(() => {
  var exports = {}
  exports.id = 888
  exports.ids = [888]
  exports.modules = {
    /***/ 5688: /***/ (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__,
    ) => {
      // ESM COMPAT FLAG
      __webpack_require__.r(__webpack_exports__)

      // EXPORTS
      __webpack_require__.d(__webpack_exports__, {
        default: () => /* binding */ _app,
      })

      // EXTERNAL MODULE: external "react"
      var external_react_ = __webpack_require__(9297)
      // EXTERNAL MODULE: external "next-seo"
      var external_next_seo_ = __webpack_require__(2364)
      // EXTERNAL MODULE: ./src/config.js
      var config = __webpack_require__(8118)
      // EXTERNAL MODULE: external "@mdx-js/react"
      var react_ = __webpack_require__(4800) // CONCATENATED MODULE: external "focus-visible"
      const external_focus_visible_namespaceObject = require('focus-visible')
      // EXTERNAL MODULE: ../../packages/viewer/dist/index.js
      var dist = __webpack_require__(4965)
      // EXTERNAL MODULE: ../../packages/convertkit/dist/index.js
      var convertkit_dist = __webpack_require__(6102)
      // EXTERNAL MODULE: ../../node_modules/.pnpm/next@11.1.2_f31b35bdaa3b7c2fce82404f09d2dac4/node_modules/next/image.js
      var next_image = __webpack_require__(5671)
      // EXTERNAL MODULE: external "react/jsx-runtime"
      var jsx_runtime_ = __webpack_require__(5282) // CONCATENATED MODULE: ./src/components/mdx/index.tsx
      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object)
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object)
          if (enumerableOnly) {
            symbols = symbols.filter(function (sym) {
              return Object.getOwnPropertyDescriptor(object, sym).enumerable
            })
          }
          keys.push.apply(keys, symbols)
        }
        return keys
      }

      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {}
          if (i % 2) {
            ownKeys(Object(source), true).forEach(function (key) {
              _defineProperty(target, key, source[key])
            })
          } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
              target,
              Object.getOwnPropertyDescriptors(source),
            )
          } else {
            ownKeys(Object(source)).forEach(function (key) {
              Object.defineProperty(
                target,
                key,
                Object.getOwnPropertyDescriptor(source, key),
              )
            })
          }
        }
        return target
      }

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
          })
        } else {
          obj[key] = value
        }
        return obj
      }

      const mdxComponents = {
        SectionHeader: (props) => {
          return /*#__PURE__*/ jsx_runtime_.jsx(
            'div',
            _objectSpread(
              _objectSpread(
                {
                  className: 'text-4xl font-bold',
                },
                props,
              ),
              {},
              {
                children: props.children,
              },
            ),
          )
        },
        Image: next_image.default,
      }
      /* harmony default export */ const mdx = mdxComponents // CONCATENATED MODULE: ./src/pages/_app.tsx
      function _app_ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object)
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object)
          if (enumerableOnly) {
            symbols = symbols.filter(function (sym) {
              return Object.getOwnPropertyDescriptor(object, sym).enumerable
            })
          }
          keys.push.apply(keys, symbols)
        }
        return keys
      }

      function _app_objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {}
          if (i % 2) {
            _app_ownKeys(Object(source), true).forEach(function (key) {
              _app_defineProperty(target, key, source[key])
            })
          } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(
              target,
              Object.getOwnPropertyDescriptors(source),
            )
          } else {
            _app_ownKeys(Object(source)).forEach(function (key) {
              Object.defineProperty(
                target,
                key,
                Object.getOwnPropertyDescriptor(source, key),
              )
            })
          }
        }
        return target
      }

      function _app_defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
          })
        } else {
          obj[key] = value
        }
        return obj
      }

      function MyApp({Component, pageProps}) {
        return /*#__PURE__*/ (0, jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
          children: [
            /*#__PURE__*/ jsx_runtime_.jsx(
              external_next_seo_.DefaultSeo,
              _app_objectSpread({}, config /* default */.Z),
            ),
            /*#__PURE__*/ jsx_runtime_.jsx(convertkit_dist.ConvertkitProvider, {
              children: /*#__PURE__*/ jsx_runtime_.jsx(dist.ViewerProvider, {
                children: /*#__PURE__*/ jsx_runtime_.jsx(react_.MDXProvider, {
                  components: mdx,
                  children: /*#__PURE__*/ jsx_runtime_.jsx(
                    Component,
                    _app_objectSpread({}, pageProps),
                  ),
                }),
              }),
            }),
          ],
        })
      }

      /* harmony default export */ const _app = MyApp

      /***/
    },

    /***/ 4800: /***/ (module) => {
      module.exports = require('@mdx-js/react')

      /***/
    },

    /***/ 7295: /***/ (module) => {
      module.exports = require('@xstate/react')

      /***/
    },

    /***/ 2376: /***/ (module) => {
      module.exports = require('axios')

      /***/
    },

    /***/ 8652: /***/ (module) => {
      module.exports = require('client-oauth2')

      /***/
    },

    /***/ 8883: /***/ (module) => {
      module.exports = require('cookie')

      /***/
    },

    /***/ 3804: /***/ (module) => {
      module.exports = require('lodash')

      /***/
    },

    /***/ 9662: /***/ (module) => {
      module.exports = require('lodash/clone')

      /***/
    },

    /***/ 9552: /***/ (module) => {
      module.exports = require('lodash/cloneDeep')

      /***/
    },

    /***/ 4105: /***/ (module) => {
      module.exports = require('lodash/filter')

      /***/
    },

    /***/ 3935: /***/ (module) => {
      module.exports = require('lodash/find')

      /***/
    },

    /***/ 9741: /***/ (module) => {
      module.exports = require('lodash/first')

      /***/
    },

    /***/ 2566: /***/ (module) => {
      module.exports = require('lodash/get')

      /***/
    },

    /***/ 8718: /***/ (module) => {
      module.exports = require('lodash/isEmpty')

      /***/
    },

    /***/ 6414: /***/ (module) => {
      module.exports = require('lodash/isEqual')

      /***/
    },

    /***/ 8417: /***/ (module) => {
      module.exports = require('lodash/isPlainObject')

      /***/
    },

    /***/ 3946: /***/ (module) => {
      module.exports = require('lodash/isString')

      /***/
    },

    /***/ 6355: /***/ (module) => {
      module.exports = require('lodash/reduce')

      /***/
    },

    /***/ 7825: /***/ (module) => {
      module.exports = require('lodash/toPath')

      /***/
    },

    /***/ 2364: /***/ (module) => {
      module.exports = require('next-seo')

      /***/
    },

    /***/ 822: /***/ (module) => {
      module.exports = require('next/dist/server/image-config.js')

      /***/
    },

    /***/ 6695: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/head.js')

      /***/
    },

    /***/ 556: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/to-base-64.js')

      /***/
    },

    /***/ 1366: /***/ (module) => {
      module.exports = require('query-string')

      /***/
    },

    /***/ 9297: /***/ (module) => {
      module.exports = require('react')

      /***/
    },

    /***/ 5282: /***/ (module) => {
      module.exports = require('react/jsx-runtime')

      /***/
    },

    /***/ 2043: /***/ (module) => {
      module.exports = require('xstate')

      /***/
    },

    /***/ 9440: /***/ (module) => {
      module.exports = require('yup')

      /***/
    },
  }
  // load runtime
  var __webpack_require__ = require('../webpack-runtime.js')
  __webpack_require__.C(exports)
  var __webpack_exec__ = (moduleId) =>
    __webpack_require__((__webpack_require__.s = moduleId))
  var __webpack_exports__ = __webpack_require__.X(
    0,
    [800, 345, 379, 671, 106, 667, 383, 422, 691, 102],
    () => __webpack_exec__(5688),
  )
  module.exports = __webpack_exports__
})()
