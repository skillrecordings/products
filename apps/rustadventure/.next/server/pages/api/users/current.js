'use strict'
;(() => {
  var exports = {}
  exports.id = 859
  exports.ids = [859]
  exports.modules = {
    /***/ 8787: /***/ (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__,
    ) => {
      __webpack_require__.r(__webpack_exports__)
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */
      })
      /* harmony import */ var _skillrecordings_auth_dist_api_current_user__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(8590)
      /* harmony import */ var _skillrecordings_auth_dist_api_current_user__WEBPACK_IMPORTED_MODULE_0___default =
        /*#__PURE__*/ __webpack_require__.n(
          _skillrecordings_auth_dist_api_current_user__WEBPACK_IMPORTED_MODULE_0__,
        )

      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ =
        _skillrecordings_auth_dist_api_current_user__WEBPACK_IMPORTED_MODULE_0___default()

      /***/
    },

    /***/ 8590: /***/ function (
      __unused_webpack_module,
      exports,
      __webpack_require__,
    ) {
      var __awaiter =
        (this && this.__awaiter) ||
        function (thisArg, _arguments, P, generator) {
          function adopt(value) {
            return value instanceof P
              ? value
              : new P(function (resolve) {
                  resolve(value)
                })
          }
          return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
              try {
                step(generator.next(value))
              } catch (e) {
                reject(e)
              }
            }
            function rejected(value) {
              try {
                step(generator['throw'](value))
              } catch (e) {
                reject(e)
              }
            }
            function step(result) {
              result.done
                ? resolve(result.value)
                : adopt(result.value).then(fulfilled, rejected)
            }
            step(
              (generator = generator.apply(thisArg, _arguments || [])).next(),
            )
          })
        }
      var __generator =
        (this && this.__generator) ||
        function (thisArg, body) {
          var _ = {
              label: 0,
              sent: function () {
                if (t[0] & 1) throw t[1]
                return t[1]
              },
              trys: [],
              ops: [],
            },
            f,
            y,
            t,
            g
          return (
            (g = {next: verb(0), throw: verb(1), return: verb(2)}),
            typeof Symbol === 'function' &&
              (g[Symbol.iterator] = function () {
                return this
              }),
            g
          )
          function verb(n) {
            return function (v) {
              return step([n, v])
            }
          }
          function step(op) {
            if (f) throw new TypeError('Generator is already executing.')
            while (_)
              try {
                if (
                  ((f = 1),
                  y &&
                    (t =
                      op[0] & 2
                        ? y['return']
                        : op[0]
                        ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                        : y.next) &&
                    !(t = t.call(y, op[1])).done)
                )
                  return t
                if (((y = 0), t)) op = [op[0] & 2, t.value]
                switch (op[0]) {
                  case 0:
                  case 1:
                    t = op
                    break
                  case 4:
                    _.label++
                    return {value: op[1], done: false}
                  case 5:
                    _.label++
                    y = op[1]
                    op = [0]
                    continue
                  case 7:
                    op = _.ops.pop()
                    _.trys.pop()
                    continue
                  default:
                    if (
                      !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                      (op[0] === 6 || op[0] === 2)
                    ) {
                      _ = 0
                      continue
                    }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                      _.label = op[1]
                      break
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                      _.label = t[1]
                      t = op
                      break
                    }
                    if (t && _.label < t[2]) {
                      _.label = t[2]
                      _.ops.push(op)
                      break
                    }
                    if (t[2]) _.ops.pop()
                    _.trys.pop()
                    continue
                }
                op = body.call(thisArg, _)
              } catch (e) {
                op = [6, e]
                y = 0
              } finally {
                f = t = 0
              }
            if (op[0] & 5) throw op[1]
            return {value: op[0] ? op[1] : void 0, done: true}
          }
        }
      var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
          return mod && mod.__esModule ? mod : {default: mod}
        }
      exports.__esModule = true
      var axios_1 = __importDefault(__webpack_require__(2376))
      var __1 = __webpack_require__(2667)
      var config_1 = __webpack_require__(2519)
      function getDevAccessToken() {
        if (false) {
        }
      }
      var current = function (req, res) {
        return __awaiter(void 0, void 0, void 0, function () {
          var eggheadToken, devToken, domain, token
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                eggheadToken = __1.getTokenFromCookieHeaders(
                  req.headers.cookie,
                ).eggheadToken
                devToken = getDevAccessToken()
                if (!(req.method === 'GET' && eggheadToken))
                  return [3 /*break*/, 2]
                domain = devToken
                  ? 'https://app.egghead.io/'
                  : config_1.AUTH_DOMAIN
                token = devToken ? devToken : eggheadToken
                return [
                  4 /*yield*/,
                  axios_1['default']
                    .get(
                      domain +
                        '/api/v1/users/current?minimal=' +
                        (req.query.minimal === 'true'),
                      {
                        headers: {
                          Authorization: 'Bearer ' + token,
                        },
                      },
                    )
                    .then(function (_a) {
                      var data = _a.data
                      if (devToken) {
                        console.info(
                          'Fetched ' + data.email + ' with access token',
                        )
                      }
                      res.setHeader(
                        'Cache-Control',
                        'max-age=1, stale-while-revalidate',
                      )
                      res.status(200).json(data)
                    })
                    ['catch'](function (error) {
                      console.error(error)
                      res
                        .status(error.response.status)
                        .end(error.response.statusText)
                    }),
                ]
              case 1:
                _a.sent()
                return [3 /*break*/, 3]
              case 2:
                res.status(200).end()
                _a.label = 3
              case 3:
                return [2 /*return*/]
            }
          })
        })
      }
      exports.default = current

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

    /***/ 2566: /***/ (module) => {
      module.exports = require('lodash/get')

      /***/
    },

    /***/ 3946: /***/ (module) => {
      module.exports = require('lodash/isString')

      /***/
    },
  }
  // load runtime
  var __webpack_require__ = require('../../../webpack-runtime.js')
  __webpack_require__.C(exports)
  var __webpack_exec__ = (moduleId) =>
    __webpack_require__((__webpack_require__.s = moduleId))
  var __webpack_exports__ = __webpack_require__.X(0, [800, 106, 667], () =>
    __webpack_exec__(8787),
  )
  module.exports = __webpack_exports__
})()
