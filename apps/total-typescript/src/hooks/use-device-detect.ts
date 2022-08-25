import React from 'react'
import {isSafari, isFirefox} from 'react-device-detect'

export const useDeviceDetect = () => {
  const [context, setContext] = React.useState({
    isSafari: false,
    isFirefox: false,
  })
  React.useEffect(() => {
    setContext({isSafari, isFirefox})
  }, [])

  return {isSafari: context.isSafari, isFirefox: context.isFirefox}
}
