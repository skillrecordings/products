

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.sendFeedback = sendFeedback

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator'),
)

function sendFeedback(_x, _x2) {
  return _sendFeedback.apply(this, arguments)
}

function _sendFeedback() {
  _sendFeedback = (0, _asyncToGenerator2.default)(
    _regenerator.default.mark(function _callee(text, context) {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2
              return fetch('/api/skill/send-feedback', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  text: text,
                  context: context,
                }),
              }).then(function (response) {
                return response.json()
              })

            case 2:
              return _context.abrupt('return', _context.sent)

            case 3:
            case 'end':
              return _context.stop()
          }
        }
      }, _callee)
    }),
  )
  return _sendFeedback.apply(this, arguments)
}
