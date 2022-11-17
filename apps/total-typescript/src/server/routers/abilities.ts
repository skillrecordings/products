import {createRouter} from 'server/createRouter'
import {getToken} from 'next-auth/jwt'
import {defineRulesForPurchases, UserSchema} from '../../ability/ability'
import {SubscriberSchema} from '../../schemas/subscriber'
import {NextApiRequest} from 'next'

function getSubscriberFromCookie(req: NextApiRequest) {
  const cookies = req.cookies
  if (!cookies) return null
  const cookie = cookies['ck_subscriber']
  if (!cookie || cookie === 'undefined') return null
  try {
    return SubscriberSchema.parse(JSON.parse(cookie))
  } catch (e) {
    console.error(e)
    return null
  }
}

export const abilities = createRouter().query('getAbilities', {
  async resolve({ctx, input}) {
    const token = await getToken({req: ctx.req})
    const convertkitSubscriber = getSubscriberFromCookie(ctx.req)

    const rules = defineRulesForPurchases({
      ...(token && {user: UserSchema.parse(token)}),
      ...(convertkitSubscriber && {
        subscriber: convertkitSubscriber,
      }),
    })

    return rules
  },
})
