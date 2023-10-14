import {inngest} from 'inngest/inngest.server'
import {STRIPE_CHECKOUT_COMPLETED_EVENT} from '@skillrecordings/inngest'
import {LESSON_COMPLETED_EVENT} from '@skillrecordings/skill-lesson'
import {sendTheEmail} from 'server/send-the-email'
import FirstNudge from 'emails/post-purchase-inactive-01-gentle-nudge'
import SecondNudge from 'emails/post-purchase-inactive-02-second-nudge'
import RefundOffer from 'emails/post-purchase-inactive-03-refund-offer'

export const inactivityAfterPurchase = inngest.createFunction(
  {
    id: 'encourage-learner-activity',
    name: 'Encourage Activity for Individual',
    cancelOn: [{event: LESSON_COMPLETED_EVENT, match: 'user.id'}],
  },
  {
    event: STRIPE_CHECKOUT_COMPLETED_EVENT,
    if: 'event.data.quantity == 1',
  },
  async ({event, step}) => {
    await step.sleep('wait for 3 days', '3d')

    await step.run('send a reminder', async () => {
      return await sendTheEmail({
        Component: FirstNudge,
        To: event.user.email,
        Subject: 'Get Started with Epic Web',
        componentProps: {
          name: event.user.name,
        },
      })
    })

    await step.sleep('wait for 7 days', '7d')

    await step.run('send a second reminder', async () => {
      return await sendTheEmail({
        Component: SecondNudge,
        To: event.user.email,
        Subject: `I'm here to help!`,
        componentProps: {
          name: event.user.name,
        },
      })
    })

    await step.sleep('wait for 28 days', '28d')

    await step.run('offer a refund', async () => {
      return await sendTheEmail({
        Component: RefundOffer,
        To: event.user.email,
        Subject: `Just checking in...`,
        componentProps: {
          name: event.user.name,
        },
      })
    })

    return 'yup, here we are'
  },
)
