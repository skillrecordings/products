import SkillRecordings, {
  IncomingRequest,
  SkillRecordingsOptions,
} from '@skillrecordings/skill-api'
import {nextAuthOptions} from '../auth/[...nextauth]'
import {NextApiRequest} from 'next'
import {getToken} from 'next-auth/jwt'
import {UserSchema, getCurrentAbility} from '@skillrecordings/skill-lesson'
import {
  defaultPaymentOptions,
  StripeProvider,
} from '@skillrecordings/commerce-server'
import {getSdk} from '@skillrecordings/database'
import * as Amplitude from '@amplitude/node'
import {Identify} from '@amplitude/identify'

export const paymentOptions = defaultPaymentOptions({
  stripeProvider: StripeProvider({
    stripeSecretKey: process.env.STRIPE_SECRET_TOKEN,
    apiVersion: '2020-08-27',
  }),
})

export const skillOptions: SkillRecordingsOptions = {
  site: {
    title: process.env.NEXT_PUBLIC_SITE_TITLE,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL as string,
  },
  slack: {
    token: process.env.SLACK_TOKEN,
    feedback: {
      channelId: process.env.SLACK_FEEDBACK_CHANNEL_ID,
      botUsername: 'TT Feedback Bot',
    },
    redeem: {
      channelId: process.env.SLACK_ANNOUNCE_CHANNEL_ID,
      botUsername: 'TT Redeemer',
    },
  },
  getAbility: async (req: IncomingRequest) => {
    const token = await getToken({req: req as unknown as NextApiRequest})
    return getCurrentAbility({user: UserSchema.parse(token)})
  },
  onPurchase: async (purchaseId: string) => {
    const {getPurchase, getUserById} = getSdk()
    const purchase = await getPurchase({
      where: {id: purchaseId},
    })

    if (!purchase || !purchase.userId) return

    const user = await getUserById({
      where: {id: purchase.userId},
    })

    if (!user) return

    if (purchase?.status === 'Valid' || purchase?.status === 'Restricted') {
      const amplitude = Amplitude.init(
        process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
      )
      const identify = new Identify()
      await amplitude.identify(user.email, null, identify)
      await amplitude.logEvent({
        event_type: 'purchase',
        user_id: user.email,
        event_properties: {
          product: purchase.productId,
          country: purchase.country,
          total: purchase.totalAmount,
          status: purchase.status,
        },
      })
    }
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
