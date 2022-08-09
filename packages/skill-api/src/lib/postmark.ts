import postmarkTransport from 'nodemailer-postmark-transport'
import nodemailer, {SendMailOptions} from 'nodemailer'

const transport =
  process.env.POSTMARK_KEY &&
  nodemailer.createTransport(
    postmarkTransport({
      auth: {
        apiKey: process.env.POSTMARK_KEY,
      },
    }),
  )

export async function sendPostmarkEmail(options: SendMailOptions) {
  return transport && (await transport.sendMail(options))
}
