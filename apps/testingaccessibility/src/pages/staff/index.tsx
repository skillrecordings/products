import * as React from 'react'
import {GetServerSideProps} from 'next'
import Layout from 'components/app/layout'
import {getToken} from 'next-auth/jwt'

const ROLES_WITH_ACCESS = ['ADMIN', 'SUPERADMIN']

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const token = await getToken({req})

  if (!ROLES_WITH_ACCESS.includes(token?.roles as string)) {
    return {
      notFound: true,
    }
  }

  return {
    props: {},
  }
}

const Staff = () => {
  return (
    <Layout
      footer={null}
      className="bg-green-700 bg-noise"
      meta={{title: 'Staff Tools'}}
    >
      <main className="flex flex-col flex-grow items-center justify-center pt-5 pb-16 px-5 text-white">
        <div className="flex flex-col max-w-screen-md mx-auto w-full gap-5 items-center text-center">
          stuff goes here
        </div>
      </main>
    </Layout>
  )
}

export default Staff
