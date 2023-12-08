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
    <Layout
      meta={{
        title: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
        ogImage: [
          {
            url: 'https://res.cloudinary.com/total-typescript/image/upload/v1702041929/ts-login-card_2x_g2ltgj.png',
            alt: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
          },
        ],
      }}
    >
      <LoginTemplate
        csrfToken={csrfToken}
        providers={providers}
        title={`Log in`}
        subtitle={`to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}
        image={
          <div className="pointer-events-none absolute z-10 -translate-y-52 sm:-translate-x-2 sm:-translate-y-56">
            <Image
              placeholder="blur"
              src={require('../../public/assets/key@2x.png')}
              alt=""
              quality={100}
              width={240}
              height={240}
              priority
              aria-hidden="true"
              className="w-48 sm:w-[240px]"
            />
          </div>
        }
      />
    </Layout>
  )
}

export default LoginPage
