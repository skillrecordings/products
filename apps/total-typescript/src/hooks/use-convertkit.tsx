import * as React from 'react'
import {isEmpty} from 'lodash'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'
import Cookies from 'js-cookie'
import {useQuery} from 'react-query'
import toast from 'react-hot-toast'
import {useRouter} from 'next/router'
import {removeQueryParamsFromRouter} from '@skillrecordings/react'
import {type Subscriber} from 'schemas/subscriber'
import {identify} from '../utils/analytics'

export type ConvertkitContextType = {
  subscriber?: Subscriber
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

  const {data: subscriber, status} = useQuery<Subscriber>(
    [`convertkit-subscriber`],
    async () => {
      const params = new URLSearchParams(window.location.search)
      const ckSubscriberId =
        params.get(CK_SUBSCRIBER_KEY) || Cookies.get('ck_subscriber_id')

      try {
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

        identify(subscriber)

        if (!isEmpty(ckSubscriberId)) {
          if (router.asPath.match(/confirmToast=true/))
            confirmSubscriptionToast(subscriber.email_address)
          removeQueryParamsFromRouter(router, [CK_SUBSCRIBER_KEY])
        }

        return subscriber
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
