import {NextAuthOptions} from 'next-auth'

import {createHash, randomBytes} from 'crypto'

const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL

function hashToken(token: string, options: any) {
  const {provider, secret} = options
  return (
    createHash('sha256')
      // Prefer provider specific secret, but use default secret if none specified
      .update(`${token}${provider.secret ?? secret}`)
      .digest('hex')
  )
}

export async function sendServerEmail({
  email,
  callbackUrl,
  nextAuthOptions,
}: {
  email: string
  callbackUrl?: string
  nextAuthOptions: NextAuthOptions
}) {
  const emailProvider: any = nextAuthOptions.providers.find(
    (provider) => provider.id === 'email',
  )

  callbackUrl = (callbackUrl || baseUrl) as string

  const identifier = email

  const token =
    (await emailProvider.generateVerificationToken?.()) ??
    randomBytes(32).toString('hex')

  const ONE_DAY_IN_SECONDS = 86400
  const expires = new Date(
    Date.now() + (emailProvider.maxAge ?? ONE_DAY_IN_SECONDS) * 1000,
  )

  await nextAuthOptions?.adapter?.createVerificationToken?.({
    identifier,
    token: hashToken(token, {
      provider: emailProvider,
      secret: nextAuthOptions.secret,
    }),
    expires,
  })

  const params = new URLSearchParams({callbackUrl, token, email: identifier})
  const _url = `${baseUrl}/api/auth/callback/${emailProvider.id}?${params}`

  await emailProvider.sendVerificationRequest({
    identifier,
    url: _url,
    provider: emailProvider.options,
    token: token as string,
    expires,
  })
}
