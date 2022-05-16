

Object.defineProperty(exports, '__esModule', {
  value: true,
})

var _sendFeedback = require('./send-feedback')

Object.keys(_sendFeedback).forEach(function (key) {
  if (key === 'default' || key === '__esModule') return
  if (key in exports && exports[key] === _sendFeedback[key]) return
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _sendFeedback[key]
    },
  })
})
