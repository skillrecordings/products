import * as React from 'react'
import Image from 'next/image'
import Layout from '@/components/app/layout'
import {CheckYourEmailTemplate} from '@skillrecordings/skill-lesson/templates/login'

const CheckYourEmail = () => {
  return (
    <Layout meta={{title: 'Check your email'}} className="relative">
      <Image
        src="/assets/ring-planet-pattern@2x.jpg"
        alt="a lost cosmonaut"
        fill
        className="relative z-[-1] object-cover"
      />
      <CheckYourEmailTemplate />
    </Layout>
  )
}

export default CheckYourEmail
