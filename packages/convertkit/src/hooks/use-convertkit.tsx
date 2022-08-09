import * as React from 'react'
import {isEmpty} from 'lodash'
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

export const ConvertkitProvider: React.FC<
  React.PropsWithChildren<{getSubscriberApiUrl?: string}>
> = ({
  children,
  getSubscriberApiUrl = process.env.NEXT_PUBLIC_CONVERTKIT_GET_SUBSCRIBER_URL ||
    `/api/subscriber`,
}) => {
  const [subscriber, setSubscriber] = React.useState()
  const [loadingSubscriber, setLoadingSubscriber] = React.useState(true)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const ckSubscriberId = params.get(CK_SUBSCRIBER_KEY)

      if (!isEmpty(ckSubscriberId)) {
        params.delete(CK_SUBSCRIBER_KEY)
        window.history.replaceState(
          null,
          document.title,
          `${window.location.pathname}?${params.toString()}`,
        )
      }

      //get the subscriber (which sets the cookie)
      axios
        .get(getSubscriberApiUrl, {
          params: {
            [CK_SUBSCRIBER_KEY]: ckSubscriberId,
          },
        })
        .then(({data}) => {
          setSubscriber(data)
        })
        .finally(() => setLoadingSubscriber(false))
    }
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
