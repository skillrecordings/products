import * as React from 'react'
import Layout from '@/components/app/layout'
import {CheckYourEmailTemplate} from '@skillrecordings/skill-lesson/templates/login'

const CheckYourEmail = () => {
  return (
    <Layout meta={{title: 'Check your email'}}>
      <CheckYourEmailTemplate />
    </Layout>
  )
}

export default CheckYourEmail
