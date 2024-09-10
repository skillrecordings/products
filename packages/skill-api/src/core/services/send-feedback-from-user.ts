import {htmlToText} from 'html-to-text'
import sanitizeHtml from 'sanitize-html'
import {getEmoji} from '../../client/get-feedback-emoji'
import {SendFeedbackFromUserOptions} from '../types'
import {sendPostmarkEmail} from '../../lib/postmark'
import {OutgoingResponse} from '../index'
import {postFeedbackToSlack} from '../../server/post-to-slack'
import {NodeHtmlMarkdown} from 'node-html-markdown'
import {prisma, User} from '@skillrecordings/database'

export async function sendFeedbackFromUser({
  emailAddress,
  feedbackText,
  context,
  config,
  numberOfSeats,
}: SendFeedbackFromUserOptions): Promise<OutgoingResponse> {
  const {slack, site} = config

  try {
    const user =
      (await prisma.user.findFirst({
        where: {email: emailAddress?.toLowerCase()},
      })) || ({email: emailAddress} as User)

    if (!user.email) {
      return {
        status: 403,
        body: 'Error: Not Authorized' as any,
      }
    }

    const feedbackTextAsMarkdown = NodeHtmlMarkdown.translate(feedbackText)

    if (user.id) {
      await prisma.comment.create({
        data: {
          userId: user.id,
          text: feedbackTextAsMarkdown,
          context,
          updatedAt: new Date(),
        },
      })
    }

    let from: string
    let emailSubject: string
    let html: string

    if (context?.location === 'bulk-form') {
      from = `${site.title} Quote Requested <${site.supportEmail}>`
      emailSubject = `${
        context?.emotion ? `${getEmoji(context?.emotion).image} ` : ''
      } Quote Requested from ${user.name ? user.name : user.email} about ${
        site.title
      }`
      html = `
    <p>${user.name ? user.name : user.email} requested a quote for ${
        site.title
      } for ${numberOfSeats} seats.</p>
    ${
      feedbackText
        ? `<p>Additional Text: ${sanitizeHtml(feedbackText)}</p>`
        : ''
    }
    ${context?.url ? `<i>${context.url}</i>` : ''}
  `
    } else {
      from = `${site.title} Feedback <${site.supportEmail}>`
      emailSubject = `${
        context?.emotion ? `${getEmoji(context?.emotion).image} ` : ''
      } Feedback from ${user.name ? user.name : user.email} about ${site.title}`
      html = `${sanitizeHtml(feedbackText)} <i>${
        context?.url ? context.url : ''
      }</i>`
    }

    const info = await sendPostmarkEmail({
      from,
      to: site.supportEmail,
      replyTo: user.email,
      subject: emailSubject,
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
