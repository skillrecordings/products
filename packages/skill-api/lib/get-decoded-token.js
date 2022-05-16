

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.getDecodedToken = getDecodedToken

var _jwt = require('next-auth/jwt')

function getDecodedToken(req) {
  return (0, _jwt.getToken)({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
}
