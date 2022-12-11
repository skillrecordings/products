import {createRouter} from 'server/createRouter'
import {getSubscriberFromCookie} from '../ck-subscriber-from-cookie'

export const subscriberRouter = createRouter().query('current', {
  async resolve({ctx, input}) {
    const subscriber = await getSubscriberFromCookie(ctx.req)
    return subscriber ? subscriber : undefined
  },
})
