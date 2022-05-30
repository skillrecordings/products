import {useSession} from 'next-auth/react'
import {getCurrentAbility} from '../server/ability'

/**
 * Uses next-auth session data to return a viewer's current ability.
 */
export function useCurrentAbility() {
  const {data: sessionData, status} = useSession()

  return {
    status,
    ability: getCurrentAbility({rules: sessionData?.rules}),
  }
}
