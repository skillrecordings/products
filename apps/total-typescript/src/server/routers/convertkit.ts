import {createRouter} from '../createRouter'
import {z} from 'zod'
import {SubscriberSchema} from 'lib/convertkit'
import {updateSubscriber} from '@skillrecordings/convertkit-sdk'

export const convertkitRouter = createRouter().mutation('updateName', {
  input: z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  }),
  async resolve({ctx, input}) {
    const subscriberCookie = ctx.req.cookies['ck_subscriber']
    const {first_name, last_name} = input

    if (!subscriberCookie) {
      console.debug('no subscriber cookie')
      return {error: 'no subscriber found'}
    }

    const subscriber = SubscriberSchema.parse(JSON.parse(subscriberCookie))

    if (!subscriber) {
      console.debug('no subscriber cookie')
      return {error: 'no subscriber found'}
    }

    return SubscriberSchema.parse(
      await updateSubscriber({
        id: subscriber.id,
        first_name,
        fields: {...(last_name && {last_name})},
      }),
    )
  },
})
