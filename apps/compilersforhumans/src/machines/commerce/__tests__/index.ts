import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {interpret} from 'xstate'
import {SellableResource} from '@types'
import commerceMachine from '../'
import {
  CommerceMachineContext,
  eggheadPriceCheckUrl,
  stripeCheckoutSessionUrl,
} from '../utils'
const sellableData: SellableResource[] = require('../../../../data/bundles.development.json')

const sellable = sellableData[0]

const defaultContext = {
  sellable,
  upgradeFromSellable: null,
  bulk: false,
  quantity: 1,
  stripePriceId: undefined,
} as CommerceMachineContext

const response200 = [
  {
    full_price: 123.45,
    price: 123.45,
    slug: 'just-javascript-56c83b7b',
    url: 'http://app.egghead.af:5000/api/v1/playlists/just-javascript-56c83b7b',
  },
]
const server = setupServer(
  rest.post(eggheadPriceCheckUrl, (req, res, ctx) => {
    return res(ctx.json(response200))
  }),
  rest.post(stripeCheckoutSessionUrl, (req, res, ctx) => {
    return res(ctx.json({id: 'test_checkout_session_id'}))
  }),
)
const realLocation = window.location
afterEach(() => {
  window.location = realLocation
})
beforeAll(() => server.listen())
afterAll(() => server.close())

it('transitions immediately to fetching price', () => {
  const service = interpret(commerceMachine.withContext(defaultContext))
  service.start()
  expect(service.state.value).toBe('fetchingPrice')
})

it('applies a coupon from the coupon search param', (done) => {
  const expectedCoupon = 'abc123'
  Reflect.deleteProperty(window, 'location')
  window.location = {
    ...realLocation,
    search: `?coupon=${expectedCoupon}`,
  }
  const service = interpret(commerceMachine.withContext(defaultContext))

  service.onTransition((state) => {
    if (state.matches('fetchingPrice')) {
      expect(state.context.appliedCoupon).toBe(expectedCoupon)
      done()
    }
  })
  service.start()
})

it('loads the price of the sellable', (done) => {
  const service = interpret(commerceMachine.withContext(defaultContext))

  service.onTransition((state) => {
    if (state.matches('priceLoaded')) {
      expect(state.context.price).toStrictEqual(response200[0])
      done()
    }
  })
  service.start()
})

it('starts stripe checkout on event', (done) => {
  let sentToCheckout = false
  const service = interpret(
    commerceMachine
      .withConfig({
        actions: {
          sendToCheckout: () => {
            sentToCheckout = true
          },
        },
      })
      .withContext(defaultContext),
  )

  service.onTransition((state) => {
    // We are testing that this action successfully redirects the viewer to stripe
    if (service.state.matches('priceLoaded'))
      service.send({type: 'START_STRIPE_CHECKOUT'})

    if (state.matches('success')) {
      expect(sentToCheckout).toBeTruthy()
      done()
    }
  })

  service.start()
})
