import axios from 'axios'

if (!process.env.CONVERTKIT_BASE_URL)
  throw new Error('No Convertkit API Base Url Found: CONVERTKIT_BASE_URL')

export const convertkitAxios = axios.create({
  baseURL: process.env.CONVERTKIT_BASE_URL,
})