import mjml2html from 'mjml'
import NextAuth from 'next-auth'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import {PrismaClient} from '@prisma/client'
import EmailProvider from 'next-auth/providers/email'
import nodemailer from 'nodemailer'
const prisma = new PrismaClient()

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: {server, from},
      }) {
        const {host} = new URL(url)
        const transport = nodemailer.createTransport(server)
        await transport.sendMail({
          to: email,
          from,
          subject: `Iniciar sesión a ${host}`,
          text: text({url, host}),
          html: html({url, host, email}),
        })
      },
    }),
  ],
  pages: {
    signIn: '/acceso',
    verifyRequest: '/confirmar-email',
  },
})

function html({url, email}: Record<'url' | 'host' | 'email', string>) {
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`

  const backgroundColor = '#FAFAFA'
  const textColor = '#3E3A38'
  const mainBackgroundColor = '#ffffff'
  const buttonBackgroundColor = '#2563eb'
  const buttonTextColor = '#ffffff'

  const {html} = mjml2html(`
  <mjml>
    <mj-head>
      <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600" />
      <mj-attributes>
        <mj-all font-family="Inter, Helvetica, sans-serif" line-height="1.5" />
      </mj-attributes>
      <mj-raw>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </mj-raw>
    </mj-head>
    <mj-body background-color="${backgroundColor}">
      <mj-section padding="10px">
        <mj-column background-color="${backgroundColor}">
          <mj-image alt="Escuela Frontend" width="100px" src="https://res.cloudinary.com/escuela-frontend/image/upload/v1657770481/brand-assets/icon-dark2x_r4jfq4.png" />
        </mj-column>
      </mj-section>
      <mj-section padding-top="0">
        <mj-column background-color="${mainBackgroundColor}" padding="16px 10px">
          <mj-text font-size="18px" color="${textColor}" align="center" padding-bottom="20px">
            Iniciar sesión a Escuela Frontend con <strong color="${textColor}">${escapedEmail} 
            </strong>
          </mj-text>
          <mj-button href="${url}" background-color="${buttonBackgroundColor}" color="${buttonTextColor}" target="_blank" border-radius="6px" font-size="18px" font-weight="bold">
          Iniciar Sesión
          </mj-button>
          <mj-text color="gray" align="center" padding-top="20px">
            Si no solicitó este correo electrónico, puede ignorarlo con seguridad.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `)

  return html
}

// Fallback for non-HTML email clients
function text({url, host}: any) {
  return `Iniciar sesión a ${host}\n${url}\n\n`
}
