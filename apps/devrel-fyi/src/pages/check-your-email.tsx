import * as React from 'react'
import Layout from '@/components/app/layout'
import {CheckYourEmailTemplate} from '@skillrecordings/skill-lesson/templates/login'
import Container from '@/components/app/container'

const CheckYourEmail = () => {
  return (
    <Layout meta={{title: 'Check your email'}}>
      <Container className="flex h-full min-h-[calc(100svh-80px)] flex-grow flex-col items-center justify-center">
        <CheckYourEmailTemplate />
      </Container>
    </Layout>
  )
}

export default CheckYourEmail
