import SkillRecordings, {
  IncomingRequest,
  SkillRecordingsOptions,
} from '@skillrecordings/skill-api'
import {nextAuthOptions} from '../auth/[...nextauth]'
import {getToken} from 'next-auth/jwt'
import {NextApiRequest} from 'next'
import {getCurrentAbility, UserSchema} from '@skillrecordings/skill-lesson'
import {
  defaultPaymentOptions,
  StripeProvider,
} from '@skillrecordings/commerce-server'

export const paymentOptions = defaultPaymentOptions({
  stripeProvider: StripeProvider({
    stripeSecretKey: process.env.STRIPE_SECRET_TOKEN,
    apiVersion: '2020-08-27',
  }),
})

export const skillOptions: SkillRecordingsOptions = {
  site: {
    title: process.env.NEXT_PUBLIC_SITE_TITLE,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
  nextAuthOptions,
  paymentOptions,
  getAbility: async (req: IncomingRequest) => {
    const token = await getToken({req: req as unknown as NextApiRequest})
    return getCurrentAbility({user: UserSchema.parse(token)})
  },
}

export default SkillRecordings(skillOptions)

/**
 * bodyParser MUST be false to handle webhooks
 */
export const config = {
  api: {
    bodyParser: false,
  },
}
