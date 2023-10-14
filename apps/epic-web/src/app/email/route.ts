import nodemailer from 'nodemailer'
import {render} from '@react-email/render'
import {NotionMagicLinkEmail} from 'react-email-templates/emails/notion-magic-link'

export async function GET(req: Request) {
  const emailHtml = render(
    NotionMagicLinkEmail({
      loginCode: 'sparo-ndigo-amurt-secan',
    }),
  )

  console.log(emailHtml)

  return new Response(emailHtml, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  })
}
