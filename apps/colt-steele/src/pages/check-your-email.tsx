import * as React from 'react'
import Layout from 'components/app/layout'
import {CheckYourEmailTemplate} from '@skillrecordings/skill-lesson/templates/login'

const CheckYourEmail = () => {
  return (
    <Layout meta={{title: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}>
      <CheckYourEmailTemplate />
    </Layout>
  )
}

export default CheckYourEmail
