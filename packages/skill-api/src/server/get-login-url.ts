import {NextAuthOptions} from 'next-auth'
import {v4} from 'uuid'
import {createHash} from 'crypto'

export const baseUrl = process.env.VERCEL_URL || process.env.NEXTAUTH_URL

function hashToken(token: string, options: any) {
  const {provider, secret} = options
  return (
    createHash('sha256')
      // Prefer provider specific secret, but use default secret if none specified
      .update(`${token}${provider.secret ?? secret}`)
      .digest('hex')
  )
}

export async function getLoginUrl({
  nextAuthOptions,
  identifier,
  callbackUrl,
}: {
  nextAuthOptions: NextAuthOptions
  identifier: string
  callbackUrl: string
}) {
  const emailProvider: any = nextAuthOptions.providers.find(
    (provider) => provider.id === 'email',
  )
  const ONE_DAY_IN_SECONDS = 86400
  const expires = new Date(
    Date.now() + (emailProvider.maxAge ?? ONE_DAY_IN_SECONDS) * 1000,
  )

  const token = (await emailProvider.generateVerificationToken?.()) ?? v4()

  await nextAuthOptions?.adapter?.createVerificationToken?.({
    identifier,
    token: hashToken(token, {
      provider: emailProvider,
      secret: nextAuthOptions.secret,
    }),
    expires,
  })

  const params = new URLSearchParams({callbackUrl, token, email: identifier})
  const url = `${baseUrl}/api/auth/callback/${emailProvider.id}?${params}`

  return {emailProvider, url, token, expires}
}
