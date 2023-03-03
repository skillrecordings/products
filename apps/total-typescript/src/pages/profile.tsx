import * as React from 'react'
import {getProviders, signIn} from 'next-auth/react'
import {GetServerSideProps} from 'next'
import Layout from 'components/app/layout'
import {IconGithub} from '../components/icons'
import {getToken} from 'next-auth/jwt'
import {trpc} from '../trpc/trpc.client'
import {isEmpty} from 'lodash'

const Profile: React.FC<React.PropsWithChildren<{providers: any}>> = ({
  providers,
}) => {
  const {data: user} = trpc.user.currentUser.useQuery()
  const {mutate: disconnectGithub} = trpc.user.disconnectGithub.useMutation()

  const githubProvider = providers.github

  return (
    <Layout footer={null} meta={{title: 'Log in to Total TypeScript'}}>
      {user ? (
        <div className="relative mx-auto flex w-full flex-grow flex-col items-center justify-center pb-16 pt-16 text-white sm:p-5 sm:pt-40 md:pb-40">
          <h1>{user.email}</h1>
          {user.accounts.map((account: any) => {
            return (
              <div key={account.id}>
                <div className="mt-5 flex flex-col items-center sm:text-lg">
                  <button
                    onClick={() => {
                      console.log('disconnecting', account.provider)
                      disconnectGithub()
                    }}
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-gray-700 px-5 py-4 font-semibold text-white shadow-xl shadow-black/20 transition focus:outline-none focus:ring-2 focus:ring-cyan-100 hover:brightness-110"
                  >
                    <span className="mr-2 flex items-center justify-center">
                      <IconGithub className="w-5" aria-hidden="true" />
                    </span>
                    Disconnect {account.provider}
                  </button>
                </div>
              </div>
            )
          })}
          {isEmpty(user.accounts) && githubProvider ? (
            <div className="mt-5 flex flex-col items-center sm:text-lg">
              <button
                onClick={() => signIn(githubProvider.id)}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-gray-700 px-5 py-4 font-semibold text-white shadow-xl shadow-black/20 transition focus:outline-none focus:ring-2 focus:ring-cyan-100 hover:brightness-110"
              >
                <span className="mr-2 flex items-center justify-center">
                  <IconGithub className="w-5" aria-hidden="true" />
                </span>
                Connect {githubProvider.name}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
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
