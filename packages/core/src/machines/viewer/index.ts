import {createMachine, assign} from 'xstate'
import {identify} from '../../utils/analytics'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import queryString from 'query-string'
import {isBrowser} from '../../utils/is-browser'
import {
  ViewerContext,
  ViewerEvent,
  ViewerState,
  fetchViewer,
  getAccessToken,
  getIsUnclaimedBulkPurchaser,
  getCanViewContent,
  auth,
} from './utils'

export const viewerMachine = createMachine<
  ViewerContext,
  ViewerEvent,
  ViewerState
>(
  {
    id: 'viewerAuthentication',
    initial: 'checkingIfLoggedIn',
    context: {
      viewer: undefined,
      viewAsUser: undefined,
      error: undefined,
    },
    states: {
      checkingIfLoggedIn: {
        invoke: {
          src: 'checkIfLoggedIn',
          onError: {
            target: 'loggedOut',
          },
        },
        on: {
          REPORT_IS_LOGGED_IN: {
            target: 'loggedIn',
            actions: 'assignViewerToContext',
          },
          REPORT_IS_LOGGED_OUT: 'loggedOut',
        },
      },
      loggedIn: {
        entry: ['identify', 'navigate'],
        on: {
          LOG_OUT: {
            target: 'loggedOut',
          },
        },
        initial: 'stable',
        states: {
          stable: {
            on: {
              REFRESH_VIEWER: {
                target: 'refreshing',
              },
            },
          },
          refreshing: {
            invoke: {src: 'refreshViewer'},
            on: {
              REPORT_REFRESHED_VIEWER: {
                target: 'stable',
                actions: 'assignViewerToContext',
              },
            },
          },
        },
      },
      loggedOut: {
        entry: ['clearViewerFromContext', 'clearStorage', 'navigate'],
        invoke: {
          src: 'loggedOutInterval',
        },
        on: {
          LOG_IN: {
            target: 'loggedIn',
            actions: 'assignViewerToContext',
          },
          REQUEST_LOGIN: {
            actions: 'sendLoginRequest',
          },
        },
      },
    },
  },
  {
    services: {
      refreshViewer: (_context, _event) => async (send, _onReceive) => {
        try {
          const newViewer = await fetchViewer({
            refreshViewer: true,
          })

          send({
            type: 'REPORT_REFRESHED_VIEWER',
            viewer: newViewer,
          })
        } catch (e) {
          send({type: 'LOG_OUT'})
        }
      },
      loggedOutInterval: (context, _event) => (send, _onReceive) => {
        const id = auth.monitor(() => {
          const newViewer = auth.getLocalUser()
          if (!isEmpty(newViewer) && !isEqual(newViewer, context.viewer)) {
            send({type: 'LOG_IN', viewer: newViewer})
          }
        })

        return () => clearInterval(id)
      },
      checkIfLoggedIn: (_context, _event) => async (send, _onReceive) => {
        try {
          const queryHash = queryString.parse(window.location.hash)
          const accessToken = getAccessToken(queryHash)
          const querySearch = queryString.parse(window.location.search)
          const viewAsUser = get(querySearch, 'show-as-user') as string | null
          const newViewer = await fetchViewer({
            accessToken,
            viewAsUser,
          })
          if (isEmpty(newViewer)) return send({type: 'REPORT_IS_LOGGED_OUT'})

          return send({
            type: 'REPORT_IS_LOGGED_IN',
            viewer: newViewer,
            viewAsUser,
          })
        } catch (e) {
          console.error({e})
          return null
        }
      },
    },
    actions: {
      sendLoginRequest: (_context, event) => {
        if (event.type === 'REQUEST_LOGIN') {
          auth.requestSignInEmail(event.email)
        }
      },
      identify: (context) => {
        if (context.viewer) identify(context.viewer)
      },
      navigate: (context, event) => {
        if (!isBrowser() || !context.viewer) {
          return
        }
        switch (event.type) {
          case 'REPORT_IS_LOGGED_IN': {
            if (window.location.pathname !== '/redirect') {
              return
            }
            // TODO: set these paths
            if (getIsUnclaimedBulkPurchaser(context.viewer)) {
              window.location.replace('/invoice')
            } else if (getCanViewContent(context.viewer.purchased)) {
              window.location.replace('/')
            }
            return
          }
          case 'LOG_OUT': {
            window.location.replace('/login')
            return
          }
        }
      },
      assignViewerToContext: assign((_context, event) => {
        if (
          event.type !== 'REPORT_IS_LOGGED_IN' &&
          event.type !== 'REPORT_REFRESHED_VIEWER'
        ) {
          return {}
        }
        return {
          viewer: event.viewer,
          viewAsUser: event.viewAsUser,
        }
      }),
      clearViewerFromContext: assign((_context, _event) => ({
        viewer: undefined,
        viewAsUser: undefined,
        error: undefined,
      })),
      clearStorage: () => {
        auth.logout()
      },
    },
  },
)

export default viewerMachine
