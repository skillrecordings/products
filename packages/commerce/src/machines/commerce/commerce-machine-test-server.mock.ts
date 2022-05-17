import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {SellableResource} from '@skillrecordings/types'
import {CommerceMachineContext} from '../../@types'
import {eggheadPriceCheckUrl, stripeCheckoutSessionUrl} from './utils'

export const sellable: SellableResource = {
  title: 'Test Sellable',
  slug: 'test-sellable',
  description: 'this is just a test',
  path: '/test-sellable',
  type: 'playlist',
  id: 1,
  price: 1,
  full_price: 1,
  site: 'TEST',
  bulk: false,
  items: [],
  url: 'https://example.com/test-sellable',
  square_cover_480_url: 'https://placekitten.com/480x480',
  square_cover_large_url: 'https://placekitten.com/1200x1200',
  duration: 232,
}

export const defaultContext = {
  sellable,
  upgradeFromSellable: undefined,
  bulk: false,
  quantity: 1,
  stripePriceId: undefined,
} as CommerceMachineContext

export const response200 = [
  {
    full_price: 123.45,
    price: 123.45,
    slug: 'just-javascript-56c83b7b',
    url: 'http://app.egghead.af:5000/api/v1/playlists/just-javascript-56c83b7b',
  },
]
export const server = setupServer(
  rest.post(eggheadPriceCheckUrl, (req, res, ctx) => {
    return res(ctx.json(response200))
  }),
  rest.post(stripeCheckoutSessionUrl, (req, res, ctx) => {
    return res(ctx.json({id: 'test_checkout_session_id'}))
  }),
)
export const realLocation = window.location
afterEach(() => {
  window.location = realLocation
})
beforeAll(() => server.listen())
afterAll(() => server.close())
