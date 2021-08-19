import {rest} from 'msw'
import {setupServer} from 'msw/node'
import cookie from '@skillrecordings/cookies'
import {
  ACCESS_TOKEN_KEY,
  EXPIRES_AT_KEY,
  USER_KEY,
} from '@skillrecordings/config'
import MockDate from 'mockdate'

import Auth, {expirations, getAuthorizationHeader, getLocalUser} from '../index'
import cookies from 'js-cookie'

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

test('returns the viewer when auth suceeds', async () => {
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

test('returns the viewer when auth suceeds', async () => {
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

test('returns the viewer for a new session', async () => {
  const auth = new Auth()
  const accessToken = '0f95fab36e7a'
  const expiresIn = '5184000'

  const viewer = await auth.handleNewSession(accessToken, expiresIn)

  expect(viewer).toEqual(cornDogUser)
})

test('returns the viewer when the session is set', async () => {
  const auth = new Auth()
  const accessToken = '0f95fab36e7a'
  const expiresIn = '5184000'

  const viewer = await auth.setSession(accessToken, expiresIn)

  expect(viewer).toEqual(cornDogUser)
})

test('sets the access token in local storage for a session', async () => {
  const auth = new Auth()
  const accessToken = '0f95fab36e7a'
  const expiresIn = '5184000'

  await auth.setSession(accessToken, expiresIn)

  const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY)

  expect(storedToken).toEqual(accessToken)
})

test('sets session expiration in local storage for a session', async () => {
  const auth = new Auth()
  const accessToken = '0f95fab36e7a'
  const expiresIn = '5184000'

  MockDate.set(new Date(new Date().getTime() + 10000000000))

  const {expiresAt} = expirations(expiresIn, new Date().getTime())

  await auth.setSession(accessToken, expiresIn)

  const storedTokenExpiration = localStorage.getItem(EXPIRES_AT_KEY)

  expect(storedTokenExpiration).toEqual(expiresAt.toString())
})

test('sets session token cookie for a session', async () => {
  const auth = new Auth()
  const accessToken = '0f95fab36e7a'
  const expiresIn = '5184000'

  await auth.setSession(accessToken, expiresIn)

  const cookieToken = cookie.get(ACCESS_TOKEN_KEY)

  expect(cookieToken).toEqual(cookieToken)
})

test('returns a Viewer when refreshUser is called', async () => {
  const auth = new Auth()
  const viewer = await auth.refreshUser()

  expect(viewer).toEqual(cornDogUser)
})

test('stores the Viewer in local storage when refreshUser is called', async () => {
  const auth = new Auth()

  await auth.refreshUser()

  const viewer = JSON.parse(localStorage.getItem(USER_KEY) as string)

  expect(viewer).toEqual(cornDogUser)
})

test('local storage is cleared if an error occurs loading current user', async () => {
  server.use(
    rest.get(`/api/users/current`, (req, res, ctx) => {
      return res.once(
        ctx.status(403),
        ctx.json({message: 'Internal server error'}),
      )
    }),
  )
  const auth = new Auth()
  try {
    await auth.refreshUser()
  } catch (error) {
    const viewer = localStorage.getItem(USER_KEY)
    expect(viewer).toBeNull()
  }
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
