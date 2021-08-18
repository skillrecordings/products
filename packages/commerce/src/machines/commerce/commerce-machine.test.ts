import {
  server,
  defaultContext,
  response200,
  realLocation,
} from './commerce-machine-test-server.mock'
import commerceMachine from './index'
import {interpret} from 'xstate'

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
