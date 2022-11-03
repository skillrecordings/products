import {rest} from 'msw'

export const handlers = [
  rest.post(
    'https://castingwords.com/store/API4/order_url',
    (_req, res, ctx) => {
      // if you wanted to grab params as an object
      // const params = Object.fromEntries(_req.url.searchParams.entries())
      return res(
        ctx.json({
          audiofiles: [100, 103],
          message: "Order 'teSt' Created",
          order: 'teSt',
        }),
      )
    },
  ),
]
