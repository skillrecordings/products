import {interpret} from 'xstate'
import {SellableResource} from '../../../@types'
import commerceMachine from '../'
import {
  CommerceMachineContext,
  eggheadPriceCheckUrl,
  stripeCheckoutSessionUrl,
} from '../utils'
const sellableData: SellableResource[] = require('../../../../test/data/bundles.development.json')

const sellable = sellableData[0]

const defaultContext = {
  sellable,
  upgradeFromSellable: null,
  bulk: false,
  quantity: 1,
  stripePriceId: undefined,
} as CommerceMachineContext

const realLocation = window.location
afterEach(() => {
  window.location = realLocation
})

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

