

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0
exports.detectHost = detectHost

var _getDecodedToken = require('../lib/get-decoded-token')

var _core = require('../core')

function detectHost(forwardedHost) {
  if (process.env.VERCEL) return forwardedHost
  return process.env.NEXTAUTH_URL
}

async function SkillRecordingsNextHandler(req, res, options) {
  var _ref, _handler$status, _handler$headers

  const {skillRecordings, ...query} = req.query
  const token = await (0, _getDecodedToken.getDecodedToken)(req)
  const handler = await (0, _core.SkillRecordingsHandler)({
    req: {
      host: detectHost(req.headers['x-forwarded-host']),
      body: req.body,
      query,
      cookies: req.cookies,
      headers: req.headers,
      method: req.method,
      action:
        skillRecordings === null || skillRecordings === void 0
          ? void 0
          : skillRecordings[0],
      providerId:
        skillRecordings === null || skillRecordings === void 0
          ? void 0
          : skillRecordings[1],
      error:
        (_ref = req.query.error) !== null && _ref !== void 0
          ? _ref
          : skillRecordings === null || skillRecordings === void 0
          ? void 0
          : skillRecordings[1],
    },
    token,
    options,
  })
  res.status(
    (_handler$status = handler.status) !== null && _handler$status !== void 0
      ? _handler$status
      : 200,
  )
  ;(_handler$headers = handler.headers) === null || _handler$headers === void 0
    ? void 0
    : _handler$headers.forEach((h) => res.setHeader(h.key, h.value))

  if (handler.redirect) {
    var _req$body

    if (
      ((_req$body = req.body) === null || _req$body === void 0
        ? void 0
        : _req$body.json) !== 'true'
    ) {
      res.status(302).setHeader('Location', handler.redirect)
      return res.end()
    }

    return res.json({
      url: handler.redirect,
    })
  }

  return res.send(handler.body)
}

function SkillRecordings(...args) {
  if (args.length === 1) {
    return async (req, res) =>
      await SkillRecordingsNextHandler(req, res, args[0])
  }

  return SkillRecordingsNextHandler(args[0], args[1], args[2])
}

var _default = SkillRecordings
exports.default = _default
