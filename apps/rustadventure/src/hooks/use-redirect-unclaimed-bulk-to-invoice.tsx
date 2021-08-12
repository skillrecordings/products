import {useRouter} from 'next/router'
import React from 'react'
import {useViewer} from 'contexts/viewer-context'
import useLoginRequired from './use-required-login'
const disableLoginForDev = () =>
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_DISABLE_LOGIN_FOR_DEV === 'true'

export default function useRedirectUnclaimedBulkToInvoice() {
  const {isUnclaimedBulkPurchaser} = useViewer()
  const verifyingLoggedIn = useLoginRequired()
  const [isVerifying, setIsVerifying] = React.useState(true)
  const router = useRouter()
  React.useEffect(() => {
    if (
      !verifyingLoggedIn &&
      isUnclaimedBulkPurchaser &&
      !disableLoginForDev()
    ) {
      router.push('/invoice')
    } else if (!verifyingLoggedIn) {
      setIsVerifying(false)
    }
  }, [isUnclaimedBulkPurchaser, verifyingLoggedIn])

  return isVerifying
}
