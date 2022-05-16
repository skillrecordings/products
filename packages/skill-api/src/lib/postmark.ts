import postmarkTransport from 'nodemailer-postmark-transport'
import nodemailer, {SendMailOptions} from 'nodemailer'

const transport = nodemailer.createTransport(
  postmarkTransport({
    auth: {
      apiKey: process.env.POSTMARK_KEY || '',
    },
  }),
)

export async function sendPostmarkEmail(options: SendMailOptions) {
  return await transport.sendMail(options)
}
