import {NextAuthOptions} from 'next-auth'
import type {MagicLinkEmailType} from './send-verification-request'
import {sendVerificationRequest} from './send-verification-request'
import {baseUrl, getLoginUrl} from './get-login-url'

export async function sendServerEmail({
  email,
  callbackUrl,
  nextAuthOptions,
  type = 'login',
}: {
  email: string
  callbackUrl?: string
  nextAuthOptions: NextAuthOptions
  type?: MagicLinkEmailType
}) {
  if (!nextAuthOptions) return

  callbackUrl = (callbackUrl || baseUrl) as string
  const {token, url, emailProvider, expires} = await getLoginUrl({
    callbackUrl,
    identifier: email,
    nextAuthOptions,
  })

  await sendVerificationRequest({
    identifier: email,
    url,
    theme: nextAuthOptions.theme || {colorScheme: 'auto'},
    provider: emailProvider.options,
    token: token as string,
    expires,
    type,
  })
}
