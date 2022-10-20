import {useFront} from '../context/front-context'
import * as React from 'react'
import PurchaserLinks from './purchaser-links'

const SelectedEmail = () => {
  const {selectedEmail} = useFront()
  let email =
    process.env.NODE_ENV === 'development' ? 'user@example.com' : selectedEmail
  if (!email) return null
  return (
    <div
      key={email}
      className="border-b w-full flex justify-between flex-wrap py-2"
    >
      <h2>{email}</h2>
      <PurchaserLinks email={email} />
    </div>
  )
}

export default SelectedEmail
