'use strict'
;(() => {
  var exports = {}
  exports.id = 660
  exports.ids = [660]
  exports.modules = {
    /***/ 7267: /***/ (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__,
    ) => {
      __webpack_require__.r(__webpack_exports__)
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => /* binding */ MyDocument,
        /* harmony export */
      })
      /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(9297)
      /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default =
        /*#__PURE__*/ __webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__)
      /* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1__ =
        __webpack_require__(8165)
      /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ =
        __webpack_require__(5282)
      /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default =
        /*#__PURE__*/ __webpack_require__.n(
          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__,
        )
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

      class MyDocument extends next_document__WEBPACK_IMPORTED_MODULE_1__.default {
        static async getInitialProps(ctx) {
          const initialProps =
            await next_document__WEBPACK_IMPORTED_MODULE_1__.default.getInitialProps(
              ctx,
            )
          return _objectSpread(
            _objectSpread({}, initialProps),
            {},
            {
              styles:
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx(
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment,
                  {
                    children: initialProps.styles,
                  },
                ),
            },
          )
        }

        render() {
          return /*#__PURE__*/ (0,
          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(
            next_document__WEBPACK_IMPORTED_MODULE_1__.Html,
            {
              children: [
                /*#__PURE__*/ (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(
                  next_document__WEBPACK_IMPORTED_MODULE_1__.Head,
                  {
                    children: [
                      /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx(
                        'link',
                        {
                          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
                          rel: 'stylesheet',
                        },
                      ),
                      /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx(
                        'link',
                        {
                          rel: 'apple-touch-icon',
                          sizes: '180x180',
                          href: '/apple-touch-icon.png',
                        },
                      ),
                      /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx(
                        'link',
                        {
                          rel: 'icon',
                          type: 'image/png',
                          sizes: '32x32',
                          href: '/favicon-32x32.png',
                        },
                      ),
                      /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx(
                        'link',
                        {
                          rel: 'icon',
                          type: 'image/png',
                          sizes: '16x16',
                          href: '/favicon-16x16.png',
                        },
                      ),
                      /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx(
                        'link',
                        {
                          rel: 'mask-icon',
                          href: '/safari-pinned-tab.svg',
                          color: '#5bbad5',
                        },
                      ),
                      /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx(
                        'meta',
                        {
                          name: 'msapplication-TileColor',
                          content: '#da532c',
                        },
                      ),
                      /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx(
                        'meta',
                        {
                          name: 'theme-color',
                          content: '#ffffff',
                        },
                      ),
                    ],
                  },
                ),
                /*#__PURE__*/ (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)('body', {
                  className:
                    'dark:bg-black bg-white dark:text-white text-black transition-colors duration-100 ease-in-out',
                  children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx(
                      next_document__WEBPACK_IMPORTED_MODULE_1__.Main,
                      {},
                    ),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx(
                      next_document__WEBPACK_IMPORTED_MODULE_1__.NextScript,
                      {},
                    ),
                  ],
                }),
              ],
            },
          )
        }
      }

      /***/
    },

    /***/ 372: /***/ (module) => {
      module.exports = require('next/dist/server/get-page-files.js')

      /***/
    },

    /***/ 5041: /***/ (module) => {
      module.exports = require('next/dist/server/htmlescape.js')

      /***/
    },

    /***/ 6464: /***/ (module) => {
      module.exports = require('next/dist/server/utils.js')

      /***/
    },

    /***/ 6044: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/constants.js')

      /***/
    },

    /***/ 6098: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/head-manager-context.js')

      /***/
    },

    /***/ 7620: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/utils.js')

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
  }
  // load runtime
  var __webpack_require__ = require('../webpack-runtime.js')
  __webpack_require__.C(exports)
  var __webpack_exec__ = (moduleId) =>
    __webpack_require__((__webpack_require__.s = moduleId))
  var __webpack_exports__ = __webpack_require__.X(0, [165], () =>
    __webpack_exec__(7267),
  )
  module.exports = __webpack_exports__
})()
