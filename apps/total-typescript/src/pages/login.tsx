import React from 'react'
import Layout from '@/components/app/layout'
import {GetServerSideProps} from 'next'
import {getCsrfToken, getProviders} from 'next-auth/react'
import LoginTemplate, {
  type LoginTemplateProps,
} from '@skillrecordings/skill-lesson/templates/login'
import Image from 'next/image'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)

  return {
    props: {
      providers,
      csrfToken,
    },
  }
}

const LoginPage: React.FC<LoginTemplateProps> = ({csrfToken, providers}) => {
  return (
    <Layout meta={{title: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}>
      <LoginTemplate
        csrfToken={csrfToken}
        providers={providers}
        title={`Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}
        image={
          <div className="relative z-10 mx-auto flex w-20 max-w-sm items-center justify-center sm:-mt-24 sm:w-full">
            <Image
              placeholder="blur"
              src={require('../../public/assets/gem.png')}
              alt=""
              quality={100}
              width={120}
              height={120}
              priority
              aria-hidden="true"
            />
          </div>
        }
      />
    </Layout>
  )
}

export default LoginPage
