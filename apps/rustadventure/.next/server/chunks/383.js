'use strict'
exports.id = 383
exports.ids = [383]
exports.modules = {
  /***/ 8118: /***/ (
    __unused_webpack_module,
    __webpack_exports__,
    __webpack_require__,
  ) => {
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
      /* harmony export */ Z: () => __WEBPACK_DEFAULT_EXPORT__,
      /* harmony export */
    })
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = {
      defaultTitle: 'Rust Adventure',
      description: 'Rust Adventure',
      author: 'Chris Biscardi',
      favicon: '/favicon.ico',
      email: 'team@rustadventure.dev',
      siteUrl: 'rustadventure.dev',
      additionalMetaTags: [
        {
          property: 'author',
          content: 'Chris Biscardi',
        },
        {
          property: 'keywords',
          content:
            'rust, rustlang, adventure, programming, rustlings, concepts, learn rust, learn',
        },
      ],
      twitter: {
        cardType: 'summary_large_image',
        handle: '@chrisbiscardi',
      },
      openGraph: {
        type: 'website',
        site_name: 'Rust Adventure',
        profile: {
          firstName: 'Chris',
          lastName: 'Biscardi',
        },
        images: [
          {
            url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1627473990/rustadventure.dev/card_2x.png',
            width: 1280,
            height: 720,
          },
        ],
      },
    }

    /***/
  },

  /***/ 5188: /***/ function (
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
    exports.ViewerProvider = exports.ViewerContext = exports.useViewer = void 0
    var react_1 = __importDefault(__webpack_require__(9297))
    var get_1 = __importDefault(__webpack_require__(2566))
    var filter_1 = __importDefault(__webpack_require__(4105))
    var reduce_1 = __importDefault(__webpack_require__(6355))
    var first_1 = __importDefault(__webpack_require__(9741))
    var find_1 = __importDefault(__webpack_require__(3935))
    var get_bundles_1 = __importDefault(__webpack_require__(9075))
    var sort_purchases_1 = __webpack_require__(602)
    var viewer_1 = __importDefault(__webpack_require__(3613))
    var utils_1 = __webpack_require__(6011)
    var react_2 = __webpack_require__(7295)
    var defaultViewerContext = {
      authenticated: false,
    }
    function useViewer() {
      return react_1['default'].useContext(exports.ViewerContext)
    }
    exports.useViewer = useViewer
    exports.ViewerContext =
      react_1['default'].createContext(defaultViewerContext)
    function useAuthedViewer() {
      var _a = react_2.useMachine(viewer_1['default']),
        machineState = _a[0],
        send = _a[1]
      var viewerState = machineState.value
      var viewer = machineState.context.viewer
      var viewAsEmail = machineState.context.viewAsUser
      react_1['default'].useEffect(function () {
        window.becomeUser = utils_1.auth.becomeUser
      }, [])
      var allPurchases = get_1['default'](viewer, 'purchased') || []
      var sitePurchases = filter_1['default'](allPurchases, {
        site: process.env.NEXT_PUBLIC_SITE_NAME,
      }).sort(sort_purchases_1.sortPurchases)
      var bestPurchase = first_1['default'](sitePurchases)
      var availableUpgrades =
        bestPurchase === null || bestPurchase === void 0
          ? void 0
          : bestPurchase.available_upgrades
      var nextUpgrade = first_1['default'](availableUpgrades) // we only sell one upgrade
      var siteSellables = get_bundles_1['default']()
      var upgradeFromSellable =
        get_1['default'](bestPurchase, 'slug') ===
          process.env.NEXT_PUBLIC_PRO_SLUG &&
        !get_1['default'](bestPurchase, 'coupon.region_restricted', false)
          ? null
          : bestPurchase
      var upgradeToSellable = nextUpgrade
        ? find_1['default'](siteSellables, {slug: nextUpgrade.slug}) // must add bundles for this to work
        : null
      var canViewContent = reduce_1['default'](
        sitePurchases,
        function (canViewContent, currentPurchase) {
          if (canViewContent) {
            return canViewContent
          }
          return get_1['default'](currentPurchase, 'bulk', false) !== true
        },
        false,
      )
      var isUnclaimedBulkPurchaser = !canViewContent && sitePurchases.length > 0
      // console.log(machineState)
      var values = react_1['default'].useMemo(
        function () {
          return {
            viewer: viewer,
            sitePurchases: sitePurchases,
            logout: function () {
              return send('LOG_OUT')
            },
            isAuthenticated: machineState.matches('loggedIn'),
            requestSignInEmail: function (email) {
              return new Promise(function (resolve) {
                send('REQUEST_LOGIN', {email: email})
                resolve(email)
              })
            },
            viewerState: viewerState,
            viewAsEmail: viewAsEmail,
            upgradeFromSellable: upgradeFromSellable,
            upgradeToSellable: upgradeToSellable,
            isUnclaimedBulkPurchaser: isUnclaimedBulkPurchaser,
            refreshViewer: function () {
              if (machineState.matches('loggedIn')) {
                send('REFRESH_VIEWER')
              }
            },
          }
        },
        [
          viewer === null || viewer === void 0 ? void 0 : viewer.id,
          viewerState,
        ],
      )
      return values
    }
    var ViewerProvider = function (_a) {
      var children = _a.children
      var values = useAuthedViewer()
      return react_1['default'].createElement(
        exports.ViewerContext.Provider,
        {value: __assign({}, values)},
        children,
      )
    }
    exports.ViewerProvider = ViewerProvider

    /***/
  },

  /***/ 4965: /***/ function (
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
    exports.__esModule = true
    exports.useViewer = exports.ViewerProvider = exports.ViewerContext = void 0
    var viewer_context_1 = __webpack_require__(5188)
    __createBinding(exports, viewer_context_1, 'ViewerContext')
    __createBinding(exports, viewer_context_1, 'ViewerProvider')
    __createBinding(exports, viewer_context_1, 'useViewer')

    /***/
  },

  /***/ 3613: /***/ function (
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
    var __importDefault =
      (this && this.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : {default: mod}
      }
    exports.__esModule = true
    exports.viewerMachine = void 0
    var xstate_1 = __webpack_require__(2043)
    var analytics_1 = __webpack_require__(2538)
    var isEmpty_1 = __importDefault(__webpack_require__(8718))
    var isEqual_1 = __importDefault(__webpack_require__(6414))
    var get_1 = __importDefault(__webpack_require__(2566))
    var query_string_1 = __importDefault(__webpack_require__(1366))
    var is_browser_1 = __webpack_require__(4777)
    var utils_1 = __webpack_require__(6011)
    exports.viewerMachine = xstate_1.createMachine(
      {
        id: 'viewerAuthentication',
        initial: 'checkingIfLoggedIn',
        context: {
          viewer: undefined,
          viewAsUser: undefined,
          error: undefined,
        },
        states: {
          checkingIfLoggedIn: {
            invoke: {
              src: 'checkIfLoggedIn',
              onError: {
                target: 'loggedOut',
              },
            },
            on: {
              REPORT_IS_LOGGED_IN: {
                target: 'loggedIn',
                actions: 'assignViewerToContext',
              },
              REPORT_IS_LOGGED_OUT: 'loggedOut',
            },
          },
          loggedIn: {
            entry: ['identify', 'navigate'],
            on: {
              LOG_OUT: {
                target: 'loggedOut',
              },
            },
            initial: 'stable',
            states: {
              stable: {
                on: {
                  REFRESH_VIEWER: {
                    target: 'refreshing',
                  },
                },
              },
              refreshing: {
                invoke: {src: 'refreshViewer'},
                on: {
                  REPORT_REFRESHED_VIEWER: {
                    target: 'stable',
                    actions: 'assignViewerToContext',
                  },
                },
              },
            },
          },
          loggedOut: {
            entry: ['clearViewerFromContext', 'clearStorage', 'navigate'],
            invoke: {
              src: 'loggedOutInterval',
            },
            on: {
              LOG_IN: {
                target: 'loggedIn',
                actions: 'assignViewerToContext',
              },
              REQUEST_LOGIN: {
                actions: 'sendLoginRequest',
              },
            },
          },
        },
      },
      {
        services: {
          refreshViewer: function (_context, _event) {
            return function (send, _onReceive) {
              return __awaiter(void 0, void 0, void 0, function () {
                var newViewer, e_1
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      _a.trys.push([0, 2, , 3])
                      return [
                        4 /*yield*/,
                        utils_1.fetchViewer({
                          refreshViewer: true,
                        }),
                      ]
                    case 1:
                      newViewer = _a.sent()
                      send({
                        type: 'REPORT_REFRESHED_VIEWER',
                        viewer: newViewer,
                      })
                      return [3 /*break*/, 3]
                    case 2:
                      e_1 = _a.sent()
                      send({type: 'LOG_OUT'})
                      return [3 /*break*/, 3]
                    case 3:
                      return [2 /*return*/]
                  }
                })
              })
            }
          },
          loggedOutInterval: function (context, _event) {
            return function (send, _onReceive) {
              var id = utils_1.auth.monitor(function () {
                var newViewer = utils_1.auth.getLocalUser()
                if (
                  !isEmpty_1['default'](newViewer) &&
                  !isEqual_1['default'](newViewer, context.viewer)
                ) {
                  send({type: 'LOG_IN', viewer: newViewer})
                }
              })
              return function () {
                return clearInterval(id)
              }
            }
          },
          checkIfLoggedIn: function (_context, _event) {
            return function (send, _onReceive) {
              return __awaiter(void 0, void 0, void 0, function () {
                var queryHash,
                  accessToken,
                  querySearch,
                  viewAsUser,
                  newViewer,
                  e_2
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      _a.trys.push([0, 2, , 3])
                      queryHash = query_string_1['default'].parse(
                        window.location.hash,
                      )
                      accessToken = utils_1.getAccessToken(queryHash)
                      querySearch = query_string_1['default'].parse(
                        window.location.search,
                      )
                      viewAsUser = get_1['default'](querySearch, 'show-as-user')
                      return [
                        4 /*yield*/,
                        utils_1.fetchViewer({
                          accessToken: accessToken,
                          viewAsUser: viewAsUser,
                        }),
                      ]
                    case 1:
                      newViewer = _a.sent()
                      if (isEmpty_1['default'](newViewer))
                        return [
                          2 /*return*/,
                          send({type: 'REPORT_IS_LOGGED_OUT'}),
                        ]
                      return [
                        2 /*return*/,
                        send({
                          type: 'REPORT_IS_LOGGED_IN',
                          viewer: newViewer,
                          viewAsUser: viewAsUser,
                        }),
                      ]
                    case 2:
                      e_2 = _a.sent()
                      console.error({e: e_2})
                      return [2 /*return*/, null]
                    case 3:
                      return [2 /*return*/]
                  }
                })
              })
            }
          },
        },
        actions: {
          sendLoginRequest: function (_context, event) {
            if (event.type === 'REQUEST_LOGIN') {
              utils_1.auth.requestSignInEmail(event.email)
            }
          },
          identify: function (context) {
            if (context.viewer) analytics_1.identify(context.viewer)
          },
          navigate: function (context, event) {
            if (!is_browser_1.isBrowser() || !context.viewer) {
              return
            }
            switch (event.type) {
              case 'REPORT_IS_LOGGED_IN': {
                if (window.location.pathname !== '/redirect') {
                  return
                }
                // TODO: set these paths
                if (utils_1.getIsUnclaimedBulkPurchaser(context.viewer)) {
                  window.location.replace('/invoice')
                } else if (
                  utils_1.getCanViewContent(context.viewer.purchased)
                ) {
                  window.location.replace('/')
                }
                return
              }
              case 'LOG_OUT': {
                window.location.replace('/login')
                return
              }
            }
          },
          assignViewerToContext: xstate_1.assign(function (_context, event) {
            if (
              event.type !== 'REPORT_IS_LOGGED_IN' &&
              event.type !== 'REPORT_REFRESHED_VIEWER'
            ) {
              return {}
            }
            return {
              viewer: event.viewer,
              viewAsUser: event.viewAsUser,
            }
          }),
          clearViewerFromContext: xstate_1.assign(function (_context, _event) {
            return {
              viewer: undefined,
              viewAsUser: undefined,
              error: undefined,
            }
          }),
          clearStorage: function () {
            utils_1.auth.logout()
          },
        },
      },
    )
    exports.default = exports.viewerMachine

    /***/
  },

  /***/ 6011: /***/ function (
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
    var __importDefault =
      (this && this.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : {default: mod}
      }
    exports.__esModule = true
    exports.getIsUnclaimedBulkPurchaser =
      exports.getCanViewContent =
      exports.fetchViewer =
      exports.getAccessToken =
      exports.auth =
        void 0
    var get_1 = __importDefault(__webpack_require__(2566))
    var filter_1 = __importDefault(__webpack_require__(4105))
    var reduce_1 = __importDefault(__webpack_require__(6355))
    var is_browser_1 = __webpack_require__(4777)
    var get_dev_access_token_1 = __importDefault(__webpack_require__(7412))
    var auth_1 = __importDefault(__webpack_require__(2667))
    exports.auth = new auth_1['default']()
    var getAccessToken = function (options) {
      var devAccessToken = get_dev_access_token_1['default']()
      return (
        devAccessToken ||
        (options === null || options === void 0 ? void 0 : options.access_token)
      )
    }
    exports.getAccessToken = getAccessToken
    function fetchViewer(_a) {
      var accessToken = _a.accessToken,
        viewAsUser = _a.viewAsUser,
        refreshViewer = _a.refreshViewer
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              if (!is_browser_1.isBrowser()) {
                return [
                  2 /*return*/,
                  Promise.reject('localstorage not available'),
                ]
              }
              if (!(viewAsUser && accessToken)) return [3 /*break*/, 2]
              return [
                4 /*yield*/,
                exports.auth.becomeUser(viewAsUser, accessToken),
              ]
            case 1:
              return [2 /*return*/, _b.sent()]
            case 2:
              if (!(window.location.pathname === '/redirect'))
                return [3 /*break*/, 4]
              return [4 /*yield*/, exports.auth.handleAuthentication()]
            case 3:
              return [2 /*return*/, _b.sent()]
            case 4:
              if (!refreshViewer) return [3 /*break*/, 6]
              return [4 /*yield*/, exports.auth.refreshUser()]
            case 5:
              return [2 /*return*/, _b.sent()]
            case 6:
              return [2 /*return*/, exports.auth.getLocalUser()]
          }
        })
      })
    }
    exports.fetchViewer = fetchViewer
    var getSitePurchases = function (viewer) {
      return filter_1['default'](get_1['default'](viewer, 'purchased', []), {
        site: process.env.NEXT_PUBLIC_SITE_NAME,
      })
    }
    var getCanViewContent = function (sitePurchases) {
      return reduce_1['default'](
        sitePurchases,
        function (canViewContent, currentPurchase) {
          return (
            canViewContent ||
            (currentPurchase === null || currentPurchase === void 0
              ? void 0
              : currentPurchase.bulk) === false
          )
        },
        false,
      )
    }
    exports.getCanViewContent = getCanViewContent
    var getIsUnclaimedBulkPurchaser = function (viewer) {
      var sitePurchases = getSitePurchases(viewer)
      var canViewContent = exports.getCanViewContent(sitePurchases)
      return !canViewContent && sitePurchases.length > 0
    }
    exports.getIsUnclaimedBulkPurchaser = getIsUnclaimedBulkPurchaser

    /***/
  },

  /***/ 9075: /***/ function (
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
    var bundles_development_json_1 = __importDefault(__webpack_require__(9061))
    var bundles_production_json_1 = __importDefault(__webpack_require__(1547))
    var getBundles = function () {
      return true ? bundles_production_json_1['default'] : 0
    }
    exports.default = getBundles

    /***/
  },

  /***/ 7412: /***/ (__unused_webpack_module, exports) => {
    exports.__esModule = true
    function getDevAccessToken() {
      if (false) {
      }
    }
    exports.default = getDevAccessToken

    /***/
  },

  /***/ 4777: /***/ (__unused_webpack_module, exports) => {
    exports.__esModule = true
    exports.isBrowser = void 0
    var isBrowser = function () {
      return typeof window !== 'undefined'
    }
    exports.isBrowser = isBrowser

    /***/
  },

  /***/ 602: /***/ (__unused_webpack_module, exports) => {
    exports.__esModule = true
    exports.sortPurchases = void 0
    var sortPurchases = function (purchase1, purchase2) {
      var _a
      var sellableSlug = process.env.NEXT_PUBLIC_PRO_SLUG
      var ranks = ((_a = {}), (_a[sellableSlug] = 1), _a)
      if (purchase1.upgraded_from_purchase_id) {
        return -1
      }
      if (purchase2.upgraded_from_purchase_id) {
        return 1
      }
      if (!ranks.hasOwnProperty(purchase1.slug) || purchase1.quantity > 1) {
        return 1
      }
      if (!ranks.hasOwnProperty(purchase2.slug) || purchase2.quantity > 1) {
        return -1
      }
      return ranks[purchase1.slug] - ranks[purchase2.slug]
    }
    exports.sortPurchases = sortPurchases
    var rankedPackages = function (packages) {
      if (packages === void 0) {
        packages = []
      }
      return packages.sort(exports.sortPurchases)
    }
    exports.default = rankedPackages

    /***/
  },

  /***/ 9061: /***/ (module) => {
    module.exports = JSON.parse(
      '[{"type":"playlist","id":336867,"title":"Pro Package","description":"Lorem ipsum dolor sit amet","slug":"pure-react-pro-07813b66","published":false,"updated_at":"2019-11-06T16:41:50.700-06:00","created_at":"2019-10-14T16:38:32.236-05:00","duration":85490,"state":"published","visibility_state":"hidden","tagline":null,"code_url":null,"access_state":"pro","published_at":"2019-10-14T16:38:32.236-05:00","free_forever":false,"summary":"Your guided path to React","primary_tag":{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"},"tags":[{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"}],"library_list":[],"language_list":[],"framework_list":["react"],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[],"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_480/react.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_280/react.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_256/react.png","square_cover_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_128/react.png","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_64/react.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/square_32/react.png","square_cover_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","square_cover_large_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/full/react.png","square_cover_landscape_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/landscape/react.png","url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-pro-07813b66","path":"/playlists/pure-react-pro-07813b66","http_url":"http://app.egghead.af:5000/playlists/pure-react-pro-07813b66","lessons_url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-pro-07813b66/items?flatten=true","items_url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-pro-07813b66/items?flatten=false","icon_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","tracklist_id":null,"is_watch_later":false,"first_lesson_path":"/lessons/javascript-write-concise-functions-with-es6-arrows-and-implicit-returns?pl=pure-react-pro-07813b66","full_price":349,"price":349,"favorited":false,"toggle_favorite_url":"http://app.egghead.af:5000/api/v1/playlists/336867/users/353304/toggle_save","items":[{"type":"playlist","id":432610,"title":"Lorem ipsum dolor sit amet","description":"Can\'t tell which parts of the code are React, and which are JavaScript? Before you can work effectively with modern frameworks like React, you\'ve gotta understand the language it\'s based on (or at least things will go much more smoothly if you do!). In this module you\'ll learn the essential syntax of modern JavaScript that\'s necessary to work with React.\\n\\nWe\'ll cover arrow functions and how they differ from regular functions, statements vs. expressions (which will come in handy when you start working with React\'s JSX syntax), and the ...rest and ...spread operators (two names for three dots that look the same). Then we\'ll get into immutability and why it matters (super important to understand for avoiding weird bugs in your apps). You\'ll learn how to use the map, filter, and reduce functions — those three paragons of functional programing — with a special focus on making sure you truly (finally!) understand the `reduce` function. And we\'ll close out by learning how to import and export modules.","slug":"modern-javascript-essentials-for-react","published":true,"updated_at":"2021-02-13T13:53:32.326-06:00","created_at":"2019-05-20T12:47:16.618-05:00","duration":2967,"state":"bundled","visibility_state":"hidden","tagline":null,"code_url":null,"access_state":"bundled","published_at":null,"free_forever":false,"summary":"Can\'t tell which parts of the code are React, and which are JavaScript? Before you can work effectively with modern frameworks like React, you\'ve gotta understand the language it\'s based on (or at least things will go much more smoothly if you do!). In this module you\'ll learn the essential syntax of modern JavaScript that\'s necessary to work with React.\\n\\nWe\'ll cover arrow functions and how they differ from regular functions, statements vs. expressions (which will come in handy when you start working with React\'s JSX syntax), and the ...rest and ...spread operators (two names for three dots that look the same). Then we\'ll get into immutability and why it matters (super important to understand for avoiding weird bugs in your apps). You\'ll learn how to use the map, filter, and reduce functions — those three paragons of functional programing — with a special focus on making sure you truly (finally!) understand the `reduce` function. And we\'ll close out by learning how to import and export modules.","primary_tag":{"name":"javascript","slug":"javascript","label":"JavaScript","context":"languages","description":"JavaScript® (often shortened to JS) is a lightweight, interpreted, object-oriented language with first-class functions, most known as the scripting language for Web pages, but used in many non-browser environments as well such as node.js or Apache CouchDB. It is a prototype-based, multi-paradigm scripting language that is dynamic, and supports object-oriented, imperative, and functional programming styles.","url":"http://app.egghead.af:5000/api/v1/tags/javascript","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/thumb/javascriptlang.png","http_url":"http://app.egghead.af:5000/browse/languages/javascript"},"tags":[{"name":"javascript","slug":"javascript","label":"JavaScript","context":"languages","description":"JavaScript® (often shortened to JS) is a lightweight, interpreted, object-oriented language with first-class functions, most known as the scripting language for Web pages, but used in many non-browser environments as well such as node.js or Apache CouchDB. It is a prototype-based, multi-paradigm scripting language that is dynamic, and supports object-oriented, imperative, and functional programming styles.","url":"http://app.egghead.af:5000/api/v1/tags/javascript","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/thumb/javascriptlang.png","http_url":"http://app.egghead.af:5000/browse/languages/javascript"}],"library_list":[],"language_list":["javascript"],"framework_list":[],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[],"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/610/square_480/PureRectMod_1_2x.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/610/square_280/PureRectMod_1_2x.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/610/square_256/PureRectMod_1_2x.png","square_cover_128_url":"/placeholder-rect.svg","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/610/square_64/PureRectMod_1_2x.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/610/square_32/PureRectMod_1_2x.png","square_cover_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/610/thumb/PureRectMod_1_2x.png","square_cover_large_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/610/full/PureRectMod_1_2x.png","square_cover_landscape_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/610/landscape/PureRectMod_1_2x.png","url":"http://app.egghead.af:5000/api/v1/playlists/modern-javascript-essentials-for-react","path":"/playlists/modern-javascript-essentials-for-react","http_url":"http://app.egghead.af:5000/playlists/modern-javascript-essentials-for-react","lessons_url":"http://app.egghead.af:5000/api/v1/playlists/modern-javascript-essentials-for-react/items?flatten=true","items_url":"http://app.egghead.af:5000/api/v1/playlists/modern-javascript-essentials-for-react/items?flatten=false","icon_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/thumb/javascriptlang.png","tracklist_id":809813,"is_watch_later":false,"first_lesson_path":"/lessons/javascript-write-concise-functions-with-es6-arrows-and-implicit-returns?pl=modern-javascript-essentials-for-react","favorited":false,"toggle_favorite_url":"http://app.egghead.af:5000/api/v1/playlists/432610/users/353304/toggle_save","owner":{"id":12067,"full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","avatar_url":"//gravatar.com/avatar/737adc5ae5dc6b50bee9e16ecda92e55.png?s=128&d=mp","is_instructor":true},"instructor":{"instructor_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia","id":218,"slug":"dave-ceddia","full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","twitter":"dceddia","website":"https://daveceddia.com","bio_short":"A 10-year veteran of the software industry, Dave has been coding away since he was a kid. Currently an author, blogger, co-organizer of the Boston React meetup, and front end developer focused on React. He splits his free time between family and a constantly-shifting array of hobbies like music, aviation, and DIY projects.","http_url":"http://app.egghead.af:5000/instructors/dave-ceddia","avatar_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/original/me_2017_500px.jpeg","avatar_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_480/me_2017_500px.jpeg","avatar_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_280/me_2017_500px.jpeg","avatar_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_256/me_2017_500px.jpeg","avatar_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_128/me_2017_500px.jpeg","avatar_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_64/me_2017_500px.jpeg","avatar_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_32/me_2017_500px.jpeg","lessons_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia/lessons","published_lessons":18,"published_courses":1},"progress_url":"http://app.egghead.af:5000/api/v1/playlists/modern-javascript-essentials-for-react/progress","rating_out_of_5":0,"rating_count":0},{"type":"playlist","id":432483,"title":"Lorem ipsum dolor sit amet","description":"Welcome to React! In this module you\'ll write your first React app, and learn how to build apps using React\'s JSX syntax. We\'re intentionally starting simple, with hard-coded data and no \\"state\\" to worry about. After working through these lessons you\'ll understand enough of React\'s fundamental concepts to be able to build static apps, just as you would with plain HTML.","slug":"easing-into-react-an-introduction","published":true,"updated_at":"2021-02-13T13:52:30.412-06:00","created_at":"2019-10-14T16:25:29.031-05:00","duration":2985,"state":"bundled","visibility_state":"hidden","tagline":null,"code_url":null,"access_state":"bundled","published_at":null,"free_forever":false,"summary":"Welcome to React! In this module you\'ll write your first React app, and learn how to build apps using React\'s JSX syntax. We\'re intentionally starting simple, with hard-coded data and no \\"state\\" to worry about. After working through these lessons you\'ll understand enough of React\'s fundamental concepts to be able to build static apps, just as you would with plain HTML.","primary_tag":{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"},"tags":[{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"}],"library_list":[],"language_list":[],"framework_list":["react"],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[],"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/483/square_480/PureRectMod_2_2x.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/483/square_280/PureRectMod_2_2x.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/483/square_256/PureRectMod_2_2x.png","square_cover_128_url":"/placeholder-rect.svg","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/483/square_64/PureRectMod_2_2x.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/483/square_32/PureRectMod_2_2x.png","square_cover_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/483/thumb/PureRectMod_2_2x.png","square_cover_large_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/483/full/PureRectMod_2_2x.png","square_cover_landscape_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/483/landscape/PureRectMod_2_2x.png","url":"http://app.egghead.af:5000/api/v1/playlists/easing-into-react-an-introduction","path":"/playlists/easing-into-react-an-introduction","http_url":"http://app.egghead.af:5000/playlists/easing-into-react-an-introduction","lessons_url":"http://app.egghead.af:5000/api/v1/playlists/easing-into-react-an-introduction/items?flatten=true","items_url":"http://app.egghead.af:5000/api/v1/playlists/easing-into-react-an-introduction/items?flatten=false","icon_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","tracklist_id":807841,"is_watch_later":false,"first_lesson_path":"/lessons/react-write-your-first-react-app-hello-world?pl=easing-into-react-an-introduction","favorited":false,"toggle_favorite_url":"http://app.egghead.af:5000/api/v1/playlists/432483/users/353304/toggle_save","owner":{"id":12067,"full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","avatar_url":"//gravatar.com/avatar/737adc5ae5dc6b50bee9e16ecda92e55.png?s=128&d=mp","is_instructor":true},"instructor":{"instructor_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia","id":218,"slug":"dave-ceddia","full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","twitter":"dceddia","website":"https://daveceddia.com","bio_short":"A 10-year veteran of the software industry, Dave has been coding away since he was a kid. Currently an author, blogger, co-organizer of the Boston React meetup, and front end developer focused on React. He splits his free time between family and a constantly-shifting array of hobbies like music, aviation, and DIY projects.","http_url":"http://app.egghead.af:5000/instructors/dave-ceddia","avatar_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/original/me_2017_500px.jpeg","avatar_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_480/me_2017_500px.jpeg","avatar_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_280/me_2017_500px.jpeg","avatar_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_256/me_2017_500px.jpeg","avatar_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_128/me_2017_500px.jpeg","avatar_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_64/me_2017_500px.jpeg","avatar_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_32/me_2017_500px.jpeg","lessons_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia/lessons","published_lessons":18,"published_courses":1},"progress_url":"http://app.egghead.af:5000/api/v1/playlists/easing-into-react-an-introduction/progress","rating_out_of_5":0,"rating_count":0},{"type":"playlist","id":432448,"title":"Lorem ipsum dolor sit amet","description":"Until this point, the components we\'ve built have all been stateless and pretty much static. In this module, you\'ll learn how to write `class` components in React to handle state, which will allow us to create interactive components.\\n\\nUp until React 16.8, classes were the only way to add state to components. Today, we have Hooks that allow us to add state to function components without writing a class. So you might wonder, why learn classes at all?\\n\\nThe reality is that there is a mountain of React code that existed before Hooks, and plenty of companies aren\'t fond of rewriting code that already works. Having a full understanding of class components will give you an advantage when it comes to finding a React job, and it\'ll also help when looking for answers on StackOverflow and the like.","slug":"classic-react-with-class-components","published":true,"updated_at":"2021-02-13T13:51:02.819-06:00","created_at":"2019-10-14T16:30:12.402-05:00","duration":3946,"state":"bundled","visibility_state":"hidden","tagline":null,"code_url":null,"access_state":"bundled","published_at":null,"free_forever":false,"summary":"Until this point, the components we\'ve built have all been stateless and pretty much static. In this module, you\'ll learn how to write `class` components in React to handle state, which will allow us to create interactive components.\\n\\nUp until React 16.8, classes were the only way to add state to components. Today, we have Hooks that allow us to add state to function components without writing a class. So you might wonder, why learn classes at all?\\n\\nThe reality is that there is a mountain of React code that existed before Hooks, and plenty of companies aren\'t fond of rewriting code that already works. Having a full understanding of class components will give you an advantage when it comes to finding a React job, and it\'ll also help when looking for answers on StackOverflow and the like.","primary_tag":{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"},"tags":[{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"}],"library_list":[],"language_list":[],"framework_list":["react"],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[],"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/448/square_480/PureRectMod_4_2x.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/448/square_280/PureRectMod_4_2x.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/448/square_256/PureRectMod_4_2x.png","square_cover_128_url":"/placeholder-rect.svg","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/448/square_64/PureRectMod_4_2x.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/448/square_32/PureRectMod_4_2x.png","square_cover_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/448/thumb/PureRectMod_4_2x.png","square_cover_large_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/448/full/PureRectMod_4_2x.png","square_cover_landscape_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/448/landscape/PureRectMod_4_2x.png","url":"http://app.egghead.af:5000/api/v1/playlists/classic-react-with-class-components","path":"/playlists/classic-react-with-class-components","http_url":"http://app.egghead.af:5000/playlists/classic-react-with-class-components","lessons_url":"http://app.egghead.af:5000/api/v1/playlists/classic-react-with-class-components/items?flatten=true","items_url":"http://app.egghead.af:5000/api/v1/playlists/classic-react-with-class-components/items?flatten=false","icon_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","tracklist_id":807842,"is_watch_later":false,"first_lesson_path":"/lessons/react-use-react-state-to-make-components-interactive?pl=classic-react-with-class-components","favorited":false,"toggle_favorite_url":"http://app.egghead.af:5000/api/v1/playlists/432448/users/353304/toggle_save","owner":{"id":12067,"full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","avatar_url":"//gravatar.com/avatar/737adc5ae5dc6b50bee9e16ecda92e55.png?s=128&d=mp","is_instructor":true},"instructor":{"instructor_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia","id":218,"slug":"dave-ceddia","full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","twitter":"dceddia","website":"https://daveceddia.com","bio_short":"A 10-year veteran of the software industry, Dave has been coding away since he was a kid. Currently an author, blogger, co-organizer of the Boston React meetup, and front end developer focused on React. He splits his free time between family and a constantly-shifting array of hobbies like music, aviation, and DIY projects.","http_url":"http://app.egghead.af:5000/instructors/dave-ceddia","avatar_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/original/me_2017_500px.jpeg","avatar_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_480/me_2017_500px.jpeg","avatar_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_280/me_2017_500px.jpeg","avatar_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_256/me_2017_500px.jpeg","avatar_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_128/me_2017_500px.jpeg","avatar_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_64/me_2017_500px.jpeg","avatar_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_32/me_2017_500px.jpeg","lessons_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia/lessons","published_lessons":18,"published_courses":1},"progress_url":"http://app.egghead.af:5000/api/v1/playlists/classic-react-with-class-components/progress","rating_out_of_5":0,"rating_count":0},{"type":"playlist","id":432611,"title":"Lorem ipsum dolor sit amet","description":"React version 16.8 added Hooks, a set of functions that allow you to add state and side effects to function components. In this module you\'ll learn how to use Hooks in your components! Starting with `useState`, we\'ll cover how to add simple and complex state to your functions. From there we\'ll look at using `useReducer` to handle more complex state. You\'ll learn how to write reusable custom hooks, too. And we\'ll talk about how hooks work behind the scenes to demystify the \\"magic\\". Finally we\'ll look at `useEffect` and learn how to \\"think in effects\\" by converting a few class components to functions with hooks, and learn how to use the `useMemo` and `useCallback` hooks to optimize your components.","slug":"using-react-hooks","published":true,"updated_at":"2021-02-13T13:53:28.451-06:00","created_at":"2019-10-14T16:26:16.698-05:00","duration":3908,"state":"bundled","visibility_state":"hidden","tagline":null,"code_url":null,"access_state":"bundled","published_at":null,"free_forever":false,"summary":"React version 16.8 added Hooks, a set of functions that allow you to add state and side effects to function components. In this module you\'ll learn how to use Hooks in your components! Starting with `useState`, we\'ll cover how to add simple and complex state to your functions. From there we\'ll look at using `useReducer` to handle more complex state. You\'ll learn how to write reusable custom hooks, too. And we\'ll talk about how hooks work behind the scenes to demystify the \\"magic\\". Finally we\'ll look at `useEffect` and learn how to \\"think in effects\\" by converting a few class components to functions with hooks, and learn how to use the `useMemo` and `useCallback` hooks to optimize your components.","primary_tag":{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"},"tags":[{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"}],"library_list":[],"language_list":[],"framework_list":["react"],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[],"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/611/square_480/PureRectMod_3_2x.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/611/square_280/PureRectMod_3_2x.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/611/square_256/PureRectMod_3_2x.png","square_cover_128_url":"/placeholder-rect.svg","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/611/square_64/PureRectMod_3_2x.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/611/square_32/PureRectMod_3_2x.png","square_cover_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/611/thumb/PureRectMod_3_2x.png","square_cover_large_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/611/full/PureRectMod_3_2x.png","square_cover_landscape_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/611/landscape/PureRectMod_3_2x.png","url":"http://app.egghead.af:5000/api/v1/playlists/using-react-hooks","path":"/playlists/using-react-hooks","http_url":"http://app.egghead.af:5000/playlists/using-react-hooks","lessons_url":"http://app.egghead.af:5000/api/v1/playlists/using-react-hooks/items?flatten=true","items_url":"http://app.egghead.af:5000/api/v1/playlists/using-react-hooks/items?flatten=false","icon_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","tracklist_id":807843,"is_watch_later":false,"first_lesson_path":"/lessons/react-use-the-usestate-hook-to-add-state-to-a-function-component?pl=using-react-hooks","favorited":false,"toggle_favorite_url":"http://app.egghead.af:5000/api/v1/playlists/432611/users/353304/toggle_save","owner":{"id":12067,"full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","avatar_url":"//gravatar.com/avatar/737adc5ae5dc6b50bee9e16ecda92e55.png?s=128&d=mp","is_instructor":true},"instructor":{"instructor_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia","id":218,"slug":"dave-ceddia","full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","twitter":"dceddia","website":"https://daveceddia.com","bio_short":"A 10-year veteran of the software industry, Dave has been coding away since he was a kid. Currently an author, blogger, co-organizer of the Boston React meetup, and front end developer focused on React. He splits his free time between family and a constantly-shifting array of hobbies like music, aviation, and DIY projects.","http_url":"http://app.egghead.af:5000/instructors/dave-ceddia","avatar_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/original/me_2017_500px.jpeg","avatar_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_480/me_2017_500px.jpeg","avatar_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_280/me_2017_500px.jpeg","avatar_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_256/me_2017_500px.jpeg","avatar_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_128/me_2017_500px.jpeg","avatar_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_64/me_2017_500px.jpeg","avatar_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_32/me_2017_500px.jpeg","lessons_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia/lessons","published_lessons":18,"published_courses":1},"progress_url":"http://app.egghead.af:5000/api/v1/playlists/using-react-hooks/progress","rating_out_of_5":0,"rating_count":0},{"type":"playlist","id":432451,"title":"Lorem ipsum dolor sit amet","description":"Not long after getting started with React, you\'ll want to pull in some data from an external source, whether that\'s your own API or someone else\'s. In this module we\'ll be building a Pet Store where we can view a list of pets in the adoption center, add new pets, edit their names and photos, and delete (er, adopt) them.\\n\\nWe\'ll start with a static app with hardcoded data and refactor it piece-by-piece until all the data is coming and going from an API server.","slug":"api-requests-in-react","published":true,"updated_at":"2021-02-13T13:51:07.319-06:00","created_at":"2019-10-14T16:30:59.344-05:00","duration":3259,"state":"bundled","visibility_state":"hidden","tagline":null,"code_url":null,"access_state":"bundled","published_at":null,"free_forever":false,"summary":"Not long after getting started with React, you\'ll want to pull in some data from an external source, whether that\'s your own API or someone else\'s. In this module we\'ll be building a Pet Store where we can view a list of pets in the adoption center, add new pets, edit their names and photos, and delete (er, adopt) them.\\n\\nWe\'ll start with a static app with hardcoded data and refactor it piece-by-piece until all the data is coming and going from an API server.","primary_tag":{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"},"tags":[{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"}],"library_list":[],"language_list":[],"framework_list":["react"],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[],"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/451/square_480/PureRectMod_5_2x.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/451/square_280/PureRectMod_5_2x.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/451/square_256/PureRectMod_5_2x.png","square_cover_128_url":"/placeholder-rect.svg","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/451/square_64/PureRectMod_5_2x.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/451/square_32/PureRectMod_5_2x.png","square_cover_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/451/thumb/PureRectMod_5_2x.png","square_cover_large_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/451/full/PureRectMod_5_2x.png","square_cover_landscape_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/451/landscape/PureRectMod_5_2x.png","url":"http://app.egghead.af:5000/api/v1/playlists/api-requests-in-react","path":"/playlists/api-requests-in-react","http_url":"http://app.egghead.af:5000/playlists/api-requests-in-react","lessons_url":"http://app.egghead.af:5000/api/v1/playlists/api-requests-in-react/items?flatten=true","items_url":"http://app.egghead.af:5000/api/v1/playlists/api-requests-in-react/items?flatten=false","icon_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","tracklist_id":807844,"is_watch_later":false,"first_lesson_path":"/lessons/react-basics-of-rest-and-http?pl=api-requests-in-react","favorited":false,"toggle_favorite_url":"http://app.egghead.af:5000/api/v1/playlists/432451/users/353304/toggle_save","owner":{"id":12067,"full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","avatar_url":"//gravatar.com/avatar/737adc5ae5dc6b50bee9e16ecda92e55.png?s=128&d=mp","is_instructor":true},"instructor":{"instructor_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia","id":218,"slug":"dave-ceddia","full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","twitter":"dceddia","website":"https://daveceddia.com","bio_short":"A 10-year veteran of the software industry, Dave has been coding away since he was a kid. Currently an author, blogger, co-organizer of the Boston React meetup, and front end developer focused on React. He splits his free time between family and a constantly-shifting array of hobbies like music, aviation, and DIY projects.","http_url":"http://app.egghead.af:5000/instructors/dave-ceddia","avatar_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/original/me_2017_500px.jpeg","avatar_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_480/me_2017_500px.jpeg","avatar_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_280/me_2017_500px.jpeg","avatar_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_256/me_2017_500px.jpeg","avatar_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_128/me_2017_500px.jpeg","avatar_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_64/me_2017_500px.jpeg","avatar_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_32/me_2017_500px.jpeg","lessons_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia/lessons","published_lessons":18,"published_courses":1},"progress_url":"http://app.egghead.af:5000/api/v1/playlists/api-requests-in-react/progress","rating_out_of_5":0,"rating_count":0},{"type":"playlist","id":432445,"title":"Lorem ipsum dolor sit amet","description":"In many cases, teams reach for Redux as the de facto choice for state management. But sometimes, Redux is overkill. In those cases, the React Context API might suit your needs perfectly.\\n\\nIn this module, we’ll build a simple email client using the React Context API to pass data throughout the app. You’ll learn how to create a context, how to pass data deeply through an app without manually passing props all over the place, and how to group related data and logic using simple wrapper components. We’ll also cover practical applications like using Context to display and manage notifications and how to maximize performance with Context.","slug":"react-context-for-application-state","published":true,"updated_at":"2021-02-13T13:51:07.130-06:00","created_at":"2019-10-14T16:31:32.987-05:00","duration":3449,"state":"bundled","visibility_state":"hidden","tagline":null,"code_url":null,"access_state":"bundled","published_at":null,"free_forever":false,"summary":"In many cases, teams reach for Redux as the de facto choice for state management. But sometimes, Redux is overkill. In those cases, the React Context API might suit your needs perfectly.\\n\\nIn this module, we’ll build a simple email client using the React Context API to pass data throughout the app. You’ll learn how to create a context, how to pass data deeply through an app without manually passing props all over the place, and how to group related data and logic using simple wrapper components. We’ll also cover practical applications like using Context to display and manage notifications and how to maximize performance with Context.","primary_tag":{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"},"tags":[{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"}],"library_list":[],"language_list":[],"framework_list":["react"],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[],"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/445/square_480/PureRectMod_6_2x.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/445/square_280/PureRectMod_6_2x.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/445/square_256/PureRectMod_6_2x.png","square_cover_128_url":"/placeholder-rect.svg","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/445/square_64/PureRectMod_6_2x.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/445/square_32/PureRectMod_6_2x.png","square_cover_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/445/thumb/PureRectMod_6_2x.png","square_cover_large_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/445/full/PureRectMod_6_2x.png","square_cover_landscape_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/445/landscape/PureRectMod_6_2x.png","url":"http://app.egghead.af:5000/api/v1/playlists/react-context-for-application-state","path":"/playlists/react-context-for-application-state","http_url":"http://app.egghead.af:5000/playlists/react-context-for-application-state","lessons_url":"http://app.egghead.af:5000/api/v1/playlists/react-context-for-application-state/items?flatten=true","items_url":"http://app.egghead.af:5000/api/v1/playlists/react-context-for-application-state/items?flatten=false","icon_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","tracklist_id":807845,"is_watch_later":false,"first_lesson_path":"/lessons/react-finished-product-first-the-app-we-re-building?pl=react-context-for-application-state","favorited":false,"toggle_favorite_url":"http://app.egghead.af:5000/api/v1/playlists/432445/users/353304/toggle_save","owner":{"id":12067,"full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","avatar_url":"//gravatar.com/avatar/737adc5ae5dc6b50bee9e16ecda92e55.png?s=128&d=mp","is_instructor":true},"instructor":{"instructor_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia","id":218,"slug":"dave-ceddia","full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","twitter":"dceddia","website":"https://daveceddia.com","bio_short":"A 10-year veteran of the software industry, Dave has been coding away since he was a kid. Currently an author, blogger, co-organizer of the Boston React meetup, and front end developer focused on React. He splits his free time between family and a constantly-shifting array of hobbies like music, aviation, and DIY projects.","http_url":"http://app.egghead.af:5000/instructors/dave-ceddia","avatar_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/original/me_2017_500px.jpeg","avatar_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_480/me_2017_500px.jpeg","avatar_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_280/me_2017_500px.jpeg","avatar_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_256/me_2017_500px.jpeg","avatar_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_128/me_2017_500px.jpeg","avatar_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_64/me_2017_500px.jpeg","avatar_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_32/me_2017_500px.jpeg","lessons_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia/lessons","published_lessons":18,"published_courses":1},"progress_url":"http://app.egghead.af:5000/api/v1/playlists/react-context-for-application-state/progress","rating_out_of_5":0,"rating_count":0},{"type":"playlist","id":432577,"title":"Async React with Suspense [WIP]","description":"Suspense and Concurrent mode are fundamentally changing the way React applications can be developed. Pure React will be updated to reflect those changes!\\n\\nThis module will be available when Suspense and Concurrent Mode are finalized in early 2020.\\n\\nPurchasers of Pure React PRO will be invited to exclusive live stream events and early access as this content is developed.\\n\\n","slug":"async-react-with-suspense-wip","published":true,"updated_at":"2021-02-13T13:53:37.135-06:00","created_at":"2019-11-05T13:56:02.136-06:00","duration":null,"state":"bundled","visibility_state":"hidden","tagline":null,"code_url":null,"access_state":"bundled","published_at":null,"free_forever":false,"summary":"Suspense and Concurrent mode are fundamentally changing the way React applications can be developed. Pure React will be updated to reflect those changes!\\n\\nThis module will be available when Suspense and Concurrent Mode are finalized in early 2020.\\n\\nPurchasers of Pure React PRO will be invited to exclusive live stream events and early access as this content is developed.\\n\\n","primary_tag":{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"},"tags":[{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"}],"library_list":[],"language_list":[],"framework_list":["react"],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[],"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/577/square_480/async-react-with-suspense_2x.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/577/square_280/async-react-with-suspense_2x.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/577/square_256/async-react-with-suspense_2x.png","square_cover_128_url":"/placeholder-rect.svg","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/577/square_64/async-react-with-suspense_2x.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/577/square_32/async-react-with-suspense_2x.png","square_cover_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/577/thumb/async-react-with-suspense_2x.png","square_cover_large_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/577/full/async-react-with-suspense_2x.png","square_cover_landscape_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/577/landscape/async-react-with-suspense_2x.png","url":"http://app.egghead.af:5000/api/v1/playlists/async-react-with-suspense-wip","path":"/playlists/async-react-with-suspense-wip","http_url":"http://app.egghead.af:5000/playlists/async-react-with-suspense-wip","lessons_url":"http://app.egghead.af:5000/api/v1/playlists/async-react-with-suspense-wip/items?flatten=true","items_url":"http://app.egghead.af:5000/api/v1/playlists/async-react-with-suspense-wip/items?flatten=false","icon_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","tracklist_id":811148,"is_watch_later":false,"favorited":false,"toggle_favorite_url":"http://app.egghead.af:5000/api/v1/playlists/432577/users/353304/toggle_save","owner":{"id":12067,"full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","avatar_url":"//gravatar.com/avatar/737adc5ae5dc6b50bee9e16ecda92e55.png?s=128&d=mp","is_instructor":true},"instructor":{"instructor_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia","id":218,"slug":"dave-ceddia","full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","twitter":"dceddia","website":"https://daveceddia.com","bio_short":"A 10-year veteran of the software industry, Dave has been coding away since he was a kid. Currently an author, blogger, co-organizer of the Boston React meetup, and front end developer focused on React. He splits his free time between family and a constantly-shifting array of hobbies like music, aviation, and DIY projects.","http_url":"http://app.egghead.af:5000/instructors/dave-ceddia","avatar_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/original/me_2017_500px.jpeg","avatar_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_480/me_2017_500px.jpeg","avatar_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_280/me_2017_500px.jpeg","avatar_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_256/me_2017_500px.jpeg","avatar_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_128/me_2017_500px.jpeg","avatar_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_64/me_2017_500px.jpeg","avatar_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_32/me_2017_500px.jpeg","lessons_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia/lessons","published_lessons":18,"published_courses":1},"progress_url":"http://app.egghead.af:5000/api/v1/playlists/async-react-with-suspense-wip/progress","rating_out_of_5":0,"rating_count":0},{"type":"playlist","id":432544,"title":"Build a Complete React App [WIP]","description":"Let\'s put together everything we have learned into a single, robust, real-world React app!\\n\\nThis module will be available when Suspense and Concurrent Mode are finalized in early 2020.\\n\\nPurchasers of Pure React PRO will be invited to exclusive live stream events and early access as this content is developed.","slug":"build-a-complete-react-app-wip","published":true,"updated_at":"2021-02-13T13:52:45.342-06:00","created_at":"2019-11-05T13:57:01.425-06:00","duration":null,"state":"bundled","visibility_state":"hidden","tagline":null,"code_url":null,"access_state":"bundled","published_at":null,"free_forever":false,"summary":"Let\'s put together everything we have learned into a single, robust, real-world React app!\\n\\nThis module will be available when Suspense and Concurrent Mode are finalized in early 2020.\\n\\nPurchasers of Pure React PRO will be invited to exclusive live stream events and early access as this content is developed.","primary_tag":{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"},"tags":[{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"}],"library_list":[],"language_list":[],"framework_list":["react"],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[],"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/544/square_480/build-a-complete-react-app_2x.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/544/square_280/build-a-complete-react-app_2x.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/544/square_256/build-a-complete-react-app_2x.png","square_cover_128_url":"/placeholder-rect.svg","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/544/square_64/build-a-complete-react-app_2x.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/544/square_32/build-a-complete-react-app_2x.png","square_cover_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/544/thumb/build-a-complete-react-app_2x.png","square_cover_large_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/544/full/build-a-complete-react-app_2x.png","square_cover_landscape_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/544/landscape/build-a-complete-react-app_2x.png","url":"http://app.egghead.af:5000/api/v1/playlists/build-a-complete-react-app-wip","path":"/playlists/build-a-complete-react-app-wip","http_url":"http://app.egghead.af:5000/playlists/build-a-complete-react-app-wip","lessons_url":"http://app.egghead.af:5000/api/v1/playlists/build-a-complete-react-app-wip/items?flatten=true","items_url":"http://app.egghead.af:5000/api/v1/playlists/build-a-complete-react-app-wip/items?flatten=false","icon_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","tracklist_id":811147,"is_watch_later":false,"favorited":false,"toggle_favorite_url":"http://app.egghead.af:5000/api/v1/playlists/432544/users/353304/toggle_save","owner":{"id":12067,"full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","avatar_url":"//gravatar.com/avatar/737adc5ae5dc6b50bee9e16ecda92e55.png?s=128&d=mp","is_instructor":true},"instructor":{"instructor_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia","id":218,"slug":"dave-ceddia","full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","twitter":"dceddia","website":"https://daveceddia.com","bio_short":"A 10-year veteran of the software industry, Dave has been coding away since he was a kid. Currently an author, blogger, co-organizer of the Boston React meetup, and front end developer focused on React. He splits his free time between family and a constantly-shifting array of hobbies like music, aviation, and DIY projects.","http_url":"http://app.egghead.af:5000/instructors/dave-ceddia","avatar_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/original/me_2017_500px.jpeg","avatar_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_480/me_2017_500px.jpeg","avatar_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_280/me_2017_500px.jpeg","avatar_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_256/me_2017_500px.jpeg","avatar_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_128/me_2017_500px.jpeg","avatar_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_64/me_2017_500px.jpeg","avatar_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_32/me_2017_500px.jpeg","lessons_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia/lessons","published_lessons":18,"published_courses":1},"progress_url":"http://app.egghead.af:5000/api/v1/playlists/build-a-complete-react-app-wip/progress","rating_out_of_5":0,"rating_count":0},{"type":"playlist","id":432511,"title":"Lorem ipsum dolor sit amet","description":"Exclusive Pure React Bonus Content","slug":"pure-react-interviews","published":true,"updated_at":"2021-02-13T13:52:51.390-06:00","created_at":"2019-11-04T14:07:41.301-06:00","duration":15713,"state":"bundled","visibility_state":"hidden","tagline":null,"code_url":null,"access_state":"bundled","published_at":null,"free_forever":false,"summary":"Exclusive Pure React Bonus Content","primary_tag":{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"},"tags":[{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"}],"library_list":[],"language_list":[],"framework_list":["react"],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[],"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/511/square_480/pure-react-logo_2x.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/511/square_280/pure-react-logo_2x.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/511/square_256/pure-react-logo_2x.png","square_cover_128_url":"/placeholder-rect.svg","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/511/square_64/pure-react-logo_2x.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/511/square_32/pure-react-logo_2x.png","square_cover_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/511/thumb/pure-react-logo_2x.png","square_cover_large_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/511/full/pure-react-logo_2x.png","square_cover_landscape_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/511/landscape/pure-react-logo_2x.png","url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-interviews","path":"/playlists/pure-react-interviews","http_url":"http://app.egghead.af:5000/playlists/pure-react-interviews","lessons_url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-interviews/items?flatten=true","items_url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-interviews/items?flatten=false","icon_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","tracklist_id":811034,"is_watch_later":false,"first_lesson_path":"/lessons/egghead-dave-ceddia-interviews-ali-spittel?pl=pure-react-interviews","favorited":false,"toggle_favorite_url":"http://app.egghead.af:5000/api/v1/playlists/432511/users/353304/toggle_save","owner":{"id":12067,"full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","avatar_url":"//gravatar.com/avatar/737adc5ae5dc6b50bee9e16ecda92e55.png?s=128&d=mp","is_instructor":true},"instructor":{"instructor_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia","id":218,"slug":"dave-ceddia","full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","twitter":"dceddia","website":"https://daveceddia.com","bio_short":"A 10-year veteran of the software industry, Dave has been coding away since he was a kid. Currently an author, blogger, co-organizer of the Boston React meetup, and front end developer focused on React. He splits his free time between family and a constantly-shifting array of hobbies like music, aviation, and DIY projects.","http_url":"http://app.egghead.af:5000/instructors/dave-ceddia","avatar_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/original/me_2017_500px.jpeg","avatar_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_480/me_2017_500px.jpeg","avatar_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_280/me_2017_500px.jpeg","avatar_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_256/me_2017_500px.jpeg","avatar_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_128/me_2017_500px.jpeg","avatar_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_64/me_2017_500px.jpeg","avatar_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_32/me_2017_500px.jpeg","lessons_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia/lessons","published_lessons":18,"published_courses":1},"progress_url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-interviews/progress","rating_out_of_5":0,"rating_count":0},{"type":"playlist","id":432502,"title":"Lorem ipsum dolor sit amet","description":"Live stream events for the course modules.","slug":"pure-react-livestreams","published":true,"updated_at":"2021-02-13T13:52:53.384-06:00","created_at":"2019-11-04T14:01:47.285-06:00","duration":49263,"state":"bundled","visibility_state":"hidden","tagline":null,"code_url":null,"access_state":"bundled","published_at":null,"free_forever":false,"summary":"Live stream events for the course modules.","primary_tag":{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"},"tags":[{"name":"react","slug":"react","label":"React","context":"frameworks","description":"React is one of the web’s most popular frameworks for building JavaScript applications. \\n\\nIf you know what you’re doing, React can drastically simplify how you build, use, and maintain code.\\n\\nWhether you’re a React newbie or you’re ready for advanced techniques, you can level-up with egghead. Explore our in-depth courses, lessons, and community resources to build more powerful applications and crack open your career.","url":"http://app.egghead.af:5000/api/v1/tags/react","image_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","http_url":"http://app.egghead.af:5000/browse/frameworks/react"}],"library_list":[],"language_list":[],"framework_list":["react"],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[],"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/502/square_480/pure-react-logo_2x.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/502/square_280/pure-react-logo_2x.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/502/square_256/pure-react-logo_2x.png","square_cover_128_url":"/placeholder-rect.svg","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/502/square_64/pure-react-logo_2x.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/502/square_32/pure-react-logo_2x.png","square_cover_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/502/thumb/pure-react-logo_2x.png","square_cover_large_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/502/full/pure-react-logo_2x.png","square_cover_landscape_url":"https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/502/landscape/pure-react-logo_2x.png","url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-livestreams","path":"/playlists/pure-react-livestreams","http_url":"http://app.egghead.af:5000/playlists/pure-react-livestreams","lessons_url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-livestreams/items?flatten=true","items_url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-livestreams/items?flatten=false","icon_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png","tracklist_id":811035,"is_watch_later":false,"first_lesson_path":"/lessons/react-pure-react-js-fundamentals-livestream?pl=pure-react-livestreams","favorited":false,"toggle_favorite_url":"http://app.egghead.af:5000/api/v1/playlists/432502/users/353304/toggle_save","owner":{"id":12067,"full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","avatar_url":"//gravatar.com/avatar/737adc5ae5dc6b50bee9e16ecda92e55.png?s=128&d=mp","is_instructor":true},"instructor":{"instructor_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia","id":218,"slug":"dave-ceddia","full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","twitter":"dceddia","website":"https://daveceddia.com","bio_short":"A 10-year veteran of the software industry, Dave has been coding away since he was a kid. Currently an author, blogger, co-organizer of the Boston React meetup, and front end developer focused on React. He splits his free time between family and a constantly-shifting array of hobbies like music, aviation, and DIY projects.","http_url":"http://app.egghead.af:5000/instructors/dave-ceddia","avatar_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/original/me_2017_500px.jpeg","avatar_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_480/me_2017_500px.jpeg","avatar_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_280/me_2017_500px.jpeg","avatar_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_256/me_2017_500px.jpeg","avatar_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_128/me_2017_500px.jpeg","avatar_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_64/me_2017_500px.jpeg","avatar_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_32/me_2017_500px.jpeg","lessons_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia/lessons","published_lessons":18,"published_courses":1},"progress_url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-livestreams/progress","rating_out_of_5":0,"rating_count":0},{"id":41,"guid":"2524d9f2-b7d0-444f-a48c-ced81af1091e","slug":null,"title":"Lorem ipsum dolor sit amet","summary":null,"description":"This book has been designed to get you from zero to React quickly, and with maximum understanding.\\n\\nPure React: The core concepts of React, in isolation, without Redux, Webpack, and the rest.\\n\\nLearning everything at once is massively overwhelming. So in this book, we will take a different approach. A more sane approach. We will learn Pure React.","resource_type":"book","type":"file","tracklist_id":811139,"square_cover_480_url":"/placeholder-rect.svg","square_cover_280_url":"/placeholder-rect.svg","square_cover_256_url":"/placeholder-rect.svg","square_cover_128_url":"/placeholder-rect.svg","square_cover_64_url":"/placeholder-rect.svg","square_cover_32_url":"/placeholder-rect.svg","library_list":[],"language_list":[],"framework_list":[],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[]}],"owner":{"id":12067,"full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","avatar_url":"//gravatar.com/avatar/737adc5ae5dc6b50bee9e16ecda92e55.png?s=128&d=mp","is_instructor":true},"instructor":{"instructor_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia","id":218,"slug":"dave-ceddia","full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","twitter":"dceddia","website":"https://daveceddia.com","bio_short":"A 10-year veteran of the software industry, Dave has been coding away since he was a kid. Currently an author, blogger, co-organizer of the Boston React meetup, and front end developer focused on React. He splits his free time between family and a constantly-shifting array of hobbies like music, aviation, and DIY projects.","http_url":"http://app.egghead.af:5000/instructors/dave-ceddia","avatar_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/original/me_2017_500px.jpeg","avatar_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_480/me_2017_500px.jpeg","avatar_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_280/me_2017_500px.jpeg","avatar_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_256/me_2017_500px.jpeg","avatar_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_128/me_2017_500px.jpeg","avatar_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_64/me_2017_500px.jpeg","avatar_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_32/me_2017_500px.jpeg","lessons_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia/lessons","published_lessons":18,"published_courses":1},"progress_url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-pro-07813b66/progress","rating_out_of_5":0,"rating_count":0,"index":0,"resource_id":"pure-react-pro-07813b66"},{"type":"playlist","id":438020,"title":"Book Package","description":"Lorem ipsum dolor sit amet","slug":"pure-react-book","published":true,"updated_at":"2021-04-05T12:11:28.290-05:00","created_at":"2021-04-05T12:11:28.290-05:00","duration":0,"state":"bundled","visibility_state":"hidden","tagline":null,"code_url":null,"access_state":"bundled","published_at":null,"free_forever":false,"summary":null,"tags":[],"library_list":[],"language_list":[],"framework_list":[],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[],"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/033/square_480/eggheadlogo.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/033/square_280/eggheadlogo.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/033/square_256/eggheadlogo.png","square_cover_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/033/square_128/eggheadlogo.png","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/033/square_64/eggheadlogo.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/033/square_32/eggheadlogo.png","square_cover_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/033/thumb/eggheadlogo.png","square_cover_large_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/033/full/eggheadlogo.png","square_cover_landscape_url":"https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/033/landscape/eggheadlogo.png","url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-book","path":"/playlists/pure-react-book","http_url":"http://app.egghead.af:5000/playlists/pure-react-book","lessons_url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-book/items?flatten=true","items_url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-book/items?flatten=false","icon_url":"https://res.cloudinary.com/dg3gyk0gu/image/upload/v1567198446/og-image-assets/eggo.svg","tracklist_id":null,"is_watch_later":false,"full_price":59,"price":59,"favorited":false,"toggle_favorite_url":"http://app.egghead.af:5000/api/v1/playlists/438020/users/353304/toggle_save","items":[{"id":41,"guid":"2524d9f2-b7d0-444f-a48c-ced81af1091e","slug":null,"title":"Lorem ipsum dolor sit amet","summary":null,"description":"This book has been designed to get you from zero to React quickly, and with maximum understanding.\\n\\nPure React: The core concepts of React, in isolation, without Redux, Webpack, and the rest.\\n\\nLearning everything at once is massively overwhelming. So in this book, we will take a different approach. A more sane approach. We will learn Pure React.","resource_type":"book","type":"file","tracklist_id":880091,"square_cover_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/resource/files/square_covers/000/000/041/square_480/book_2x.png","square_cover_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/resource/files/square_covers/000/000/041/square_280/book_2x.png","square_cover_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/resource/files/square_covers/000/000/041/square_256/book_2x.png","square_cover_128_url":"/placeholder-rect.svg","square_cover_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/resource/files/square_covers/000/000/041/square_64/book_2x.png","square_cover_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/resource/files/square_covers/000/000/041/square_32/book_2x.png","library_list":[],"language_list":[],"framework_list":[],"tool_list":[],"platform_list":[],"skillset_list":[],"skill_level_list":[]}],"owner":{"id":12067,"full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","avatar_url":"//gravatar.com/avatar/737adc5ae5dc6b50bee9e16ecda92e55.png?s=128&d=mp","is_instructor":true},"instructor":{"instructor_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia","id":218,"slug":"dave-ceddia","full_name":"Dave Ceddia","first_name":"Dave","last_name":"Ceddia","twitter":"dceddia","website":"https://daveceddia.com","bio_short":"A 10-year veteran of the software industry, Dave has been coding away since he was a kid. Currently an author, blogger, co-organizer of the Boston React meetup, and front end developer focused on React. He splits his free time between family and a constantly-shifting array of hobbies like music, aviation, and DIY projects.","http_url":"http://app.egghead.af:5000/instructors/dave-ceddia","avatar_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/original/me_2017_500px.jpeg","avatar_480_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_480/me_2017_500px.jpeg","avatar_280_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_280/me_2017_500px.jpeg","avatar_256_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_256/me_2017_500px.jpeg","avatar_128_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_128/me_2017_500px.jpeg","avatar_64_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_64/me_2017_500px.jpeg","avatar_32_url":"https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/218/square_32/me_2017_500px.jpeg","lessons_url":"http://app.egghead.af:5000/api/v1/instructors/dave-ceddia/lessons","published_lessons":18,"published_courses":1},"progress_url":"http://app.egghead.af:5000/api/v1/playlists/pure-react-book/progress","rating_out_of_5":0,"rating_count":0,"index":1,"resource_id":"pure-react-book"}]',
    )

    /***/
  },

  /***/ 1547: /***/ (module) => {
    module.exports = []

    /***/
  },
}
