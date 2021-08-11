import cookies from '@skillrecordings/cookies'

import {ACCESS_TOKEN_KEY} from '@skillrecordings/config'

const getAccessTokenFromCookie = () => {
  if (!ACCESS_TOKEN_KEY) return false
  let token = cookies.get(ACCESS_TOKEN_KEY)
  if (token) {
    return token
  } else if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY) ?? false
  }

  return false
}

export default getAccessTokenFromCookie
