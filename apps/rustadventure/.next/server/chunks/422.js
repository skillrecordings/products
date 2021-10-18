'use strict'
exports.id = 422
exports.ids = [422]
exports.modules = {
  /***/ 7422: /***/ function (
    __unused_webpack_module,
    exports,
    __webpack_require__,
  ) {
    var __assign =
      (this && this.__assign) ||
      function () {
        __assign =
          Object.assign ||
          function (t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i]
              for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
            }
            return t
          }
        return __assign.apply(this, arguments)
      }
    var __createBinding =
      (this && this.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === undefined) k2 = k
            Object.defineProperty(o, k2, {
              enumerable: true,
              get: function () {
                return m[k]
              },
            })
          }
        : function (o, m, k, k2) {
            if (k2 === undefined) k2 = k
            o[k2] = m[k]
          })
    var __setModuleDefault =
      (this && this.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', {enumerable: true, value: v})
          }
        : function (o, v) {
            o['default'] = v
          })
    var __importStar =
      (this && this.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod
        var result = {}
        if (mod != null)
          for (var k in mod)
            if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k)
        __setModuleDefault(result, mod)
        return result
      }
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
          step((generator = generator.apply(thisArg, _arguments || [])).next())
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
    var fetch_egghead_user_1 = __importDefault(__webpack_require__(3365))
    var axios_1 = __webpack_require__(4106)
    var lodash_1 = __webpack_require__(3804)
    var serialize_convertkit_cookie_1 = __importDefault(
      __webpack_require__(3357),
    )
    var serverCookie = __importStar(__webpack_require__(8883))
    var config_1 = __webpack_require__(2519)
    var getConvertkitId = function (parsedCookie) {
      var result = config_1.CK_SUBSCRIBER_KEY
        ? parsedCookie[config_1.CK_SUBSCRIBER_KEY]
        : ''
      return result || ''
    }
    function getTokenFromCookieHeaders(serverCookies) {
      if (serverCookies === void 0) {
        serverCookies = ''
      }
      var parsedCookie = serverCookie.parse(serverCookies)
      var eggheadToken = parsedCookie[config_1.ACCESS_TOKEN_KEY] || ''
      var convertkitId = getConvertkitId(parsedCookie)
      return {
        convertkitId: convertkitId,
        eggheadToken: eggheadToken,
        loginRequired: eggheadToken.length <= 0,
      }
    }
    function fetchConvertkitSubscriberFromServerCookie(header) {
      return __awaiter(this, void 0, void 0, function () {
        var _a,
          convertkitId,
          eggheadToken,
          subscriber,
          eggheadUser,
          tags,
          ckCookie
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              if (!config_1.CONVERTKIT_API_SECRET)
                throw new Error('No Convertkit Secret Key Found')
              ;(_a = getTokenFromCookieHeaders(header)),
                (convertkitId = _a.convertkitId),
                (eggheadToken = _a.eggheadToken)
              if (!!convertkitId) return [3 /*break*/, 3]
              return [
                4 /*yield*/,
                fetch_egghead_user_1['default'](eggheadToken),
              ]
            case 1:
              eggheadUser = _b.sent()
              if (lodash_1.isEmpty(eggheadUser))
                throw new Error('unable to load convertkit subscriber')
              return [
                4 /*yield*/,
                axios_1.convertkitAxios
                  .get(
                    '/subscribers?api_secret=' +
                      config_1.CONVERTKIT_API_SECRET +
                      '&email_address=' +
                      eggheadUser.email,
                  )
                  .then(function (_a) {
                    var data = _a.data
                    return lodash_1.first(data.subscribers)
                  }),
              ]
            case 2:
              subscriber = _b.sent()
              return [3 /*break*/, 5]
            case 3:
              return [
                4 /*yield*/,
                axios_1.convertkitAxios
                  .get(
                    '/subscribers/' +
                      convertkitId +
                      '?api_secret=' +
                      config_1.CONVERTKIT_API_SECRET,
                  )
                  .then(function (_a) {
                    var data = _a.data
                    return data.subscriber
                  }),
              ]
            case 4:
              subscriber = _b.sent()
              _b.label = 5
            case 5:
              if (lodash_1.isEmpty(subscriber))
                throw new Error('no convertkit subscriber was loaded')
              return [
                4 /*yield*/,
                axios_1.convertkitAxios
                  .get(
                    '/subscribers/' +
                      subscriber.id +
                      '/tags?api_key=' +
                      config_1.CONVERTKIT_TOKEN,
                  )
                  .then(function (_a) {
                    var data = _a.data
                    return data.tags
                  }),
              ]
            case 6:
              tags = _b.sent()
              subscriber = __assign(__assign({}, subscriber), {tags: tags})
              ckCookie = serialize_convertkit_cookie_1['default'](subscriber.id)
              return [2 /*return*/, [subscriber, ckCookie]]
          }
        })
      })
    }
    exports.default = fetchConvertkitSubscriberFromServerCookie

    /***/
  },

  /***/ 3365: /***/ function (
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
          step((generator = generator.apply(thisArg, _arguments || [])).next())
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
    exports.__esModule = true
    var axios_1 = __webpack_require__(4106)
    function fetchEggheadUser(token) {
      return __awaiter(this, void 0, void 0, function () {
        var current
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [
                4 /*yield*/,
                axios_1.eggheadAxios.get('/api/v1/users/current?minimal=true', {
                  headers: {
                    Authorization: 'Bearer ' + token,
                  },
                }),
              ]
            case 1:
              current = _a.sent().data
              false && 0
              return [2 /*return*/, current]
          }
        })
      })
    }
    exports.default = fetchEggheadUser

    /***/
  },

  /***/ 3357: /***/ function (
    __unused_webpack_module,
    exports,
    __webpack_require__,
  ) {
    var __createBinding =
      (this && this.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === undefined) k2 = k
            Object.defineProperty(o, k2, {
              enumerable: true,
              get: function () {
                return m[k]
              },
            })
          }
        : function (o, m, k, k2) {
            if (k2 === undefined) k2 = k
            o[k2] = m[k]
          })
    var __setModuleDefault =
      (this && this.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', {enumerable: true, value: v})
          }
        : function (o, v) {
            o['default'] = v
          })
    var __importStar =
      (this && this.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod
        var result = {}
        if (mod != null)
          for (var k in mod)
            if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k)
        __setModuleDefault(result, mod)
        return result
      }
    exports.__esModule = true
    var serverCookie = __importStar(__webpack_require__(8883))
    var config_1 = __webpack_require__(2519)
    var serializeCookie = function (value, options) {
      if (config_1.CK_SUBSCRIBER_KEY) {
        return serverCookie.serialize(
          config_1.CK_SUBSCRIBER_KEY,
          value,
          options,
        )
      } else {
        console.error(
          'NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY is empty, please set it in your dot env file.',
        )
        return ''
      }
    }
    function serializeConvertkitCookie(subscriberId) {
      var hour = 3600000
      var oneYear = 365 * 24 * hour
      return serializeCookie(subscriberId, {
        secure: 'production' === 'production',
        httpOnly: true,
        path: '/',
        maxAge: oneYear,
      })
    }
    exports.default = serializeConvertkitCookie

    /***/
  },
}
