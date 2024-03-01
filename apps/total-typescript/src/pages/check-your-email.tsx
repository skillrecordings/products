import * as React from 'react'
import Layout from '@/components/app/layout'
import {CheckYourEmailTemplate} from '@skillrecordings/skill-lesson/templates/login'
import Image from 'next/image'

const CheckYourEmail = () => {
  return (
    <Layout meta={{title: 'Check your email'}}>
      <CheckYourEmailTemplate
        title={'Check Your Email'}
        image={
          <div className="flex max-w-screen-md items-center justify-center">
            <Image
              quality={100}
              src={require('../../public/assets/login-check-your-email@2x.png')}
              alt=""
              width={350}
              aria-hidden="true"
              priority
              placeholder="blur"
            />
          </div>
        }
      />
    </Layout>
  )
}

export default CheckYourEmail
