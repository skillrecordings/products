describe('Sanity client routing', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'testproject',
      NEXT_PUBLIC_SANITY_DATASET_ID: 'production',
      NEXT_PUBLIC_SANITY_API_VERSION: '2023-01-01',
      SANITY_API_TOKEN: 'test-write-token',
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  test('public reads use the API CDN without a token', () => {
    const {sanityClient} = require('./sanity-client')

    expect(sanityClient.config()).toMatchObject({
      projectId: 'testproject',
      dataset: 'production',
      useCdn: true,
    })
    expect(sanityClient.config().token).toBeUndefined()
  })

  test('authenticated writes keep the live API and published perspective', () => {
    const {sanityWriteClient} = require('./sanity-server')

    expect(sanityWriteClient.config()).toMatchObject({
      useCdn: false,
      token: 'test-write-token',
      perspective: 'published',
    })
  })
})
