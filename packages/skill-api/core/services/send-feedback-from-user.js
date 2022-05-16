

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.sendFeedbackFromUser = sendFeedbackFromUser

var _htmlToText = require('html-to-text')

var _sanitizeHtml = _interopRequireDefault(require('sanitize-html'))

var _getFeedbackEmoji = require('../../lib/get-feedback-emoji')

var _postmark = require('../../lib/postmark')

async function sendFeedbackFromUser({userId, feedbackText, context, prisma}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      return {
        status: 403,
        body: 'Error: Not Authorized',
      }
    } else {
      const comment = await prisma.comment.create({
        data: {
          userId: user.id,
          text: (0, _htmlToText.htmlToText)(feedbackText),
          context,
          updatedAt: new Date(),
        },
      })
      const html = `${
        (0, _getFeedbackEmoji.getEmoji)(
          context === null || context === void 0 ? void 0 : context.emotion,
        ).image
      } ${(0, _sanitizeHtml.default)(feedbackText)} <i>${
        context !== null && context !== void 0 && context.url ? context.url : ''
      }</i>`
      const info = await (0, _postmark.sendPostmarkEmail)({
        from: `${process.env.NEXT_PUBLIC_SITE_TITLE} Feedback <${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}>`,
        to: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
        replyTo: user.email,
        subject: `Feedback from ${user.name ? user.name : user.email} about ${
          process.env.NEXT_PUBLIC_SITE_TITLE
        }`,
        text: comment.text,
        html,
      })
      return {
        status: 200,
        body: info,
      }
    }
  } catch (error) {
    return {
      status: 500,
      body: `Error: ${error.message}`,
    }
  }
}
