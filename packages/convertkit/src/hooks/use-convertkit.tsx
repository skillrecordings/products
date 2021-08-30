import * as React from 'react'
import queryString from 'query-string'
import {isEmpty, get} from 'lodash'
import cookie from '@skillrecordings/cookies'
import axios from '@skillrecordings/axios'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'

type ConvertkitContextType = {
  subscriber?: {
    fields?: {job_title?: 'manager'}
    created_at?: Date
    email_address?: string
    first_name?: string
    id?: number
    state?: 'active' | 'inactive'
    tags?: {
      id?: number
      name?: string
      created_at?: Date
    }[]
  }
  loadingSubscriber: boolean
}

const defaultConvertKitContext: ConvertkitContextType = {
  loadingSubscriber: true,
}

export const ConvertkitContext = React.createContext(defaultConvertKitContext)

export const ConvertkitProvider: React.FunctionComponent = ({children}) => {
  const [subscriber, setSubscriber] = React.useState()
  const [loadingSubscriber, setLoadingSubscriber] = React.useState(true)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryParams = queryString.parse(window.location.search)
      const ckSubscriberId = get(queryParams, CK_SUBSCRIBER_KEY)

      if (!isEmpty(ckSubscriberId)) {
        cookie.set(CK_SUBSCRIBER_KEY, ckSubscriberId)
        window.history.replaceState(
          null,
          document.title,
          window.location.pathname,
        )
      }
    }

    axios
      .get(`/api/subscriber`)
      .then(({data}) => {
        setSubscriber(data)
      })
      .finally(() => setLoadingSubscriber(false))
  }, [])

  return (
    <ConvertkitContext.Provider value={{subscriber, loadingSubscriber}}>
      {children}
    </ConvertkitContext.Provider>
  )
}

export function useConvertkit() {
  return React.useContext(ConvertkitContext)
}
