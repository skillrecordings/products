import {useQuery} from 'react-query'

export function useUser() {
  const {data, status: userLoadingStatus} = useQuery(
    '/api/auth/session',
    async ({queryKey}) => {
      return await fetch(queryKey[0]).then((res) => res.json())
    },
  )

  return {
    userLoadingStatus,
    user: data,
  }
}
