

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.SkillRecordingsHandler = SkillRecordingsHandler

var _init = require('./init')

var _pages = _interopRequireDefault(require('./pages'))

var _sendFeedbackFromUser = require('./services/send-feedback-from-user')

async function SkillRecordingsHandler(params) {
  var _req$body, _req$body2

  const {options: userOptions, req, token} = params
  const {action, error, method = 'GET'} = req
  const {options, cookies} = await (0, _init.init)({
    userOptions,
    action,
    host: req.host,
    cookies: req.cookies,
    isPost: method === 'POST',
  })

  if (method === 'GET') {
    const render = (0, _pages.default)({...options, query: req.query, cookies})
    const {pages} = options

    switch (action) {
      case 'test':
        return render.test()
    }
  } else if (method === 'POST') {
    switch (action) {
      case 'send-feedback':
        return await (0, _sendFeedbackFromUser.sendFeedbackFromUser)({
          userId: token === null || token === void 0 ? void 0 : token.id,
          feedbackText:
            req === null || req === void 0
              ? void 0
              : (_req$body = req.body) === null || _req$body === void 0
              ? void 0
              : _req$body.text,
          context:
            req === null || req === void 0
              ? void 0
              : (_req$body2 = req.body) === null || _req$body2 === void 0
              ? void 0
              : _req$body2.conext,
          prisma: userOptions.prismaClient,
        })
    }
  }

  return {
    status: 400,
    body: `Error: This action with HTTP ${method} is not supported by Skill Recordings`,
  }
}
