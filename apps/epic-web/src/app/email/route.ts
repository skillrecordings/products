import nodemailer from 'nodemailer'
import {render} from '@react-email/render'
import HelloEmail from 'emails/hello-email'

export async function GET(req: Request) {
  const emailHtml = render(HelloEmail())

  console.log(emailHtml)

  return new Response(emailHtml, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  })
}
