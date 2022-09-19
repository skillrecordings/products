import {buildCastingwordsOrderUrl} from './castingwords'

test('should build correct castingwords order url', () => {
  const url = buildCastingwordsOrderUrl({
    skus: ['test1'],
    originalMediaUrl: 'https://example.com/video.mp4',
  })

  expect(url).toEqual(`correct castingwords url here`)
})
