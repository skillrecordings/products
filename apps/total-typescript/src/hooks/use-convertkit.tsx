import * as React from 'react'
import {isEmpty} from 'lodash'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'
import Cookies from 'js-cookie'
import {useQuery} from 'react-query'
import toast from 'react-hot-toast'
import {useRouter} from 'next/router'
import {removeQueryParamsFromRouter} from 'utils/remove-query-params-from-router'

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

export const ConvertkitContext = React.createContext(defaultConvertKitContext)

export const ConvertkitProvider: React.FC<
  React.PropsWithChildren<{getSubscriberApiUrl?: string}>
> = ({children}) => {
  const router = useRouter()

  const {data: subscriber, status} = useQuery(
    [`convertkit-subscriber`],
    async () => {
      const params = new URLSearchParams(window.location.search)
      const ckSubscriberId = params.get(CK_SUBSCRIBER_KEY)

      try {
        const subscriber = Cookies.get('ck_subscriber')

        if (subscriber) {
          return JSON.parse(subscriber)
        } else {
          const learner = params.get('learner')
          const subscriberLoaderParams = new URLSearchParams({
            ...(learner && {learner}),
            ...(ckSubscriberId && {ckSubscriberId}),
          })

          const subscriber = await fetch(
            `/api/subscriber?${subscriberLoaderParams}`,
          )
            .then((response) => response.json())
            .catch(() => undefined)

          if (!isEmpty(ckSubscriberId)) {
            if (router.asPath.match(/confirmToast=true/))
              confirmSubscriptionToast(subscriber.email_address)
            removeQueryParamsFromRouter(router, [CK_SUBSCRIBER_KEY])
          }

          return subscriber
        }
      } catch (e) {
        console.debug(`couldn't load ck subscriber cookie`)
      }
    },
  )

  return (
    <ConvertkitContext.Provider
      value={{subscriber, loadingSubscriber: status === 'loading'}}
    >
      {children}
    </ConvertkitContext.Provider>
  )
}

export function useConvertkit() {
  return React.useContext(ConvertkitContext)
}

const confirmSubscriptionToast = (email?: string) => {
  return toast(
    () => (
      <div>
        <strong>Confirm your subscription</strong>
        <p>
          Please check your inbox{' '}
          {email && (
            <>
              (<strong>{email}</strong>)
            </>
          )}{' '}
          for an email that just got sent. Thanks and enjoy!
        </p>
      </div>
    ),
    {
      icon: '✉️',
      duration: 6000,
    },
  )
}
