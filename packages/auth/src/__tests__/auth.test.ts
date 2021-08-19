import {rest} from 'msw'
import {setupServer} from 'msw/node'
import cookie from '@skillrecordings/cookies'
import {ACCESS_TOKEN_KEY, USER_KEY} from '@skillrecordings/config'

import Auth, {getAuthorizationHeader, getLocalUser} from '../index'

export const cornDogUser = {
  name: 'Corn Dog',
}

export const server = setupServer(
  // we can fake the actual user tat gets loaded with msw 🎉
  rest.get(`/api/users/current`, (req, res, ctx) => {
    return res(ctx.json(cornDogUser))
  }),
)

beforeAll(() => server.listen())
afterAll(() => server.close())

afterEach(() => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  cookie.remove(ACCESS_TOKEN_KEY)
})

test('can create an instance of Auth', () => {
  const auth = new Auth()
  expect(auth).not.toBeNull()
})

test('read the token from auth instance', async () => {
  const auth = new Auth()
  const accessToken = '0f95fab36e7a'

  const token = await auth.eggheadAuth.token.getToken(
    `${process.env.NEXT_PUBLIC_REDIRECT_URI}#access_token=${accessToken}&token_type=bearer&expires_in=5184000`,
  )

  expect(token.accessToken).toBe(accessToken)
})

test('handle new session', async () => {
  const auth = new Auth()
  const accessToken = '0f95fab36e7a'
  const expiresIn = 5184000
  const url = `${process.env.NEXT_PUBLIC_REDIRECT_URI}#access_token=${accessToken}&token_type=bearer&expires_in=${expiresIn}`

  // set the testURL in package.json to the redirect DOMAIN, then we can
  // push state and get a new URL and simulate a valid login
  //https://github.com/facebook/jest/issues/890#issuecomment-506926841
  window.history.pushState({}, '', url)

  const viewer = await auth.handleAuthentication()

  expect(viewer).toEqual(cornDogUser)
})

test('sends the proper Authorization header', () => {
  // since this test is using a mock service, we want to verify that the
  // request is structured as we expect
  // TODO: Figure out how to intercept and analyze the mock api request with msw
  fail()
})

describe('getAuthorizationHeader', () => {
  test('return auth header if cookie is set ', () => {
    const token = 'TEST-AUTH'
    cookie.set(ACCESS_TOKEN_KEY, token)
    const header = getAuthorizationHeader()

    expect(header).toEqual({Authorization: `Bearer ${token}`})
  })

  test('return auth header if localStorage is set ', () => {
    const token = 'TEST-AUTH'
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
    const header = getAuthorizationHeader()

    expect(header).toEqual({Authorization: `Bearer ${token}`})
  })

  test('return false if no token is available', () => {
    const header = getAuthorizationHeader()

    expect(header).toEqual(false)
  })
})

describe('getLocalUser', () => {
  it('returns the user object in local storage', () => {
    const user = {email: 'bonkers@example.com'}
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    const storedUser = getLocalUser()

    expect(storedUser).toEqual(user)
  })
})
