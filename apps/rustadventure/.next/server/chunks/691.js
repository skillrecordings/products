'use strict'
exports.id = 691
exports.ids = [691]
exports.modules = {
  /***/ 1691: /***/ function (
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
    exports.__esModule = true
    var jsx_runtime_1 = __webpack_require__(5282)
    var Spinner = function (_a) {
      var _b = _a.className,
        className = _b === void 0 ? '' : _b,
        _c = _a.size,
        size = _c === void 0 ? 6 : _c
      return jsx_runtime_1.jsxs(
        'svg',
        __assign(
          {
            className:
              'animate-spin h-' + size + ' w-' + size + ' ' + className,
            xmlns: 'http://www.w3.org/2000/svg',
            fill: 'none',
            viewBox: '0 0 24 24',
          },
          {
            children: [
              jsx_runtime_1.jsx(
                'circle',
                {
                  className: 'opacity-25',
                  cx: '12',
                  cy: '12',
                  r: '10',
                  stroke: 'currentColor',
                  strokeWidth: '4',
                },
                void 0,
              ),
              jsx_runtime_1.jsx(
                'path',
                {
                  className: 'opacity-75',
                  fill: 'currentColor',
                  d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z',
                },
                void 0,
              ),
            ],
          },
        ),
        void 0,
      )
    }
    exports.default = Spinner

    /***/
  },
}
