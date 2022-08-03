import NextAuth from 'next-auth'
import {withSentry} from '@sentry/nextjs'
import {defaultNextAuthOptions} from '@skillrecordings/skill-api'

export const nextAuthOptions = defaultNextAuthOptions({
  theme: {
    colorScheme: 'auto',
    brandColor: '#218345',
    logo: 'https://res.cloudinary.com/testing-accessibility/image/upload/v1655584147/logo-email_2x_e0n8tn.png',
  },
})

export default withSentry(NextAuth(nextAuthOptions))

export const config = {
  api: {
    externalResolver: true,
  },
}
