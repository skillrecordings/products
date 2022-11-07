import NextAuth, {type NextAuthOptions} from 'next-auth'
import {withSentry} from '@sentry/nextjs'
import {defaultNextAuthOptions} from '@skillrecordings/skill-api'

export const nextAuthOptions: NextAuthOptions = defaultNextAuthOptions({
  theme: {
    colorScheme: 'auto',
    brandColor: '#10172a',
    logo: 'https://res.cloudinary.com/total-typescript/image/upload/v1667577587/illustrations/gem-darker_wogtyw.png',
  },
})

export default withSentry(NextAuth(nextAuthOptions))

export const config = {
  api: {
    externalResolver: true,
  },
}
