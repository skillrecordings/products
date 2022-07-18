import {useCurrentAbility} from './use-current-ability'
import {useUser} from './use-user'

/**
 * TODO: consider removing this and using abilities?
 */
export function useNavState() {
  const {ability} = useCurrentAbility()

  return {
    isSignedIn: ability.can('view', 'Account'),
    canViewTeam: ability.can('view', 'Team'),
    canViewInvoice: ability.can('view', 'Invoice'),
  }
}
