import {getCurrentAbility} from '@skillrecordings/ability'
import {useUser} from './use-user'
import type {AppAbility} from '@skillrecordings/ability'

/**
 * Uses next-auth session data to return a viewer's current ability.
 */
export function useCurrentAbility(): {ability: AppAbility} {
  const {user} = useUser()
  return {
    ability: getCurrentAbility({purchases: user?.purchases, role: user?.role}),
  }
}
