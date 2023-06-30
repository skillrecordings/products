import React from 'react'
import Layout from 'components/layout'
import {GetServerSideProps} from 'next'
import {getCsrfToken, getProviders} from 'next-auth/react'
import LoginTemplate, {
  type LoginTemplateProps,
} from '@skillrecordings/skill-lesson/login'
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
    <Layout meta={{title: `Log in to Pro Tailwind`}}>
      <LoginTemplate
        csrfToken={csrfToken}
        providers={providers}
        title={`Log in to Pro Tailwind`}
        image={
          <div className="w-32">
            <Image
              src={require('../../public/assets/waving-corgi.svg')}
              priority
              alt="waving corgi"
            />
          </div>
        }
      />
    </Layout>
  )
}

export default LoginPage
