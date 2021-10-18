'use strict'
exports.id = 667
exports.ids = [667]
exports.modules = {
  /***/ 2538: /***/ function (
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
    exports.identify =
      exports.track =
      exports.getLocalUser =
      exports.ACCESS_TOKEN_KEY =
      exports.USER_KEY =
        void 0
    var lodash_1 = __webpack_require__(3804)
    var DEBUG_ANALYTICS = false
    exports.USER_KEY = process.env.NEXT_PUBLIC_USER_KEY || 'user'
    exports.ACCESS_TOKEN_KEY =
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || 'access_token'
    function getLocalUser() {
      if (typeof localStorage === 'undefined') {
        return
      }
      var user = localStorage.getItem(exports.USER_KEY)
      if (user) {
        return JSON.parse(user)
      }
    }
    exports.getLocalUser = getLocalUser
    var track = function (event, paramsOrCallback, callback) {
      return new Promise(function (resolve) {
        return __awaiter(void 0, void 0, void 0, function () {
          function politelyExit() {
            DEBUG_ANALYTICS && console.debug('TRACKED: ' + event)
            if (lodash_1.isFunction(callback) && !wasCalled) {
              wasCalled = true
              callback.apply(null, [event, wasCalled])
            }
            resolve(true)
          }
          var ahoy, wasCalled, viewer, params, timeout, store
          return __generator(this, function (_a) {
            ahoy = window.ahoy
            wasCalled = false
            viewer = getLocalUser()
            params = lodash_1.isFunction(paramsOrCallback)
              ? {}
              : paramsOrCallback
            timeout = 1250
            if (
              lodash_1.isUndefined(callback) &&
              lodash_1.isFunction(paramsOrCallback)
            ) {
              callback = paramsOrCallback
            }
            store = console.error
            console.error = function () {}
            setTimeout(politelyExit, timeout)
            console.error = store
            if (ahoy && lodash_1.isFunction(ahoy.track)) {
              ahoy.track(event, params)
            }
            if (window.fbq) {
              window.fbq('trackCustom', event, params)
            }
            if (window.ga) {
              window.ga('send', {
                hitType: 'event',
                eventAction: event,
              })
            }
            if (
              viewer &&
              !viewer.opted_out &&
              viewer.contact_id &&
              viewer.email &&
              window._cio &&
              lodash_1.isFunction(window._cio.track)
            ) {
              exports.identify(viewer)
              window._cio.track(event, params)
            }
            politelyExit()
            return [2 /*return*/]
          })
        })
      })
    }
    exports.track = track
    var identify = function (data, properties) {
      if (
        !data.opted_out &&
        data.email &&
        data.contact_id &&
        window._cio &&
        lodash_1.isFunction(window._cio.identify)
      ) {
        window._cio.identify(
          __assign(
            {
              id: data.contact_id,
              email: data.email,
              first_name: data.name,
              pro: data.is_pro,
              instructor: data.is_instructor,
              created_at: data.created_at,
              discord_id: data.discord_id,
              timezone: data.timezone,
            },
            properties,
          ),
        )
      }
      return Promise.resolve(data)
    }
    exports.identify = identify

    /***/
  },

  /***/ 7429: /***/ function (
    __unused_webpack_module,
    exports,
    __webpack_require__,
  ) {
    var __importDefault =
      (this && this.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : {default: mod}
      }
    exports.__esModule = true
    var cookies_1 = __importDefault(__webpack_require__(7965))
    var config_1 = __webpack_require__(2519)
    var getAccessTokenFromCookie = function () {
      var _a
      if (!config_1.ACCESS_TOKEN_KEY) return false
      var token = cookies_1['default'].get(config_1.ACCESS_TOKEN_KEY)
      if (token) {
        return token
      } else if (typeof localStorage !== 'undefined') {
        return (_a = localStorage.getItem(config_1.ACCESS_TOKEN_KEY)) !==
          null && _a !== void 0
          ? _a
          : false
      }
      return false
    }
    exports.default = getAccessTokenFromCookie

    /***/
  },

  /***/ 2667: /***/ function (
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
    var __importDefault =
      (this && this.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : {default: mod}
      }
    exports.__esModule = true
    exports.expirations =
      exports.getLocalUser =
      exports.getUser =
      exports.getTokenFromCookieHeaders =
      exports.getAuthorizationHeader =
      exports.getAccessTokenFromCookie =
        void 0
    var client_oauth2_1 = __importDefault(__webpack_require__(8652))
    var analytics_1 = __webpack_require__(2538)
    var axios_1 = __importDefault(__webpack_require__(4106))
    var get_1 = __importDefault(__webpack_require__(2566))
    var cookies_1 = __importDefault(__webpack_require__(7965))
    var serverCookie = __importStar(__webpack_require__(8883))
    var get_access_token_from_cookie_1 = __importDefault(
      __webpack_require__(7429),
    )
    var config_1 = __webpack_require__(2519)
    var get_access_token_from_cookie_2 = __webpack_require__(7429)
    __createBinding(
      exports,
      get_access_token_from_cookie_2,
      'default',
      'getAccessTokenFromCookie',
    )
    var getAuthorizationHeader = function () {
      var token = get_access_token_from_cookie_1['default']()
      var authorizationHeader = token && {
        Authorization: 'Bearer ' + token,
      }
      return authorizationHeader
    }
    exports.getAuthorizationHeader = getAuthorizationHeader
    function getTokenFromCookieHeaders(serverCookies) {
      if (serverCookies === void 0) {
        serverCookies = ''
      }
      var parsedCookie = serverCookie.parse(serverCookies)
      var eggheadToken = parsedCookie[config_1.ACCESS_TOKEN_KEY] || ''
      return {
        eggheadToken: eggheadToken,
        loginRequired: eggheadToken.length <= 0,
      }
    }
    exports.getTokenFromCookieHeaders = getTokenFromCookieHeaders
    var SIXTY_DAYS_IN_SECONDS = JSON.stringify(60 * 24 * 60 * 60)
    function getUser() {
      return getLocalUser()
    }
    exports.getUser = getUser
    function getLocalUser() {
      if (typeof localStorage === 'undefined') {
        return
      }
      var user = localStorage.getItem(config_1.USER_KEY)
      if (user) {
        return JSON.parse(user)
      }
    }
    exports.getLocalUser = getLocalUser
    function expirations(expiresInSeconds, now) {
      var millisecondsInASecond = 1000
      var expiresAt = Number(expiresInSeconds) * millisecondsInASecond + now
      var millisecondsInADay = 60 * 60 * 24 * 1000
      var expiresInDays = Math.floor((expiresAt - now) / millisecondsInADay)
      return {expiresAt: expiresAt, expiresInDays: expiresInDays}
    }
    exports.expirations = expirations
    var Auth = /** @class */ (function () {
      function Auth(redirectUri) {
        this.eggheadAuth = new client_oauth2_1['default']({
          clientId: config_1.AUTH_CLIENT_ID,
          authorizationUri: config_1.AUTH_DOMAIN + '/oauth/authorize',
          accessTokenUri: config_1.AUTH_DOMAIN + '/oauth/token',
          redirectUri: redirectUri || config_1.AUTH_REDIRECT_URL,
        })
        this.requestSignInEmail = this.requestSignInEmail.bind(this)
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.handleAuthentication = this.handleAuthentication.bind(this)
        this.handleCookieBasedAccessTokenAuthentication =
          this.handleCookieBasedAccessTokenAuthentication.bind(this)
        this.isAuthenticated = this.isAuthenticated.bind(this)
        this.refreshUser = this.refreshUser.bind(this)
        this.monitor = this.monitor.bind(this)
        this.getViewingAsUser = this.getViewingAsUser.bind(this)
        this.becomeUser = this.becomeUser.bind(this)
      }
      Auth.prototype.becomeUser = function (email, accessToken) {
        var _this = this
        if (typeof localStorage === 'undefined') {
          return
        }
        accessToken =
          accessToken !== null && accessToken !== void 0
            ? accessToken
            : get_access_token_from_cookie_1['default']()
        return axios_1['default']
          .post(
            config_1.AUTH_DOMAIN +
              '/api/v1/users/become_user?email=' +
              email +
              '&client_id=' +
              config_1.AUTH_CLIENT_ID,
            {},
            {
              headers: {
                Authorization: 'Bearer ' + accessToken,
              },
            },
          )
          .then(function (_a) {
            var data = _a.data
            var expiresAt = JSON.stringify(
              data.access_token.expires_in * 1000 + new Date().getTime(),
            )
            var user = data.user
            localStorage.setItem(
              config_1.ACCESS_TOKEN_KEY,
              data.access_token.token,
            )
            localStorage.setItem(config_1.EXPIRES_AT_KEY, expiresAt)
            localStorage.setItem(config_1.USER_KEY, JSON.stringify(user))
            localStorage.setItem(
              config_1.VIEWING_AS_USER_KEY,
              get_1['default'](user, 'email'),
            )
            if (user.contact_id) {
              cookies_1['default'].set('cio_id', user.contact_id)
            }
            cookies_1['default'].set(
              config_1.ACCESS_TOKEN_KEY,
              data.access_token.token,
              {
                expires: parseInt(expiresAt, 10),
              },
            )
            return user
          })
          ['catch'](function (_) {
            _this.logout()
          })
      }
      Auth.prototype.requestSignInEmail = function (email) {
        return axios_1['default'].post(
          'https://app.egghead.io' + '/api/v1/users/send_token',
          {
            email: email,
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            redirect_uri: config_1.AUTH_REDIRECT_URL,
          },
        )
      }
      Auth.prototype.login = function () {
        window.open(this.eggheadAuth.token.getUri())
        analytics_1.track('logged in')
      }
      Auth.prototype.logout = function () {
        var _this = this
        return new Promise(function (resolve) {
          analytics_1.track('logged out')
          resolve(_this.clearLocalStorage())
        })
      }
      Auth.prototype.monitor = function (onInterval, delay) {
        if (delay === void 0) {
          delay = 2000
        }
        if (this.isAuthenticated()) {
          return window.setInterval(onInterval, delay)
        } else {
          return 0
        }
      }
      Auth.prototype.handleCookieBasedAccessTokenAuthentication = function (
        accessToken,
        expiresInSeconds,
      ) {
        // handle any previous location redirects here
        if (expiresInSeconds === void 0) {
          expiresInSeconds = SIXTY_DAYS_IN_SECONDS
        }
        // @ts-ignore
        return this.handleNewSession(accessToken, expiresInSeconds)['catch'](
          function (e) {
            if (e.isAxiosError && e.response.status === 403) {
              // do nothing, logout has been called to clear local session data
            } else {
              return Promise.reject(e)
            }
          },
        )
      }
      Auth.prototype.handleNewSession = function (
        accessToken,
        expiresInSeconds,
      ) {
        var _this = this
        if (expiresInSeconds === void 0) {
          expiresInSeconds = SIXTY_DAYS_IN_SECONDS
        }
        return new Promise(function (resolve, reject) {
          _this.setSession(accessToken, expiresInSeconds).then(
            function (user) {
              analytics_1.identify(user)
              resolve(user)
            },
            function (error) {
              console.error(error)
              _this.logout().then(function () {
                return reject(error)
              })
            },
          )
        })
      }
      Auth.prototype.handleAuthentication = function () {
        var _this = this
        return new Promise(function (resolve, reject) {
          if (typeof localStorage === 'undefined') {
            reject('no localstorage')
          }
          if (typeof window !== 'undefined') {
            var uri = window.location.href
            window.history.pushState(
              '',
              document.title,
              window.location.pathname + window.location.search,
            )
            _this.eggheadAuth.token.getToken(uri).then(
              function (authResult) {
                var user = _this.handleNewSession(
                  authResult.accessToken,
                  authResult.data.expires_in,
                )
                resolve(user)
              },
              function (error) {
                console.error(error)
                _this.logout().then(function () {
                  return reject(error)
                })
              },
            )
          }
        })
      }
      Auth.prototype.clearLocalStorage = function () {
        return new Promise(function (resolve, _) {
          var removeLocalStorage = function () {
            cookies_1['default'].remove(config_1.ACCESS_TOKEN_KEY, {})
            if (typeof localStorage !== 'undefined') {
              localStorage.removeItem(config_1.ACCESS_TOKEN_KEY)
              localStorage.removeItem(config_1.EXPIRES_AT_KEY)
              localStorage.removeItem(config_1.USER_KEY)
              localStorage.removeItem(config_1.VIEWING_AS_USER_KEY)
            }
            return resolve(true)
          }
          return removeLocalStorage()
        })
      }
      Auth.prototype.isAuthenticated = function () {
        if (
          typeof localStorage === 'undefined' ||
          typeof window === 'undefined'
        ) {
          return
        }
        var storedExpiration =
          localStorage.getItem(config_1.EXPIRES_AT_KEY) || '0'
        var expiresAt = JSON.parse(storedExpiration)
        var expired = new Date().getTime() > expiresAt
        if (expiresAt > 0 && expired) {
          this.logout()
        }
        return !expired
      }
      Auth.prototype.refreshUser = function (minimalUser) {
        var _this = this
        if (minimalUser === void 0) {
          minimalUser = true
        }
        return new Promise(function (resolve, reject) {
          if (typeof localStorage === 'undefined') {
            reject('no local storage')
          }
          axios_1['default']
            .get('/api/users/current?minimal=' + minimalUser)
            .then(function (_a) {
              var data = _a.data
              if (!_this.isAuthenticated()) {
                return reject('not authenticated')
              }
              if (data) analytics_1.identify(data)
              if (data.contact_id) {
                cookies_1['default'].set('cio_id', data.contact_id)
              }
              localStorage.setItem(config_1.USER_KEY, JSON.stringify(data))
              resolve(data)
            })
            ['catch'](function (error) {
              _this.logout().then(function () {
                return reject(error)
              })
            })
        })
      }
      Auth.prototype.setSession = function (accessToken, expiresInSeconds) {
        var _this = this
        if (expiresInSeconds === void 0) {
          expiresInSeconds = SIXTY_DAYS_IN_SECONDS
        }
        return new Promise(function (resolve, reject) {
          if (typeof localStorage === 'undefined') {
            reject('localStorage is not defined')
          }
          var now = new Date().getTime()
          var _a = expirations(expiresInSeconds, now),
            expiresAt = _a.expiresAt,
            expiresInDays = _a.expiresInDays
          localStorage.setItem(config_1.ACCESS_TOKEN_KEY, accessToken)
          localStorage.setItem(
            config_1.EXPIRES_AT_KEY,
            JSON.stringify(expiresAt),
          )
          cookies_1['default'].set(config_1.ACCESS_TOKEN_KEY, accessToken, {
            expires: expiresInDays,
          })
          resolve(_this.refreshUser(true))
        })
      }
      Auth.prototype.getAuthToken = function () {
        if (typeof localStorage === 'undefined') {
          return
        }
        if (this.isAuthenticated()) {
          return cookies_1['default'].get(config_1.ACCESS_TOKEN_KEY)
        }
      }
      Auth.prototype.getUser = function () {
        return getLocalUser()
      }
      Auth.prototype.getLocalUser = function () {
        return getLocalUser()
      }
      Auth.prototype.getUserName = function () {
        if (getLocalUser()) {
          return getLocalUser().name
        }
      }
      Auth.prototype.getViewingAsUser = function () {
        if (typeof localStorage === 'undefined') {
          return
        }
        return localStorage.getItem(config_1.VIEWING_AS_USER_KEY)
      }
      return Auth
    })()
    exports.default = Auth

    /***/
  },

  /***/ 7965: /***/ function (
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
    var __importDefault =
      (this && this.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : {default: mod}
      }
    exports.__esModule = true
    var js_cookie_1 = __importDefault(__webpack_require__(9800))
    var isString_1 = __importDefault(__webpack_require__(3946))
    var cookieUtil = {
      set: function (name, value, options) {
        if (options === void 0) {
          options = {}
        }
        var use_secure_cookie = window.location.protocol === 'https:'
        js_cookie_1['default'].set(
          name,
          isString_1['default'](value) ? value : JSON.stringify(value),
          __assign(
            {secure: use_secure_cookie, path: '/', expires: 365},
            options,
          ),
        )
        return this.get(name)
      },
      get: function (name) {
        var value = js_cookie_1['default'].get(name)
        try {
          return JSON.parse(value)
        } catch (e) {
          return value
        }
      },
      remove: function (name, options) {
        if (options === void 0) {
          options = {}
        }
        js_cookie_1['default'].remove(name, options)
      },
    }
    exports.default = cookieUtil

    /***/
  },
}
