import {htmlToText} from 'html-to-text'
import sanitizeHtml from 'sanitize-html'
import {getEmoji} from '../../client/get-feedback-emoji'
import {SendFeedbackFromUserOptions} from '../types'
import {sendPostmarkEmail} from '../../lib/postmark'
import {OutgoingResponse} from '../index'
import {postFeedbackToSlack} from '../../server/post-to-slack'
import {NodeHtmlMarkdown} from 'node-html-markdown'

export async function sendFeedbackFromUser({
  userId,
  feedbackText,
  context,
  config,
}: SendFeedbackFromUserOptions): Promise<OutgoingResponse> {
  const {prismaClient, slack, site} = config
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user) {
      return {
        status: 403,
        body: 'Error: Not Authorized' as any,
      }
    } else {
      const comment = await prismaClient.comment.create({
        data: {
          userId: user.id,
          text: htmlToText(feedbackText),
          context,
          updatedAt: new Date(),
        },
      })

      const html = `${getEmoji(context?.emotion).image} ${sanitizeHtml(
        feedbackText,
      )} <i>${context?.url ? context.url : ''}</i>`

      const info = await sendPostmarkEmail({
        from: `${site.title} Feedback <${site.supportEmail}>`,
        to: site.supportEmail,
        replyTo: user.email,
        subject: `Feedback from ${user.name ? user.name : user.email} about ${
          site.title
        }`,
        text: comment.text,
        html,
      })

      if (slack?.feedback) {
        await postFeedbackToSlack(
          NodeHtmlMarkdown.translate(feedbackText),
          context,
          user,
          slack,
        )
      }

      return {
        status: 200,
        body: info,
      }
    }
  } catch (error: any) {
    return {
      status: 500,
      body: `Error: ${error.message}`,
    }
  }
}
