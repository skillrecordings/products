import {buildCastingwordsOrderUrl, orderTranscript} from './castingwords'

test('should build correct castingwords order url', () => {
  const url = buildCastingwordsOrderUrl({
    skus: ['test1'],
    originalMediaUrl: 'https://example.com/video.mp4',
  })

  expect(url).toEqual(
    `https://castingwords.com/store/API4/order_url?sku=test1&test=1&url=https%3A%2F%2Fexample.com%2Fvideo.mp4&api_key=castingwords-api-key`,
  )
})

test('orderTranscript should call castingwords url and return order', async () => {
  const order = await orderTranscript(
    'https://www.dropbox.com/s/bssbwpz4khvvosr/beginners-01.problem.mp4?dl=1',
  )
  expect(order.order).toEqual(`teSt`)
})
