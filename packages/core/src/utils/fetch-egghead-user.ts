import axios from 'axios'
import {log} from './log'

const EGGHEAD_AUTH_DOMAIN = process.env.NEXT_PUBLIC_AUTH_DOMAIN

const eggAxios = axios.create({
  baseURL: EGGHEAD_AUTH_DOMAIN,
})

export default async function fetchEggheadUser(token: any) {
  const {data: current} = await eggAxios.get(
    `/api/v1/users/current?minimal=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  log('successfully fetched egghead user')
  return current
}
