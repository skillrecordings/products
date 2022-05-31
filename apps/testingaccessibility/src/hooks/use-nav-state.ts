import {useCurrentAbility} from './use-current-ability'

/**
 * TODO: consider removing this and using abilities?
 */
export function useNavState() {
  const {status, ability} = useCurrentAbility()

  return {
    isSignedIn: status === 'authenticated',
    isLoadingUser: status === 'loading',
    canViewTeam: ability.can('view', 'Team'),
  }
}
