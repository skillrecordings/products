import * as React from 'react'
import {useRouter} from 'next/router'
import {pageview} from './ga'

export const usePageview = () => {
  const router = useRouter()

  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
}
