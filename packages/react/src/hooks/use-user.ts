import {useQuery} from 'react-query'
import type {Purchase, User} from '@skillrecordings/database'

type SessionUser = {
  purchases: Purchase[]
  role: string
  user: User
}

export function useUser() {
  const {data, status: userLoadingStatus} = useQuery(
    ['/api/auth/session'],
    async ({queryKey}): Promise<SessionUser> => {
      return await fetch(queryKey[0]).then((res) => res.json())
    },
  )

  return {
    userLoadingStatus,
    user: data,
  }
}
