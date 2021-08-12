import axios from 'axios'
import {
  ACCESS_TOKEN_KEY,
  CONVERTKIT_BASE_URL,
  AUTH_DOMAIN,
} from '@skillrecordings/config'

export const convertkitAxios = axios.create({
  baseURL: CONVERTKIT_BASE_URL,
})

export const eggheadAxios = axios.create({
  baseURL: AUTH_DOMAIN,
})

axios.interceptors.request.use(
  function (config: any) {
    const authToken =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem(ACCESS_TOKEN_KEY)
        : null
    const defaultHeaders = authToken
      ? {
          Authorization: `Bearer ${authToken}`,
          'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID,
        }
      : {'X-SITE-CLIENT': process.env.NEXT_PUBLIC_CLIENT_ID}
    const headers = {
      ...defaultHeaders,
      ...config.headers,
    }

    return {...config, headers}
  },
  function (error: any) {
    return Promise.reject(error)
  },
)

export default axios
