import {getCurrentAbility} from '../server/ability'
import {useUser} from './use-user'

/**
 * Uses next-auth session data to return a viewer's current ability.
 */
export function useCurrentAbility() {
  const {user} = useUser()
  return {
    ability: getCurrentAbility({rules: user?.rules}),
  }
}
