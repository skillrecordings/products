import * as React from 'react'
import Layout from 'components/layout'
import {CheckYourEmailTemplate} from '@skillrecordings/ui/templates/login'
import Image from 'next/image'

const CheckYourEmail = () => {
  return (
    <Layout meta={{title: `Check your email`}} className="bg-blue-600">
      <CheckYourEmailTemplate />
    </Layout>
  )
}

export default CheckYourEmail
