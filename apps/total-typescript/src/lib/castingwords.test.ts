import {buildCastingwordsOrderUrl, orderTranscript} from './castingwords'

test('should build correct castingwords order url', () => {
  const url = buildCastingwordsOrderUrl({
    skus: ['test1'],
    originalMediaUrl: 'https://example.com/video.mp4',
  })

  expect(url).toEqual(`correct castingwords url here`)
})

test('orderTranscript should call castingwords url and return order', async () => {
  const order = await orderTranscript(
    'https://www.dropbox.com/s/bssbwpz4khvvosr/beginners-01.problem.mp4?dl=1',
  )

  expect(order.order).toEqual(`wat is this`)
})
