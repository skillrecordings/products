import {NextAuthOptions, Theme} from 'next-auth'
import {createHash} from 'crypto'
import type {
  HTMLEmailParams,
  MagicLinkEmailType,
  TextEmailParams,
} from './send-verification-request'
import {sendVerificationRequest} from './send-verification-request'
import {v4} from 'uuid'

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

export async function createVerificationUrl({
  email,
  nextAuthOptions,
  callbackUrl,
  expiresAt,
}: {
  email: string
  nextAuthOptions: NextAuthOptions | undefined
  callbackUrl?: string
  expiresAt?: Date
}) {
  if (!nextAuthOptions) return

  const emailProvider: any = nextAuthOptions.providers.find(
    (provider) => provider.id === 'email',
  )

  callbackUrl = (callbackUrl || baseUrl) as string

  const token = (await emailProvider.generateVerificationToken?.()) ?? v4()

  const ONE_DAY_IN_SECONDS = 86400
  const durationInMilliseconds =
    (emailProvider.maxAge ?? ONE_DAY_IN_SECONDS) * 1000
  const expires = expiresAt || new Date(Date.now() + durationInMilliseconds)

  await nextAuthOptions?.adapter?.createVerificationToken?.({
    identifier: email,
    token: hashToken(token, {
      provider: emailProvider,
      secret: nextAuthOptions.secret,
    }),
    expires,
  })

  const params = new URLSearchParams({callbackUrl, token, email})
  const verificationUrl = `${baseUrl}/api/auth/callback/${emailProvider.id}?${params}`

  return {url: verificationUrl, token, expires}
}

export async function sendServerEmail({
  email,
  callbackUrl,
  nextAuthOptions,
  type = 'login',
  html,
  text,
  expiresAt,
}: {
  email: string
  callbackUrl?: string
  nextAuthOptions: NextAuthOptions
  type?: MagicLinkEmailType
  html?: (options: HTMLEmailParams, theme: Theme) => string
  text?: (options: TextEmailParams) => string
  expiresAt?: Date | null
}) {
  try {
    const verificationDetails = await createVerificationUrl({
      email,
      nextAuthOptions,
      callbackUrl,
      expiresAt: expiresAt || undefined,
    })

    if (!verificationDetails) return

    const {url, token, expires} = verificationDetails

    const emailProvider: any = nextAuthOptions.providers.find(
      (provider) => provider.id === 'email',
    )

    console.log('%%% about to sendVerificationRequest %%%')

    await sendVerificationRequest({
      identifier: email,
      url,
      theme: nextAuthOptions.theme || {colorScheme: 'auto'},
      provider: emailProvider.options,
      token: token as string,
      expires,
      type,
      html,
      text,
    })
  } catch (error: any) {
    console.log({location: 'sendServerEmail', error})

    throw new Error('Unable to sendVerificationRequest')
  }
}
