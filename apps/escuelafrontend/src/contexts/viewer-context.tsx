import React, {FunctionComponent} from 'react'
import Auth from '../utils/auth'
import queryString from 'query-string'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import filter from 'lodash/filter'
import reduce from 'lodash/reduce'
import first from 'lodash/first'
import find from 'lodash/find'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'
import getBundles from '../utils/get-bundles'
import {sortPurchases} from '../utils/sort-purchases'
import {AvailableUpgrade, SellableResource} from '../@types'

export const auth = new Auth()

type ViewerContextType = {
  authenticated?: boolean
  viewer?: any
  authToken?: any
  requestSignInEmail?: any
  logout?: any
  loading: boolean
  refreshUser?: any
  setViewerEmail: (newEmail: string) => void
  viewingAsUserEmail?: any
  upgradeToSellable?: any
  upgradeFromSellable?: any
  isAuthenticated?: any
  setSession?: any
  sitePurchases?: any
  isUnclaimedBulkPurchaser?: boolean
}

const defaultViewerContext: ViewerContextType = {
  authenticated: false,
  loading: true,
  setViewerEmail: (_) => {},
}

export function useViewer() {
  return React.useContext(ViewerContext)
}

export const ViewerContext = React.createContext(defaultViewerContext)

function useAuthedViewer() {
  const [viewer, setViewer] = React.useState<any>(auth.getLocalUser())
  const viewerId = get(viewer, 'id', null)
  const [loading, setLoading] = React.useState(true)
  const [loggingOut, setLoggingOut] = React.useState(false)
  const previousViewer = React.useRef(viewer)

  const setViewerEmail = (newEmail: string) => {
    setViewer((prevViewer: any) => {
      return {...prevViewer, email: newEmail}
    })
  }

  React.useEffect(() => {
    setViewer(auth.getLocalUser())
  }, [])

  React.useEffect(() => {
    previousViewer.current = viewer
  })

  React.useEffect(() => {
    const querySearch = queryString.parse(window.location.search)
    const viewAsUser = get(querySearch, 'show-as-user')
    const queryHash = queryString.parse(window.location.hash)
    const accessToken = get(queryHash, 'access_token')
    const noAccessTokenFound = isEmpty(accessToken)
    const viewerIsPresent = !isEmpty(viewerId)
    const authToken = getAccessTokenFromCookie()

    if (loggingOut) {
      const doLogout = async () => {
        await auth.logout()
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      }
      doLogout()
      return
    }

    let viewerMonitorIntervalId: number | undefined

    const loadViewerFromStorage = async () => {
      const localViewer = auth.getLocalUser()

      if (localViewer) {
        if (!isEqual(localViewer.id, viewerId)) {
          setViewer(localViewer)
        }
        setLoading(() => false)
      }

      auth.refreshUser().then((newViewer: any) => {
        if (!isEqual(newViewer.id, viewerId)) {
          setViewer(newViewer)
        }
        setLoading(() => false)
      })
    }

    const clearAccessToken = () => {
      if (!isEmpty(accessToken)) {
        window.history.replaceState({}, document.title, '.')
      }
    }

    const setViewerOnInterval = () => {
      const newViewer = auth.getLocalUser()
      if (!isEmpty(newViewer) && !isEqual(newViewer, previousViewer.current)) {
        setViewer(newViewer)
      }
    }

    const clearUserMonitorInterval = () => {
      const intervalPresentForClearing = !isEmpty(viewerMonitorIntervalId)
      if (intervalPresentForClearing) {
        window.clearInterval(viewerMonitorIntervalId)
      }
    }

    const loadViewerFromToken = async () => {
      const localViewer = auth.getLocalUser()

      if (localViewer) {
        if (!isEqual(localViewer.id, viewerId)) {
          setViewer(localViewer)
        }
        setLoading(() => false)
      }
      auth
        .handleCookieBasedAccessTokenAuthentication(authToken)
        .then((viewer: any) => {
          setViewer(viewer)
          setLoading(() => false)
        })
    }

    const loadBecomeViewer = async () => {
      auth.becomeUser(viewAsUser, accessToken)?.then((viewer) => {
        setViewer(viewer)
        setLoading(() => false)
      })
    }

    if (viewAsUser && accessToken) {
      loadBecomeViewer()
    } else if (authToken) {
      loadViewerFromToken()
    } else if (viewerIsPresent) {
      loadViewerFromStorage()
      clearAccessToken()
    } else if (noAccessTokenFound) {
      viewerMonitorIntervalId = auth.monitor(setViewerOnInterval)
      setLoading(() => false)
    } else {
      auth.handleAuthentication().then((viewer: any) => {
        setViewer(viewer)
        setLoading(() => false)
      })
    }

    return clearUserMonitorInterval
  }, [viewerId, loggingOut])

  React.useEffect(() => {
    window.becomeUser = auth.becomeUser
  }, [])
  const allPurchases = get(viewer, 'purchased') || ([] as SellableResource[])
  const sitePurchases = filter(allPurchases, {
    site: process.env.NEXT_PUBLIC_SITE_NAME,
  }).sort(sortPurchases)

  const bestPurchase = first(sitePurchases)
  const availableUpgrades =
    bestPurchase?.available_upgrades as AvailableUpgrade[]
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

  const values = React.useMemo(
    () => ({
      viewer,
      setViewerEmail,
      sitePurchases,
      logout: () => {
        auth.logout()
        window.location.reload()
      },
      setSession: auth.setSession,
      isAuthenticated: () => auth.isAuthenticated(),
      authToken: auth.getAuthToken(),
      requestSignInEmail: (email: any) => auth.requestSignInEmail(email),
      loading,
      viewingAsUserEmail: auth.getViewingAsUser(),
      upgradeFromSellable,
      upgradeToSellable,
      isUnclaimedBulkPurchaser,
    }),
    [viewer, loading],
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
