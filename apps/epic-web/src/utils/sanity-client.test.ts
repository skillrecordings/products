describe('Sanity client routing', () => {
  const originalEnv = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET_ID: process.env.NEXT_PUBLIC_SANITY_DATASET_ID,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
  }

  beforeEach(() => {
    jest.resetModules()
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'testproject'
    process.env.NEXT_PUBLIC_SANITY_DATASET_ID = 'production'
    process.env.NEXT_PUBLIC_SANITY_API_VERSION = '2023-01-01'
    process.env.SANITY_API_TOKEN = 'test-write-token'
  })

  afterEach(() => {
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    }
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
