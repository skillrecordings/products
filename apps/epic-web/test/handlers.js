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
  rest.get('http://localhost:3021/api/cloudinary/sign', (_req, res, ctx) => {
    // if you wanted to grab params as an object
    // const params = Object.fromEntries(_req.url.searchParams.entries())
    return res(
      ctx.json({
        timestamp: 1687032751,
        signature: '13fb3ca400f04fb08fe21f3d72e249df31bc26a9',
        cloudName: 'dqtnmge3x',
        apiKey: '827973872319274',
        folderName: 'epic-web',
      }),
    )
  }),
  rest.post(
    'https://api.cloudinary.com/v1_1/dqtnmge3x/video/upload',
    (_req, res, ctx) => {
      // if you wanted to grab params as an object
      // const params = Object.fromEntries(_req.url.searchParams.entries())
      return res(
        ctx.json({
          secure_url: 'http://example.com',
        }),
      )
    },
  ),
]
