import * as React from 'react'
import queryString from 'query-string'
import {isEmpty, get} from 'lodash'
import cookie from 'utils/cookies'
import axios from 'utils/axios'

export const ConverkitContext = React.createContext({})

export const CK_SUBSCRIBER_KEY = 'ck_subscriber_id'

export const ConvertkitProvider: React.FunctionComponent = ({children}) => {
  const [subscriber, setSubscriber] = React.useState()
  const [loadingSubscriber, setLoadingSubscriber] = React.useState(true)
  React.useEffect(() => {
    if (typeof window !== 'undefined' && CK_SUBSCRIBER_KEY) {
      const queryParams = queryString.parse(window.location.search)
      const ckSubscriberId = get(queryParams, CK_SUBSCRIBER_KEY)
      const clearParams = get(queryParams, 'debug') !== 'true'

      if (!isEmpty(ckSubscriberId)) {
        cookie.set(CK_SUBSCRIBER_KEY, ckSubscriberId)
        clearParams &&
          window.history.replaceState(
            null,
            document.title,
            window.location.pathname,
          )
      }
    }

    axios
      .get('/api/subscriber')
      .then(({data}) => {
        setSubscriber(data)
      })
      .finally(() => setLoadingSubscriber(false))
  }, [])

  return (
    <ConverkitContext.Provider value={{subscriber, loadingSubscriber}}>
      {children}
    </ConverkitContext.Provider>
  )
}
