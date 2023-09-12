import React from 'react'
import Layout from '@/components/app/layout'
import {GetServerSideProps} from 'next'
import {getCsrfToken, getProviders} from 'next-auth/react'
import LoginTemplate, {
  type LoginTemplateProps,
} from '@skillrecordings/ui/templates/login'
import {Logo} from '@/components/app/navigation'

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
        image={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10"
            fill="none"
            viewBox="0 0 30 26"
          >
            <path
              fill="currentColor"
              d="m.56 15.002 5.012 8.696A4.205 4.205 0 0 0 9.206 25.8h4.388L2.754 6.99.56 10.8a4.222 4.222 0 0 0 0 4.203Zm28.88-4.203-5.012-8.697A4.206 4.206 0 0 0 20.794 0h-4.388l10.84 18.809L29.44 15a4.221 4.221 0 0 0 0-4.202Zm-2.762 8.984a3.835 3.835 0 0 1-1.817.454 3.877 3.877 0 0 1-3.346-1.936l-9.506-16.49A3.578 3.578 0 0 0 8.877 0a3.579 3.579 0 0 0-3.132 1.812L3.322 6.017a3.837 3.837 0 0 1 1.817-.454c1.375 0 2.657.742 3.346 1.936l9.506 16.49a3.579 3.579 0 0 0 3.132 1.811 3.578 3.578 0 0 0 3.132-1.812l2.423-4.205Z"
            />
          </svg>
        }
        csrfToken={csrfToken}
        providers={providers}
        title={`Log in`}
      />
    </Layout>
  )
}

export default LoginPage
