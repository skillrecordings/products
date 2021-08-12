import get from 'lodash/get'
import filter from 'lodash/filter'
import reduce from 'lodash/reduce'
import {isBrowser} from 'utils/is-browser'
import getDevAccessToken from 'utils/get-dev-access-token'
import {SellableResource, Viewer} from '@types'
import Auth from 'utils/auth'

export const auth = new Auth()

interface GetAccessTokenArgs {
  access_token?: string
}
export const getAccessToken = (options?: GetAccessTokenArgs) => {
  const devAccessToken = getDevAccessToken()
  return devAccessToken || options?.access_token
}
interface FetchViewerArgs {
  accessToken?: string
  viewAsUser?: string | null
  refreshViewer?: boolean
}
export async function fetchViewer({
  accessToken,
  viewAsUser,
  refreshViewer,
}: FetchViewerArgs): Promise<Viewer> {
  if (!isBrowser()) {
    return Promise.reject('localstorage not available')
  }

  if (viewAsUser && accessToken) {
    return await auth.becomeUser(viewAsUser, accessToken)
  } else if (window.location.pathname === '/redirect') {
    return await auth.handleAuthentication()
  } else if (refreshViewer) {
    return await auth.refreshUser()
  }

  return auth.getLocalUser()
}
const getSitePurchases = (viewer: Viewer) =>
  filter(get(viewer, 'purchased', []), {
    site: process.env.NEXT_PUBLIC_SITE_NAME,
  })
export const getCanViewContent = (sitePurchases: SellableResource[]) => {
  return reduce(
    sitePurchases,
    (canViewContent, currentPurchase) =>
      canViewContent || currentPurchase?.bulk === false,
    false,
  )
}
export const getIsUnclaimedBulkPurchaser = (viewer: Viewer) => {
  const sitePurchases = getSitePurchases(viewer)
  const canViewContent = getCanViewContent(sitePurchases)
  return !canViewContent && sitePurchases.length > 0
}
export type ViewerContext = {
  viewer?: Viewer | null
  viewAsUser?: string | null
  error?: string | null
}

export type ViewerEvent =
  | {type: 'REPORT_IS_LOGGED_IN'; viewer: Viewer; viewAsUser: string | null}
  | {type: 'REPORT_IS_LOGGED_OUT'}
  | {type: 'LOG_IN'; viewer: Viewer}
  | {type: 'LOG_OUT'}
  | {type: 'REQUEST_LOGIN'; email: string}
  | {type: 'REFRESH_VIEWER'}
  | {
      type: 'REPORT_REFRESHED_VIEWER'
      viewer: Viewer
      viewAsUser?: string | null
    }

export type ViewerState =
  | {
      value: 'checkingIfLoggedIn'
      context: ViewerContext & {
        viewer: undefined
        viewAsUser: undefined
        error: undefined
      }
    }
  | {
      value: 'loggedIn'
      context: ViewerContext & {
        viewer: Viewer
        viewAsUser: string | undefined
        error: undefined
      }
    }
  | {
      value: 'loggedOut'
      context: ViewerContext & {
        viewer: undefined
        viewAsUser: undefined
        error: string | undefined
      }
    }
