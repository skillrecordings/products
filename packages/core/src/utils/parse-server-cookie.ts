import * as serverCookie from 'cookie'
import {ACCESS_TOKEN_KEY} from './auth'
import {CK_SUBSCRIBER_KEY} from '../contexts/convertkit-context'

interface ParsedCookie {
  [key: string]: string
}

const getConvertkitId = (parsedCookie: ParsedCookie) => {
  const result = CK_SUBSCRIBER_KEY ? parsedCookie[CK_SUBSCRIBER_KEY] : ''
  return result || ''
}

export default function getTokenFromCookieHeaders(serverCookies: string = '') {
  const parsedCookie = serverCookie.parse(serverCookies)
  const eggheadToken = parsedCookie[ACCESS_TOKEN_KEY] || ''
  const convertkitId = getConvertkitId(parsedCookie)
  return {convertkitId, eggheadToken, loginRequired: eggheadToken.length <= 0}
}
