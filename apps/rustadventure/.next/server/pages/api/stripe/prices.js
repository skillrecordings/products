'use strict'
;(() => {
  var exports = {}
  exports.id = 232
  exports.ids = [232]
  exports.modules = {
    /***/ 7172: /***/ (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__,
    ) => {
      __webpack_require__.r(__webpack_exports__)
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */
      })
      /* harmony import */ var _skillrecordings_stripe__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(2187)
      /* harmony import */ var _skillrecordings_stripe__WEBPACK_IMPORTED_MODULE_0___default =
        /*#__PURE__*/ __webpack_require__.n(
          _skillrecordings_stripe__WEBPACK_IMPORTED_MODULE_0__,
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

      async function handler(req, res) {
        if (req.method !== 'GET') {
          console.error('non-get request made')
          res.status(404).end()
        }

        try {
          const {
            query: {id},
          } = req

          if (typeof id !== 'string' || !id) {
            throw 'id is invalid.'
          }

          const price = await (0,
          _skillrecordings_stripe__WEBPACK_IMPORTED_MODULE_0__.fetchStripePrice)(
            id,
          )
          const unitAmount = price && price.unit_amount // we calculate priceInDollars because the sellable_purchase#prices end point sends back dollars

          const priceInDollars = Math.ceil(unitAmount || 0 / 100) // we have to send back an array to match sellable_purchases#prices endpoint

          res.status(200).json([
            _objectSpread(
              _objectSpread({}, price),
              {},
              {
                price: priceInDollars,
                full_price: priceInDollars,
              },
            ),
          ])
        } catch (error) {
          console.log(error)
          res.status(200).end()
        }
      }

      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = handler

      /***/
    },

    /***/ 464: /***/ (module) => {
      module.exports = require('stripe')

      /***/
    },
  }
  // load runtime
  var __webpack_require__ = require('../../../webpack-runtime.js')
  __webpack_require__.C(exports)
  var __webpack_exec__ = (moduleId) =>
    __webpack_require__((__webpack_require__.s = moduleId))
  var __webpack_exports__ = __webpack_require__.X(0, [187], () =>
    __webpack_exec__(7172),
  )
  module.exports = __webpack_exports__
})()
