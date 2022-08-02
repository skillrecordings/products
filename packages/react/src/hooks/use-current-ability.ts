import {getCurrentAbility} from '@skillrecordings/commerce-server'
import {useUser} from './use-user'
import {AppAbility} from '@skillrecordings/commerce-server'

/**
 * Uses next-auth session data to return a viewer's current ability.
 */
export function useCurrentAbility(): {ability: AppAbility} {
  const {user} = useUser()
  return {
    ability: getCurrentAbility({purchases: user?.purchases, role: user?.role}),
  }
}
