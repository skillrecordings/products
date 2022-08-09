import {getSdk} from '@skillrecordings/database'
import mjml2html from 'mjml'
import {Theme} from 'next-auth'
import {SendVerificationRequestParams} from 'next-auth/providers/email'
import {createTransport} from 'nodemailer'
import process from 'process'

export type MagicLinkEmailType =
  | 'login'
  | 'signup'
  | 'reset'
  | 'purchase'
  | 'upgrade'

type HTMLEmailParams = Record<'url' | 'host' | 'email', string>
type TextEmailParams = Record<'url' | 'host', string>

function isValidateEmailServerConfig(server: any) {
  return Boolean(
    server &&
      server.host &&
      server.port &&
      server.auth?.user &&
      server.auth?.pass,
  )
}

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams & {
    type?: MagicLinkEmailType
    html?: (options: HTMLEmailParams, theme: Theme) => string
    text?: (options: TextEmailParams) => string
  },
) => {
  const {
    identifier: email,
    url,
    provider: {server, from},
    text = defaultText,
    html = defaultHtml,
    theme,
  } = params
  const {host} = new URL(url)

  const {getUserByEmail} = getSdk()

  let subject

  switch (params.type) {
    case 'purchase':
      subject = `Thank you for Purchasing ${
        process.env.NEXT_PUBLIC_PRODUCT_NAME ||
        process.env.NEXT_PUBLIC_SITE_TITLE
      } (${host})`
      break
    default:
      subject = `Log in to ${
        process.env.NEXT_PUBLIC_PRODUCT_NAME ||
        process.env.NEXT_PUBLIC_SITE_TITLE
      } (${host})`
  }

  const user = await getUserByEmail(email)

  if (!user) return

  if (process.env.LOG_VERIFICATION_URL) {
    console.log(`\n👋 MAGIC LINK URL ******************\n`)
    console.log(url)
    console.log(`\n************************************\n`)
  }

  if (isValidateEmailServerConfig(server)) {
    const transport = createTransport(server)

    await transport.sendMail({
      to: email,
      from,
      subject,
      text: text({url, host}),
      html: html({url, host, email}, theme),
    })
  } else {
    console.warn(
      `🚫 Invalid email server config. Do you need a POSTMARK_KEY env var?`,
    )
  }
}

function defaultHtml({url, host, email}: HTMLEmailParams, theme: Theme) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`
  const escapedHost = `${host.replace(/\./g, '&#8203;.')}`

  // Some simple styling options
  const backgroundColor = '#F9FAFB'
  const textColor = '#3E3A38'
  const mainBackgroundColor = '#ffffff'
  const buttonBackgroundColor = theme ? theme.brandColor : '#F9FAFB'
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
    ${
      theme?.logo &&
      `<mj-section padding="10px 0 10px 0">
          <mj-column background-color="${backgroundColor}">
            <mj-image alt="${process.env.NEXT_PUBLIC_SITE_TITLE}" width="180px" src="${theme.logo}" />
          </mj-column>
        </mj-section>`
    }
    <mj-section padding-top="0">
      <mj-column background-color="${mainBackgroundColor}" padding="16px 10px">
        <mj-text font-size="18px" color="${textColor}" align="center" padding-bottom="20px">
          Log in as <strong color="${textColor}">${escapedEmail}</strong> to ${
    process.env.NEXT_PUBLIC_SITE_TITLE
  }.
        </mj-text>
        <mj-button href="${url}" background-color="${buttonBackgroundColor}" color="${buttonTextColor}" target="_blank" border-radius="6px" font-size="18px" font-weight="bold">
          Log in
        </mj-button>

        <mj-text color="${textColor}" align="center"  padding="30px 90px 10px 90px">
          The link is valid for 24 hours or until it is used once. You will stay logged in for 60 days. <a href="${
            process.env.NEXT_PUBLIC_URL
          }/login" target="_blank">Click here to request another link</a>.
        </mj-text>
        <mj-text color="${textColor}" align="center" padding="10px 90px 10px 90px">
          Once you are logged in, you can <a href="${
            process.env.NEXT_PUBLIC_URL
          }/invoices" target="_blank">access your invoice here</a>.
        </mj-text>
        <mj-text color="${textColor}" align="center" padding="10px 90px 10px 90px">
          If you need additional help, reply!
        </mj-text>
        <mj-text color="gray" align="center" padding-top="40px">
          If you did not request this email you can safely ignore it.
        </mj-text>
    </mj-section>
  </mj-body>
</mjml>
`)

  return html
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function defaultText({url, host}: TextEmailParams) {
  return `Log in to ${host}\n${url}\n\n`
}
