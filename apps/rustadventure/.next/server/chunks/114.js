'use strict'
exports.id = 114
exports.ids = [114]
exports.modules = {
  /***/ 3114: /***/ function (
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
    var axios_1 = __webpack_require__(4106)
    var fetch_convertkit_subscriber_1 = __importDefault(
      __webpack_require__(7422),
    )
    var isEmpty_1 = __importDefault(__webpack_require__(8718))
    var find_1 = __importDefault(__webpack_require__(3935))
    var config_1 = __webpack_require__(2519)
    if (!config_1.CONVERTKIT_BASE_URL)
      throw new Error('No Convertkit API Base Url Found: CONVERTKIT_BASE_URL')
    if (false) {
    }
    var answer = function (req, res) {
      return __awaiter(void 0, void 0, void 0, function () {
        var _a,
          tagId,
          survey,
          cookieHeader,
          siteNameShort,
          _b,
          subscriber,
          ckCookie,
          questionId_1,
          fieldExists,
          error_1
        var _c
        return __generator(this, function (_d) {
          switch (_d.label) {
            case 0:
              if (!(req.method === 'POST')) return [3 /*break*/, 9]
              _d.label = 1
            case 1:
              _d.trys.push([1, 7, , 8])
              ;(_a = req.body), (tagId = _a.tagId), (survey = _a.survey)
              cookieHeader = req.headers.cookie
              siteNameShort = process.env.NEXT_PUBLIC_SITE_NAME_SHORT
              return [
                4 /*yield*/,
                fetch_convertkit_subscriber_1['default'](cookieHeader),
              ]
            case 2:
              ;(_b = _d.sent()), (subscriber = _b[0]), (ckCookie = _b[1])
              questionId_1 = siteNameShort
                ? siteNameShort + '-survey-' + survey.id
                : 'survey-' + survey.id
              // Subscribe user to tag
              return [
                4 /*yield*/,
                axios_1.convertkitAxios.post('/tags/' + tagId + '/subscribe', {
                  api_key: '1FReP6d6e79X7Ttl8qyKmQ',
                  email: subscriber.email_address,
                }),
                // Create question field if it doesn't exist
              ]
            case 3:
              // Subscribe user to tag
              _d.sent()
              fieldExists = !isEmpty_1['default'](
                find_1['default'](
                  Object.keys(subscriber.fields),
                  function (field) {
                    return field === questionId_1
                  },
                ),
              )
              if (!!fieldExists) return [3 /*break*/, 5]
              return [
                4 /*yield*/,
                axios_1.convertkitAxios.post('/custom_fields', {
                  api_secret: process.env.CONVERTKIT_API_SECRET,
                  label: questionId_1,
                }),
              ]
            case 4:
              _d.sent()
              _d.label = 5
            case 5:
              // Submit user answer
              return [
                4 /*yield*/,
                axios_1.convertkitAxios.put('/subscribers/' + subscriber.id, {
                  api_secret: process.env.CONVERTKIT_API_SECRET,
                  fields: ((_c = {}), (_c[questionId_1] = survey.answer), _c),
                }),
              ]
            case 6:
              // Submit user answer
              _d.sent()
              res.setHeader('Set-Cookie', ckCookie)
              res.setHeader('Cache-Control', 'max-age=10')
              res.status(200).json(subscriber)
              return [3 /*break*/, 8]
            case 7:
              error_1 = _d.sent()
              console.log(error_1)
              res.status(200).end()
              return [3 /*break*/, 8]
            case 8:
              return [3 /*break*/, 10]
            case 9:
              console.error('non-post request made')
              res.status(404).end()
              _d.label = 10
            case 10:
              return [2 /*return*/]
          }
        })
      })
    }
    exports.default = answer

    /***/
  },
}
