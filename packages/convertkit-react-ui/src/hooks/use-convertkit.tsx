import * as React from 'react'
import {isEmpty} from 'lodash'
import axios from '@skillrecordings/axios'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'
import Cookies from 'js-cookie'

type ConvertkitContextType = {
  subscriber?: {
    fields?: Record<string, string>
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

/**
 * @deprecated use skill-lessons packages instead
 */
export const ConvertkitContext = React.createContext(defaultConvertKitContext)

/**
 * @deprecated use skill-lessons packages instead
 * @param children
 * @param getSubscriberApiUrl
 * @constructor
 */
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

      try {
        const subscriber = Cookies.get('ck_subscriber')

        if (subscriber) {
          setSubscriber(JSON.parse(subscriber))
          setLoadingSubscriber(false)
        }
      } catch (e) {
        console.debug(`couldn't load ck subscriber cookie`)
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

/**
 * @deprecated use skill-lessons packages instead
 */
export function useConvertkit() {
  return React.useContext(ConvertkitContext)
}
