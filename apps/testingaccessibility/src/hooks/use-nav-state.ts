import {useCurrentAbility} from './use-current-ability'
import {isEmpty} from 'lodash'

/**
 * TODO: consider removing this and using abilities?
 */
export function useNavState() {
  const {status, ability, user} = useCurrentAbility()

  return {
    isSignedIn: ability.can('view', 'Account'),
    isLoadingUser: status === 'loading',
    canViewTeam: ability.can('view', 'Team'),
    canViewInvoice: ability.can('view', 'Invoice'),
  }
}
