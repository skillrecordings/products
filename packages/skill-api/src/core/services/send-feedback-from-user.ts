import {htmlToText} from 'html-to-text'
import sanitizeHtml from 'sanitize-html'
import {getEmoji} from '../../client/get-feedback-emoji'
import {SendFeedbackFromUserOptions} from '../types'
import {sendPostmarkEmail} from '../../lib/postmark'
import {OutgoingResponse} from '../index'
import {postFeedbackToSlack} from '../../server/post-to-slack'
import {NodeHtmlMarkdown} from 'node-html-markdown'
import {User} from '../../../generated/prisma/client'

export async function sendFeedbackFromUser({
  emailAddress,
  feedbackText,
  context,
  config,
}: SendFeedbackFromUserOptions): Promise<OutgoingResponse> {
  const {prismaClient, slack, site} = config

  console.log('sendFeedbackFromUser', {emailAddress})
  try {
    const user =
      (await prismaClient.user.findFirst({
        where: {email: emailAddress?.toLowerCase()},
      })) || ({email: emailAddress} as User)

    console.log({user})

    if (!user.email) {
      return {
        status: 403,
        body: 'Error: Not Authorized' as any,
      }
    }

    const feedbackTextAsMarkdown = NodeHtmlMarkdown.translate(feedbackText)

    if (user.id) {
      await prismaClient.comment.create({
        data: {
          userId: user.id,
          text: feedbackTextAsMarkdown,
          context,
          updatedAt: new Date(),
        },
      })
    }

    const html = `${sanitizeHtml(feedbackText)} <i>${
      context?.url ? context.url : ''
    }</i>`

    const info = await sendPostmarkEmail({
      from: `${site.title} Feedback <${site.supportEmail}>`,
      to: site.supportEmail,
      replyTo: user.email,
      subject: `${
        context?.emotion ? `${getEmoji(context?.emotion).image} ` : ''
      }Feedback from ${user.name ? user.name : user.email} about ${site.title}`,
      text: htmlToText(feedbackText),
      html,
    })

    if (slack?.feedback) {
      await postFeedbackToSlack(feedbackTextAsMarkdown, context, user, slack)
    }

    return {
      status: 200,
      body: info,
    }
  } catch (error: any) {
    return {
      status: 500,
      body: `Error: ${error.message}`,
    }
  }
}
