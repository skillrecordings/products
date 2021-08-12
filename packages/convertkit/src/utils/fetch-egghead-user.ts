import {eggheadAxios} from '@skillrecordings/axios'

export default async function fetchEggheadUser(token: any) {
  const {data: current} = await eggheadAxios.get(
    `/api/v1/users/current?minimal=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  process.env.NODE_ENV === 'development' &&
    console.log('successfully fetched egghead user')
  return current
}
