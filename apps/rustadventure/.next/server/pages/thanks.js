'use strict'
;(() => {
  var exports = {}
  exports.id = 104
  exports.ids = [104]
  exports.modules = {
    /***/ 7586: /***/ (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__,
    ) => {
      __webpack_require__.r(__webpack_exports__)
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */ getServerSideProps: () =>
          /* binding */ getServerSideProps,
        /* harmony export */
      })
      /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(9297)
      /* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default =
        /*#__PURE__*/ __webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__)
      /* harmony import */ var layouts__WEBPACK_IMPORTED_MODULE_1__ =
        __webpack_require__(2239)
      /* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ =
        __webpack_require__(8118)
      /* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_3__ =
        __webpack_require__(2566)
      /* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_3___default =
        /*#__PURE__*/ __webpack_require__.n(
          lodash_get__WEBPACK_IMPORTED_MODULE_3__,
        )
      /* harmony import */ var react_markdown__WEBPACK_IMPORTED_MODULE_4__ =
        __webpack_require__(3703)
      /* harmony import */ var react_markdown__WEBPACK_IMPORTED_MODULE_4___default =
        /*#__PURE__*/ __webpack_require__.n(
          react_markdown__WEBPACK_IMPORTED_MODULE_4__,
        )
      /* harmony import */ var _skillrecordings_stripe__WEBPACK_IMPORTED_MODULE_5__ =
        __webpack_require__(2187)
      /* harmony import */ var _skillrecordings_stripe__WEBPACK_IMPORTED_MODULE_5___default =
        /*#__PURE__*/ __webpack_require__.n(
          _skillrecordings_stripe__WEBPACK_IMPORTED_MODULE_5__,
        )
      /* harmony import */ var _skillrecordings_viewer__WEBPACK_IMPORTED_MODULE_6__ =
        __webpack_require__(4965)
      /* harmony import */ var _skillrecordings_viewer__WEBPACK_IMPORTED_MODULE_6___default =
        /*#__PURE__*/ __webpack_require__.n(
          _skillrecordings_viewer__WEBPACK_IMPORTED_MODULE_6__,
        )
      /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ =
        __webpack_require__(5282)
      /* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default =
        /*#__PURE__*/ __webpack_require__.n(
          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__,
        )

      const ThanksPage = ({displayEmail}) => {
        const {refreshViewer} = (0,
        _skillrecordings_viewer__WEBPACK_IMPORTED_MODULE_6__.useViewer)()
        react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
          refreshViewer === null || refreshViewer === void 0
            ? void 0
            : refreshViewer()
        }, [])
        const emailText =
          displayEmail && displayEmail !== 'undefined'
            ? `**${displayEmail}**`
            : ''
        const instructionText = `# Thank you for purchasing ${
          _config__WEBPACK_IMPORTED_MODULE_2__ /* .default.defaultTitle */.Z
            .defaultTitle
        }. Please check your inbox.
${emailText ? `## ${emailText}` : ''}
As a final step to access the course you need
to check your inbox ${
          emailText ? `(${emailText})` : ''
        } where you will find an email from \`${
          process.env.NEXT_PUBLIC_SUPPORT_EMAIL
        }\`
with a link to access your purchase and start learning.
`

        const TwitterIcon = () =>
          /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(
            'svg',
            {
              height: '16',
              width: '16',
              viewBox: '0 0 16 16',
              xmlns: 'http://www.w3.org/2000/svg',
              children:
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(
                  'g',
                  {
                    fill: '#fff',
                    children:
                      /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(
                        'path',
                        {
                          d: 'M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z',
                        },
                      ),
                  },
                ),
            },
          )

        const tweet = `https://twitter.com/intent/tweet/?text=Just purchased ${
          _config__WEBPACK_IMPORTED_MODULE_2__ /* .default.siteUrl */.Z.siteUrl
        } by @${
          _config__WEBPACK_IMPORTED_MODULE_2__ /* .default.twitter.handle */.Z
            .twitter.handle
        }`

        const Share = () =>
          /*#__PURE__*/ (0,
          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment,
            {
              children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(
                  'hr',
                  {
                    className: 'mt-8 dark:border-gray-900 border-gray-100',
                  },
                ),
                /*#__PURE__*/ (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)('div', {
                  className: 'py-8',
                  children: [
                    /*#__PURE__*/ (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(
                      'div',
                      {
                        className: 'pb-4 font-semibold',
                        children: [
                          'Please consider telling your friends about ',
                          _config__WEBPACK_IMPORTED_MODULE_2__ /* .default.siteUrl */
                            .Z.siteUrl,
                          ', it would help me to get a word out. :)',
                        ],
                      },
                    ),
                    /*#__PURE__*/ (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)('a', {
                      href: tweet,
                      rel: 'noopener noreferrer',
                      target: '_blank',
                      className:
                        'text-white rounded-md inline-flex items-center px-3 py-2',
                      style: {
                        background: '#2c90dc',
                      },
                      children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(
                          TwitterIcon,
                          {},
                        ),
                        ' ',
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(
                          'span',
                          {
                            className: 'pl-2 font-medium',
                            children: 'Share with your friends!',
                          },
                        ),
                      ],
                    }),
                  ],
                }),
              ],
            },
          )

        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(
          layouts__WEBPACK_IMPORTED_MODULE_1__ /* .default */.Z,
          {
            meta: {
              title: 'Thank you!',
            },
            children: /*#__PURE__*/ (0,
            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)('div', {
              className: 'max-w-screen-sm mx-auto',
              children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(
                  react_markdown__WEBPACK_IMPORTED_MODULE_4___default(),
                  {
                    children: instructionText,
                    className: 'prose dark:prose-dark lg:prose-lg max-w-none',
                  },
                ),
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx(
                  Share,
                  {},
                ),
              ],
            }),
          },
        )
      }

      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ThanksPage
      const getServerSideProps = async ({query}) => {
        const {email, session_id} = query
        let displayEmail = email

        if (!displayEmail && session_id) {
          const session = await (0,
          _skillrecordings_stripe__WEBPACK_IMPORTED_MODULE_5__.fetchStripeCheckoutSession)(
            session_id,
          )
          displayEmail = lodash_get__WEBPACK_IMPORTED_MODULE_3___default()(
            session,
            'customer.email',
          )
        }

        return {
          props: {
            displayEmail: displayEmail || '',
          },
        }
      }

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

    /***/ 762: /***/ (module) => {
      module.exports = require('framer-motion')

      /***/
    },

    /***/ 3804: /***/ (module) => {
      module.exports = require('lodash')

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

    /***/ 3946: /***/ (module) => {
      module.exports = require('lodash/isString')

      /***/
    },

    /***/ 6355: /***/ (module) => {
      module.exports = require('lodash/reduce')

      /***/
    },

    /***/ 2364: /***/ (module) => {
      module.exports = require('next-seo')

      /***/
    },

    /***/ 9325: /***/ (module) => {
      module.exports = require('next/dist/server/denormalize-page-path.js')

      /***/
    },

    /***/ 5378: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/i18n/normalize-locale-path.js')

      /***/
    },

    /***/ 7162: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/mitt.js')

      /***/
    },

    /***/ 8773: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router-context.js')

      /***/
    },

    /***/ 2248: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router/utils/get-asset-path-from-route.js')

      /***/
    },

    /***/ 9372: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router/utils/is-dynamic.js')

      /***/
    },

    /***/ 665: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router/utils/parse-relative-url.js')

      /***/
    },

    /***/ 2747: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router/utils/querystring.js')

      /***/
    },

    /***/ 333: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router/utils/route-matcher.js')

      /***/
    },

    /***/ 3456: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/router/utils/route-regex.js')

      /***/
    },

    /***/ 7620: /***/ (module) => {
      module.exports = require('next/dist/shared/lib/utils.js')

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

    /***/ 3703: /***/ (module) => {
      module.exports = require('react-markdown')

      /***/
    },

    /***/ 5282: /***/ (module) => {
      module.exports = require('react/jsx-runtime')

      /***/
    },

    /***/ 464: /***/ (module) => {
      module.exports = require('stripe')

      /***/
    },

    /***/ 2043: /***/ (module) => {
      module.exports = require('xstate')

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
    [800, 345, 676, 106, 667, 383, 587, 187],
    () => __webpack_exec__(7586),
  )
  module.exports = __webpack_exports__
})()
