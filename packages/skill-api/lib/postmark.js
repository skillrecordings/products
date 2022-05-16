

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.sendPostmarkEmail = sendPostmarkEmail

var _nodemailerPostmarkTransport = _interopRequireDefault(
  require('nodemailer-postmark-transport'),
)

var _nodemailer = _interopRequireDefault(require('nodemailer'))

const transport = _nodemailer.default.createTransport(
  (0, _nodemailerPostmarkTransport.default)({
    auth: {
      apiKey: process.env.POSTMARK_KEY || '',
    },
  }),
)

async function sendPostmarkEmail(options) {
  return await transport.sendMail(options)
}
