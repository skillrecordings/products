import React from 'react'
import {useRouter} from 'next/router'
import getAccessTokenFromCookie from '../utils/get-access-token-from-cookie'

const disableLoginForDev = () =>
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_DISABLE_LOGIN_FOR_DEV === 'true'

export default function useLoginRequired() {
  const [isVerifying, setIsVerifying] = React.useState(true)
  const token = getAccessTokenFromCookie()
  const loginRequired = !token
  const router = useRouter()
  React.useEffect(() => {
    if (loginRequired && !disableLoginForDev()) {
      router.push('/login')
    } else {
      setIsVerifying(false)
    }
  }, [loginRequired])

  return isVerifying
}
