import NextAuth from 'next-auth'
import {withSentry} from '@sentry/nextjs'
import {defaultNextAuthOptions} from '@skillrecordings/skill-api'

export const nextAuthOptions = defaultNextAuthOptions({
  theme: {
    colorScheme: 'auto',
    brandColor: '#3C65AE',
    logo: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1660836515/engmanagement/email-image_2x.png',
  },
})

export default withSentry(NextAuth(nextAuthOptions))

export const config = {
  api: {
    externalResolver: true,
  },
}
