import NextAuth from 'next-auth'
import {defaultNextAuthOptions} from '@skillrecordings/skill-api'

export const nextAuthOptions = defaultNextAuthOptions({
  theme: {
    colorScheme: 'auto',
    brandColor: '#F59E0B',
  },
})

export default NextAuth(nextAuthOptions)
