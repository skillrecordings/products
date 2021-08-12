import {getAccessToken} from '../utils'

describe('getAccessToken', () => {
  it('uses the developer access token when set', () => {
    process.env = Object.assign(process.env, {
      NEXT_PUBLIC_DEV_USER_TOKEN: 'the-token',
    })
    const token = getAccessToken({access_token: 'not the token'})
    expect(token).toBe(process.env.NEXT_PUBLIC_DEV_USER_TOKEN)
    process.env = Object.assign(process.env, {
      NEXT_PUBLIC_DEV_USER_TOKEN: '',
    })
  })

  it('uses access_token key on an object', () => {
    const expectedToken = 'access_token'
    const token = getAccessToken({access_token: expectedToken})
    expect(token).toBe(expectedToken)
  })
})
