

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = renderPage

var _preactRenderToString = _interopRequireDefault(
  require('preact-render-to-string'),
)

var _test = _interopRequireDefault(require('./test'))

function css() {
  return ''
}

function renderPage(params) {
  const {url, theme, query, cookies} = params

  function send({html, title, status}) {
    var _theme$colorScheme

    return {
      cookies,
      status,
      headers: [
        {
          key: 'Content-Type',
          value: 'text/html',
        },
      ],
      body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${css()}</style><title>${title}</title></head><body class="__skillrecordings-theme-${
        (_theme$colorScheme =
          theme === null || theme === void 0 ? void 0 : theme.colorScheme) !==
          null && _theme$colorScheme !== void 0
          ? _theme$colorScheme
          : 'auto'
      }"><div class="page">${(0, _preactRenderToString.default)(
        html,
      )}</div></body></html>`,
    }
  }

  return {
    test(props) {
      return send({
        status: 200,
        html: (0, _test.default)({
          theme,
          ...query,
          ...props,
        }),
        title: 'Test Page',
      })
    },
  }
}
