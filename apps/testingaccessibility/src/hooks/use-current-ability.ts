import {getCurrentAbility} from '../server/ability'
import {useQuery} from 'react-query'

/**
 * Uses next-auth session data to return a viewer's current ability.
 */
export function useCurrentAbility() {
  // const session = useSession()

  const {data, status} = useQuery('/api/auth/session', async ({queryKey}) => {
    return await fetch(queryKey[0]).then((res) => res.json())
  })

  return {
    status,
    ability: getCurrentAbility({rules: data?.rules}),
    user: data,
  }
}
