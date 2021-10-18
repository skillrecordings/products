'use strict'
exports.id = 106
exports.ids = [106]
exports.modules = {
  /***/ 4106: /***/ function (
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
    exports.eggheadAxios = exports.convertkitAxios = void 0
    var axios_1 = __importDefault(__webpack_require__(2376))
    var config_1 = __webpack_require__(2519)
    exports.convertkitAxios = axios_1['default'].create({
      baseURL: config_1.CONVERTKIT_BASE_URL,
    })
    exports.eggheadAxios = axios_1['default'].create({
      baseURL: config_1.AUTH_DOMAIN,
    })
    axios_1['default'].interceptors.request.use(
      function (config) {
        var authToken =
          typeof localStorage !== 'undefined'
            ? localStorage.getItem(config_1.ACCESS_TOKEN_KEY)
            : null
        var defaultHeaders = authToken
          ? {
              Authorization: 'Bearer ' + authToken,
              'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID,
            }
          : {'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID}
        var headers = __assign(__assign({}, defaultHeaders), config.headers)
        return __assign(__assign({}, config), {headers: headers})
      },
      function (error) {
        return Promise.reject(error)
      },
    )
    exports.default = axios_1['default']

    /***/
  },

  /***/ 2519: /***/ (__unused_webpack_module, exports) => {
    exports.__esModule = true
    exports.VIEWING_AS_USER_KEY =
      exports.EXPIRES_AT_KEY =
      exports.ACCESS_TOKEN_KEY =
      exports.USER_KEY =
      exports.CONVERTKIT_SUBSCRIBE_API_URL =
      exports.CONVERTKIT_SIGNUP_FORM =
      exports.CONVERTKIT_TOKEN =
      exports.CONVERTKIT_API_SECRET =
      exports.CONVERTKIT_BASE_URL =
      exports.CK_SUBSCRIBER_KEY =
      exports.AUTH_REDIRECT_URL =
      exports.AUTH_CLIENT_ID =
      exports.AUTH_DOMAIN =
        void 0
    exports.AUTH_DOMAIN = 'https://app.egghead.io'
    exports.AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID
    exports.AUTH_REDIRECT_URL = 'https://rustadventure.dev'
    exports.CK_SUBSCRIBER_KEY = 'ck_subscriber_id' || 0
    exports.CONVERTKIT_BASE_URL =
      process.env.CONVERTKIT_BASE_URL || 'https://api.convertkit.com/v3/'
    exports.CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET
    exports.CONVERTKIT_TOKEN = '1FReP6d6e79X7Ttl8qyKmQ'
    exports.CONVERTKIT_SIGNUP_FORM = '2410348'
    exports.CONVERTKIT_SUBSCRIBE_API_URL =
      process.env.NEXT_PUBLIC_SUBSCRIBE_API_URL || '/api/convertkit/subscribe'
    // TODO: create unique keys for site authorization
    exports.USER_KEY = process.env.NEXT_PUBLIC_USER_KEY || 'user'
    exports.ACCESS_TOKEN_KEY =
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || 'access_token'
    exports.EXPIRES_AT_KEY =
      process.env.NEXT_PUBLIC_EXPIRES_AT_KEY || 'expires_at'
    exports.VIEWING_AS_USER_KEY =
      process.env.NEXT_PUBLIC_VIEWING_AS_USER_KEY || 'viewing_as_user'

    /***/
  },
}
