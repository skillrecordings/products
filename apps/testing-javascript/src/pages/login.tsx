import React from 'react'
import {GetServerSideProps} from 'next'
import {getCsrfToken, getProviders} from 'next-auth/react'
import LoginTemplate, {
  type LoginTemplateProps,
} from '@skillrecordings/skill-lesson/templates/login'
import Layout from '@/components/layout'
import Image from 'next/legacy/image'

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
        title="Log in to Testing JavaScript"
        image={
          <div className="-mt-6 w-24">
            <Image
              src={require('../../public/images/logos/logo.svg')}
              alt="testing trophy"
              width={96}
              height={96}
            />
          </div>
        }
      />
    </Layout>
  )
}

export default LoginPage
