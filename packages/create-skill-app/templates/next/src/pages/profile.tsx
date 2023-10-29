import * as React from 'react'
import {getProviders} from 'next-auth/react'
import {GetServerSideProps} from 'next'
import Layout from '@/components/app/layout'
import {getToken} from 'next-auth/jwt'
import EditProfileForm from '@skillrecordings/ui/profile/edit-profile-form'

const Profile: React.FC<React.PropsWithChildren<{providers: any}>> = ({
  providers,
}) => {
  return (
    <Layout
      meta={{title: 'Profile'}}
      className="mx-auto flex w-full max-w-screen-lg flex-col items-start gap-8 px-5 py-20 sm:gap-16 sm:py-32 md:flex-row"
    >
      <header className="w-full md:max-w-[230px]">
        <h1 className="text-center text-xl font-bold md:text-left">
          Your Profile
        </h1>
      </header>
      <main className="flex w-full flex-col space-y-10 md:max-w-md">
        <EditProfileForm providers={providers} />
      </main>
    </Layout>
  )
}

export default Profile

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = await getToken({req: context.req})
  const providers = await getProviders()
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      providers,
    },
  }
}
