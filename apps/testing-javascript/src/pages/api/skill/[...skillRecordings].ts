import SkillRecordings, {
  type SkillRecordingsOptions,
} from '@skillrecordings/skill-api'
import {
  defaultPaymentOptions,
  StripeProvider,
} from '@skillrecordings/commerce-server'
import {nextAuthOptions} from '../auth/[...nextauth]'

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
