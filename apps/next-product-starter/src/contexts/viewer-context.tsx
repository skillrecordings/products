import React, {FunctionComponent} from 'react'
import get from 'lodash/get'
import filter from 'lodash/filter'
import reduce from 'lodash/reduce'
import first from 'lodash/first'
import find from 'lodash/find'
import getBundles from '../utils/get-bundles'
import {sortPurchases} from '../utils/sort-purchases'
import {AvailableUpgrade, SellableResource} from '../@types'
import viewerMachine from 'machines/viewer'
import {auth} from 'machines/viewer/utils'
import {useMachine} from '@xstate/react'
import {isEmpty} from 'lodash'

type ViewerContextType = {
  authenticated?: boolean
  viewer?: any
  requestSignInEmail?: any
  logout?: any
  viewAsEmail?: any
  upgradeToSellable?: any
  upgradeFromSellable?: any
  isAuthenticated?: any
  sitePurchases?: any
  isUnclaimedBulkPurchaser?: boolean
  refreshViewer?: () => void
}

const defaultViewerContext: ViewerContextType = {
  authenticated: false,
}

export function useViewer() {
  return React.useContext(ViewerContext)
}

export const ViewerContext = React.createContext(defaultViewerContext)

function useAuthedViewer() {
  const [machineState, send] = useMachine(viewerMachine)
  const viewerState = machineState.value
  const viewer = machineState.context.viewer
  const viewAsEmail = machineState.context.viewAsUser

  React.useEffect(() => {
    window.becomeUser = auth.becomeUser
  }, [])

  const allPurchases = get(viewer, 'purchased') || ([] as SellableResource[])
  const sitePurchases = filter(allPurchases, {
    site: process.env.NEXT_PUBLIC_SITE_NAME,
  }).sort(sortPurchases)

  const bestPurchase = first(sitePurchases)
  const availableUpgrades = bestPurchase?.available_upgrades as AvailableUpgrade[]
  const nextUpgrade = first(availableUpgrades) // we only sell one upgrade
  const siteSellables: any = getBundles()
  const upgradeFromSellable =
    get(bestPurchase, 'slug') === process.env.NEXT_PUBLIC_PRO_SLUG &&
    !get(bestPurchase, 'coupon.region_restricted', false)
      ? null
      : bestPurchase
  const upgradeToSellable = nextUpgrade
    ? find(siteSellables, {slug: nextUpgrade.slug}) // must add bundles for this to work
    : null
  const canViewContent = reduce(
    sitePurchases,
    (canViewContent, currentPurchase) => {
      if (canViewContent) {
        return canViewContent
      }

      return get(currentPurchase, 'bulk', false) !== true
    },
    false,
  )

  const isUnclaimedBulkPurchaser = !canViewContent && sitePurchases.length > 0
  console.log(machineState)
  const values = React.useMemo(
    () => ({
      viewer,
      sitePurchases,
      logout: () => send('LOG_OUT'),
      isAuthenticated: machineState.matches('loggedIn'),
      requestSignInEmail: (email: string) =>
        new Promise((resolve) => {
          send('REQUEST_LOGIN', {email})
          resolve(email)
        }),
      viewerState,
      viewAsEmail,
      upgradeFromSellable,
      upgradeToSellable,
      isUnclaimedBulkPurchaser,
      refreshViewer: () => {
        if (machineState.matches('loggedIn')) {
          send('REFRESH_VIEWER')
        }
      },
    }),
    [viewer?.id, viewerState],
  )

  return values
}

export const ViewerProvider: FunctionComponent = ({children}) => {
  const values = useAuthedViewer()

  return (
    <ViewerContext.Provider value={{...values}}>
      {children}
    </ViewerContext.Provider>
  )
}
