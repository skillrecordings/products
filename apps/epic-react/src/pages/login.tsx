import React from 'react'
import Image from 'next/image'
import Layout from '@/components/app/layout'
import {GetServerSideProps} from 'next'
import {getCsrfToken, getProviders} from 'next-auth/react'
import LoginTemplate, {
  type LoginTemplateProps,
} from '@skillrecordings/skill-lesson/templates/login'

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
    <Layout
      meta={{title: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}
      className="relative"
    >
      <Image
        src="/assets/ring-planet-pattern@2x.jpg"
        alt="a lost cosmonaut"
        fill
        className="relative z-[-1] object-cover"
      />
      <div className="absolute inset-0 mx-auto flex w-full max-w-full flex-col justify-center">
        <LoginTemplate
          csrfToken={csrfToken}
          providers={providers}
          title="Sign into your account"
        />
      </div>
    </Layout>
  )
}

export default LoginPage
