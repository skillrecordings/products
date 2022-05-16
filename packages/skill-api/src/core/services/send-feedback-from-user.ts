import {htmlToText} from 'html-to-text'
import sanitizeHtml from 'sanitize-html'
import {getEmoji} from '../../lib/get-feedback-emoji'
import {SendFeedbackFromUserOptions} from '../types'
import {sendPostmarkEmail} from '../../lib/postmark'
import {OutgoingResponse} from '../index'

export async function sendFeedbackFromUser({
  userId,
  feedbackText,
  context,
  prisma,
}: SendFeedbackFromUserOptions): Promise<OutgoingResponse> {
  try {
    const user = await prisma.user.findUnique({
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
      const comment = await prisma.comment.create({
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
        from: `${process.env.NEXT_PUBLIC_SITE_TITLE} Feedback <${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}>`,
        to: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
        replyTo: user.email,
        subject: `Feedback from ${user.name ? user.name : user.email} about ${
          process.env.NEXT_PUBLIC_SITE_TITLE
        }`,
        text: comment.text,
        html,
      })

      //TODO: maybe send to slack?

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
