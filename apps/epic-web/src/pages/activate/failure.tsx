import * as React from 'react'
import {useRouter} from 'next/router'

export default function ActivateFailure() {
  const router = useRouter()

  const {message = 'unable to verify.'} = router.query

  return (
    <div>
      <h1>Activation Failure</h1>
      <div>{message} Please try again.</div>
    </div>
  )
}
