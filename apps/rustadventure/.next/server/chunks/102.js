'use strict'
exports.id = 102
exports.ids = [102]
exports.modules = {
  /***/ 6593: /***/ function (
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
    var __rest =
      (this && this.__rest) ||
      function (s, e) {
        var t = {}
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p]
        if (s != null && typeof Object.getOwnPropertySymbols === 'function')
          for (
            var i = 0, p = Object.getOwnPropertySymbols(s);
            i < p.length;
            i++
          ) {
            if (
              e.indexOf(p[i]) < 0 &&
              Object.prototype.propertyIsEnumerable.call(s, p[i])
            )
              t[p[i]] = s[p[i]]
          }
        return t
      }
    var __importDefault =
      (this && this.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : {default: mod}
      }
    exports.__esModule = true
    exports.SubscribeToConvertkitForm = exports.redirectUrlBuilder = void 0
    var jsx_runtime_1 = __webpack_require__(5282)
    var React = __importStar(__webpack_require__(9297))
    var Yup = __importStar(__webpack_require__(9440))
    var axios_1 = __importDefault(__webpack_require__(2376))
    var formik_1 = __webpack_require__(6379)
    var components_1 = __webpack_require__(1881)
    var config_1 = __webpack_require__(2519)
    var query_string_1 = __importDefault(__webpack_require__(1366))
    var redirectUrlBuilder = function (subscriber, path) {
      var _a
      var url = query_string_1['default'].stringifyUrl({
        url: path,
        query:
          ((_a = {}),
          (_a[config_1.CK_SUBSCRIBER_KEY] = subscriber.id),
          (_a.email = subscriber.email),
          _a),
      })
      return url
    }
    exports.redirectUrlBuilder = redirectUrlBuilder
    /**
     * This form posts to a designated api URL (assumes /api/convertkit/subscribe
     * by default)
     * @param formId the Convertkit form id, defaults to `process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM`
     * @param submitButtonElem an element to use as the button for the form submit
     * @param errorMessage A string or element representing the message shown on error
     * @param successMessage A string or element representing the message shown on success
     * @param actionLabel Label for the button (not used if submitButtonElem is used)
     * @param onError function to call on error
     * @param onSuccess function to call on success
     * @param subscribeApiURL optional param to override the api url that gets posted to
     * @param rest anything else!
     * @constructor
     */
    var SubscribeToConvertkitForm = function (_a) {
      var _b = _a.formId,
        formId = _b === void 0 ? config_1.CONVERTKIT_SIGNUP_FORM : _b,
        submitButtonElem = _a.submitButtonElem,
        _c = _a.errorMessage,
        errorMessage =
          _c === void 0
            ? jsx_runtime_1.jsx(
                'p',
                {children: 'Something went wrong.'},
                void 0,
              )
            : _c,
        _d = _a.successMessage,
        successMessage =
          _d === void 0
            ? jsx_runtime_1.jsx('p', {children: 'Thanks!'}, void 0)
            : _d,
        _e = _a.actionLabel,
        actionLabel = _e === void 0 ? 'Subscribe' : _e,
        _f = _a.onError,
        onError = _f === void 0 ? function () {} : _f,
        _g = _a.onSuccess,
        onSuccess = _g === void 0 ? function () {} : _g,
        _h = _a.subscribeApiURL,
        subscribeApiURL =
          _h === void 0 ? config_1.CONVERTKIT_SUBSCRIBE_API_URL : _h,
        rest = __rest(_a, [
          'formId',
          'submitButtonElem',
          'errorMessage',
          'successMessage',
          'actionLabel',
          'onError',
          'onSuccess',
          'subscribeApiURL',
        ])
      var _j = React.useState(false),
        isSubmitting = _j[0],
        setSubmitting = _j[1]
      var handleOnSubmit = function (values) {
        return __awaiter(void 0, void 0, void 0, function () {
          var email, first_name
          return __generator(this, function (_a) {
            ;(email = values.email), (first_name = values.first_name)
            setSubmitting(true)
            axios_1['default']
              .post(subscribeApiURL, {
                email: email,
                first_name: first_name,
                form: formId,
              })
              .then(function (response) {
                var subscriber = response.data
                onSuccess(subscriber)
                formik.setStatus('success')
              })
              ['catch'](function (error) {
                onError(error)
                formik.setStatus('error')
                console.log(error)
              })
              ['finally'](function () {
                setSubmitting(false)
              })
            return [2 /*return*/]
          })
        })
      }
      var formik = formik_1.useFormik({
        initialStatus: '',
        initialValues: {
          email: '',
          first_name: '',
        },
        validationSchema: Yup.object().shape({
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          first_name: Yup.string(),
        }),
        validateOnChange: false,
        enableReinitialize: true,
        onSubmit: handleOnSubmit,
      })
      return jsx_runtime_1.jsxs(
        'form',
        __assign(
          {
            'data-sr-convertkit-subscribe-form': formik.status,
            onSubmit: formik.handleSubmit,
          },
          rest,
          {
            children: [
              !formik.status &&
                jsx_runtime_1.jsxs(
                  jsx_runtime_1.Fragment,
                  {
                    children: [
                      jsx_runtime_1.jsx(
                        components_1.Input,
                        {
                          label: 'First Name',
                          name: 'first_name',
                          onChange: formik.handleChange,
                          placeholder: 'Preferred name',
                          type: 'text',
                        },
                        void 0,
                      ),
                      jsx_runtime_1.jsx(
                        components_1.Input,
                        {
                          label: 'Email',
                          name: 'email',
                          onChange: formik.handleChange,
                          placeholder: 'you@company.com',
                          type: 'email',
                          required: true,
                        },
                        void 0,
                      ),
                      submitButtonElem
                        ? React.cloneElement(submitButtonElem, {
                            isLoading: isSubmitting,
                            type: 'submit',
                          })
                        : jsx_runtime_1.jsx(
                            components_1.Button,
                            __assign(
                              {isLoading: isSubmitting, type: 'submit'},
                              {children: actionLabel},
                            ),
                            void 0,
                          ),
                    ],
                  },
                  void 0,
                ),
              formik.status === 'success' &&
                (React.isValidElement(successMessage)
                  ? successMessage
                  : jsx_runtime_1.jsx('p', {children: successMessage}, void 0)),
              formik.status === 'error' &&
                (React.isValidElement(errorMessage)
                  ? errorMessage
                  : jsx_runtime_1.jsx('p', {children: errorMessage}, void 0)),
            ],
          },
        ),
        void 0,
      )
    }
    exports.SubscribeToConvertkitForm = SubscribeToConvertkitForm
    exports.default = exports.SubscribeToConvertkitForm

    /***/
  },

  /***/ 1049: /***/ function (
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
    var __importDefault =
      (this && this.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : {default: mod}
      }
    exports.__esModule = true
    exports.useConvertkit =
      exports.ConvertkitProvider =
      exports.ConvertkitContext =
        void 0
    var jsx_runtime_1 = __webpack_require__(5282)
    var React = __importStar(__webpack_require__(9297))
    var query_string_1 = __importDefault(__webpack_require__(1366))
    var lodash_1 = __webpack_require__(3804)
    var cookies_1 = __importDefault(__webpack_require__(7965))
    var axios_1 = __importDefault(__webpack_require__(4106))
    var config_1 = __webpack_require__(2519)
    var defaultConvertKitContext = {
      loadingSubscriber: true,
    }
    exports.ConvertkitContext = React.createContext(defaultConvertKitContext)
    var ConvertkitProvider = function (_a) {
      var children = _a.children
      var _b = React.useState(),
        subscriber = _b[0],
        setSubscriber = _b[1]
      var _c = React.useState(true),
        loadingSubscriber = _c[0],
        setLoadingSubscriber = _c[1]
      React.useEffect(function () {
        if (typeof window !== 'undefined') {
          var queryParams = query_string_1['default'].parse(
            window.location.search,
          )
          var ckSubscriberId = lodash_1.get(
            queryParams,
            config_1.CK_SUBSCRIBER_KEY,
          )
          if (!lodash_1.isEmpty(ckSubscriberId)) {
            cookies_1['default'].set(config_1.CK_SUBSCRIBER_KEY, ckSubscriberId)
            window.history.replaceState(
              null,
              document.title,
              window.location.pathname,
            )
          }
        }
        axios_1['default']
          .get('/api/subscriber')
          .then(function (_a) {
            var data = _a.data
            setSubscriber(data)
          })
          ['finally'](function () {
            return setLoadingSubscriber(false)
          })
      }, [])
      return jsx_runtime_1.jsx(
        exports.ConvertkitContext.Provider,
        __assign(
          {
            value: {
              subscriber: subscriber,
              loadingSubscriber: loadingSubscriber,
            },
          },
          {children: children},
        ),
        void 0,
      )
    }
    exports.ConvertkitProvider = ConvertkitProvider
    function useConvertkit() {
      return React.useContext(exports.ConvertkitContext)
    }
    exports.useConvertkit = useConvertkit

    /***/
  },

  /***/ 6102: /***/ function (
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
    var __importDefault =
      (this && this.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : {default: mod}
      }
    exports.__esModule = true
    exports.fetchConvertkitSubscriberFromServerCookie =
      exports.ConvertkitContext =
      exports.ConvertkitProvider =
      exports.useConvertkit =
      exports.redirectUrlBuilder =
      exports.SubscribeToConvertkitForm =
        void 0
    var use_convertkit_1 = __webpack_require__(1049)
    exports.useConvertkit = use_convertkit_1.useConvertkit
    exports.ConvertkitProvider = use_convertkit_1.ConvertkitProvider
    exports.ConvertkitContext = use_convertkit_1.ConvertkitContext
    var fetch_convertkit_subscriber_1 = __importDefault(
      __webpack_require__(7422),
    )
    exports.fetchConvertkitSubscriberFromServerCookie =
      fetch_convertkit_subscriber_1['default']
    var subscribe_to_convertkit_form_1 = __webpack_require__(6593)
    __createBinding(
      exports,
      subscribe_to_convertkit_form_1,
      'SubscribeToConvertkitForm',
    )
    __createBinding(
      exports,
      subscribe_to_convertkit_form_1,
      'redirectUrlBuilder',
    )

    /***/
  },

  /***/ 1828: /***/ function (
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
    var __rest =
      (this && this.__rest) ||
      function (s, e) {
        var t = {}
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p]
        if (s != null && typeof Object.getOwnPropertySymbols === 'function')
          for (
            var i = 0, p = Object.getOwnPropertySymbols(s);
            i < p.length;
            i++
          ) {
            if (
              e.indexOf(p[i]) < 0 &&
              Object.prototype.propertyIsEnumerable.call(s, p[i])
            )
              t[p[i]] = s[p[i]]
          }
        return t
      }
    var __importDefault =
      (this && this.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : {default: mod}
      }
    exports.__esModule = true
    var jsx_runtime_1 = __webpack_require__(5282)
    var react_1 = __importDefault(__webpack_require__(9297))
    var spinner_1 = __importDefault(__webpack_require__(1691))
    var ButtonContent = function (props) {
      var leftIcon = props.leftIcon,
        rightIcon = props.rightIcon,
        children = props.children
      return jsx_runtime_1.jsxs(
        jsx_runtime_1.Fragment,
        {
          children: [
            leftIcon &&
              jsx_runtime_1.jsx(ButtonIcon, {children: leftIcon}, void 0),
            children,
            rightIcon &&
              jsx_runtime_1.jsx(ButtonIcon, {children: rightIcon}, void 0),
          ],
        },
        void 0,
      )
    }
    var ButtonIcon = function (props) {
      var children = props.children,
        rest = __rest(props, ['children'])
      var _children = react_1['default'].isValidElement(children)
        ? react_1['default'].cloneElement(children, {
            'aria-hidden': true,
            focusable: false,
          })
        : children
      return jsx_runtime_1.jsx(
        'span',
        __assign({'data-sr-button-icon': true}, rest, {children: _children}),
        void 0,
      )
    }
    var Button = function (_a) {
      var children = _a.children,
        isLoading = _a.isLoading,
        isDisabled = _a.isDisabled,
        leftIcon = _a.leftIcon,
        rightIcon = _a.rightIcon,
        rest = __rest(_a, [
          'children',
          'isLoading',
          'isDisabled',
          'leftIcon',
          'rightIcon',
        ])
      var contentProps = {
        rightIcon: rightIcon,
        leftIcon: leftIcon,
        children: children,
      }
      return jsx_runtime_1.jsx(
        'button',
        __assign(
          {'data-sr-button': true},
          rest,
          {disabled: isLoading || rest.disabled},
          {
            children: isLoading
              ? jsx_runtime_1.jsxs(
                  jsx_runtime_1.Fragment,
                  {
                    children: [
                      jsx_runtime_1.jsx(
                        ButtonIcon,
                        {
                          children: jsx_runtime_1.jsx(
                            spinner_1['default'],
                            {},
                            void 0,
                          ),
                        },
                        void 0,
                      ),
                      jsx_runtime_1.jsx(
                        'span',
                        __assign({className: 'sr-only'}, {children: 'Loading'}),
                        void 0,
                      ),
                    ],
                  },
                  void 0,
                )
              : jsx_runtime_1.jsx(
                  ButtonContent,
                  __assign({}, contentProps),
                  void 0,
                ),
          },
        ),
        void 0,
      )
    }
    exports.default = Button

    /***/
  },

  /***/ 1881: /***/ function (
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
    exports.Button = exports.Input = void 0
    var input_1 = __importDefault(__webpack_require__(337))
    exports.Input = input_1['default']
    var button_1 = __importDefault(__webpack_require__(1828))
    exports.Button = button_1['default']

    /***/
  },

  /***/ 337: /***/ function (
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
    var __rest =
      (this && this.__rest) ||
      function (s, e) {
        var t = {}
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p]
        if (s != null && typeof Object.getOwnPropertySymbols === 'function')
          for (
            var i = 0, p = Object.getOwnPropertySymbols(s);
            i < p.length;
            i++
          ) {
            if (
              e.indexOf(p[i]) < 0 &&
              Object.prototype.propertyIsEnumerable.call(s, p[i])
            )
              t[p[i]] = s[p[i]]
          }
        return t
      }
    exports.__esModule = true
    var jsx_runtime_1 = __webpack_require__(5282)
    var Label = function (_a) {
      var children = _a.children,
        rest = __rest(_a, ['children'])
      return jsx_runtime_1.jsx(
        'label',
        __assign({'data-sr-input-label': true}, rest, {children: children}),
        void 0,
      )
    }
    var Input = function (_a) {
      var name = _a.name,
        label = _a.label,
        rest = __rest(_a, ['name', 'label'])
      var required = rest.required
      return jsx_runtime_1.jsxs(
        'div',
        __assign(
          {'data-sr-input-wrapper': true},
          {
            children: [
              jsx_runtime_1.jsxs(
                Label,
                __assign(
                  {htmlFor: name},
                  {
                    children: [
                      label,
                      required &&
                        jsx_runtime_1.jsx(
                          'abbr',
                          __assign(
                            {title: 'required', 'data-sr-input-asterisk': true},
                            {children: '*'},
                          ),
                          void 0,
                        ),
                    ],
                  },
                ),
                void 0,
              ),
              jsx_runtime_1.jsx(
                'input',
                __assign({'data-sr-input': true, id: name}, rest),
                void 0,
              ),
            ],
          },
        ),
        void 0,
      )
    }
    exports.default = Input

    /***/
  },
}
