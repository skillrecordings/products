import * as React from 'react'
import {useSearchParams} from 'next/navigation'
import {GetServerSideProps} from 'next/types'
import {getToken} from 'next-auth/jwt'
import Link from 'next/link'
import axios from 'axios'
import {isBrowser} from '@skillrecordings/skill-lesson/utils/is-browser'
import type {DiscordUser} from '../api/discord'
import Layout from '@/components/app/layout'

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  query,
}) {
  const token = await getToken({req})

  const {code} = query

  if (!code) {
    res.writeHead(302, {Location: '/discord'})
    res.end()
    return {props: {}}
  }

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default function DiscordCallback() {
  const [syncingAccount, setSyncingAccount] = React.useState(true)
  const [userData, setUserData] = React.useState<{
    discordUser: {user: DiscordUser} | undefined
  }>({discordUser: undefined})
  const [error, setError] = React.useState<Boolean | null>(null)
  const searchParams = useSearchParams()
  const code = searchParams?.get('code')

  React.useEffect(() => {
    axios
      .post('/api/discord', {code})
      .then(({data}) => {
        setUserData(() => data)
        setSyncingAccount(false)
      })
      .catch(() => {
        setError(false)
      })
  }, [code])

  if (!isBrowser) return null

  return (
    <Layout
      meta={{
        title: 'Connect EpicReact to Discord',
        description:
          'Connect your EpicReact account to your Epic Web Discord account.',
      }}
    >
      <div className="container">
        <div
          className="absolute left-0 top-0 mx-auto flex min-h-screen w-screen max-w-full flex-col justify-center px-5 text-text sm:px-6 lg:px-8"
          style={{
            backgroundImage: `url('${process.env.NEXT_PUBLIC_URL}/assets/ring-planet-pattern@2x.jpg')`,
            backgroundSize: 'cover',
          }}
        >
          <div className="flex flex-col justify-center rounded-lg border border-gray-200 bg-background p-8 align-middle shadow-xl sm:mx-auto sm:w-full sm:max-w-md">
            {syncingAccount ? (
              <>
                <h1>
                  ♻️ Currently syncing Epic React to the Epic Web Discord
                  server. Please wait!
                </h1>
              </>
            ) : error ? (
              <>
                <h1>Oh no...</h1>
                <p>There was an error connecting your disord account.</p>
                <p>
                  <Link href="/discord">Try again?</Link>
                </p>
              </>
            ) : (
              <>
                {userData && (
                  <div className="flex flex-col space-y-3">
                    <p>
                      Your Discord account{' '}
                      {userData?.discordUser
                        ? `(${userData.discordUser.user.username}#${
                            userData.discordUser.user.discriminator
                          } - ${
                            userData.discordUser.user.email ?? 'email unknown'
                          })`
                        : null}{' '}
                      has been updated! You are a member of the Epic Web Discord
                      with the Epic React role!
                    </p>
                    <p>
                      <a
                        className="font-medium text-blue-500"
                        href="https://kcd.im/discord"
                      >
                        Join the discord server here
                      </a>
                    </p>
                    <p>
                      <a
                        className="font-medium text-blue-500"
                        href="https://discord.com/download"
                      >
                        Install the Discord App
                      </a>
                    </p>
                  </div>
                )}
              </>
            )}
            <div className="pt-16">
              <h2 className="text-2xl font-bold">FAQ</h2>
              <div>
                <h3 className="text-lg font-bold">
                  The Epic Web Discord doesn't show up in my server list?
                </h3>
                <p>
                  The authorization flow uses the Discord account{' '}
                  <strong>currently logged in to the browser</strong>. Sometimes
                  this is different than the account logged into the Discord
                  app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
