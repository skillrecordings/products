import * as React from 'react'
import {getAllScriptsGroupedByUser, UserScripts} from 'lib/get-user-scripts'
import InstallScriptButton from 'components/scripts/install-script-button'
import Image from 'next/legacy/image'
import Layout from 'layouts'
import Link from 'components/link'
import {LoadedScript} from 'utils/types'

interface AllScriptProps {
  userScripts: UserScripts
}

export default function AllScripts({userScripts}: AllScriptProps) {
  return (
    <Layout
      meta={{
        title: 'Community Scripts',
      }}
    >
      <div className="pb-8 max-w-screen-lg w-full mx-auto">
        <header className="pb-28 pt-16">
          <h1 className="text-center lg:text-6xl sm:text-5xl text-4xl font-bold tracking-tight leading-tighter">
            Community Scripts
          </h1>
        </header>
        <main className="md:masonry-2 xl:masonry-3 px-5">
          {Object.entries(userScripts).map(([, scripts]) => {
            const {user} = scripts[0]

            const author =
              scripts.find((s: LoadedScript) => s.author)?.author || ''

            let twitter =
              scripts.find((s: LoadedScript) => s.twitter)?.twitter || ''
            twitter = twitter.startsWith('@') ? twitter.slice(1) : twitter

            const UserLink: React.FC<
              React.PropsWithChildren<{className?: string}>
            > = ({className, children}) => (
              <Link href={`/${user}`}>
                <a className={className}>{children}</a>
              </Link>
            )

            return (
              <article
                key={user}
                className="bg-gray-900 mb-5 rounded-md break-inside"
              >
                <header className="sm:px-5 px-4 py-3 bg-gray-800 flex items-center rounded-t-md">
                  <UserLink className="flex items-center justify-center sm:w-auto w-12 overflow-hidden rounded-full hover:border-yellow-500 border border-transparent">
                    <Image
                      width={64}
                      height={64}
                      className="rounded-full"
                      src={`https://github.com/${user}.png`}
                      alt={user}
                    />
                  </UserLink>
                  <div className="pl-3 flex flex-col justify-center">
                    <UserLink className="sm:text-xl text-lg leading-none font-medium hover:underline">
                      <h2>{author ? author : user}</h2>
                    </UserLink>
                    {twitter && (
                      <a
                        className="sm:text-sm text-xs opacity-60 hover:underline"
                        href={`https://twitter.com/${twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @{twitter}
                      </a>
                    )}
                  </div>
                </header>
                <ul className="py-2">
                  {scripts.map(({command, url, title, description}) => {
                    return (
                      <li
                        key={url || command}
                        className="relative flex items-center bg-gray-900 hover:bg-gray-800 transition-all ease-in-out duration-150"
                      >
                        <Link href={`/${user}/${command}`}>
                          <a className="w-11/12 flex flex-col px-5 py-3">
                            <h3 className="font-medium sm:text-lg text-base">
                              {title}
                            </h3>
                            {description && (
                              <p className="sm:text-sm text-xs opacity-70 sm:leading-tight leading-tighter">
                                {description}
                              </p>
                            )}
                          </a>
                        </Link>

                        <InstallScriptButton
                          name={command}
                          url={url}
                          className="absolute right-5 sm:flex hidden"
                        />
                      </li>
                    )
                  })}
                </ul>
              </article>
            )
          })}
        </main>
      </div>
    </Layout>
  )
}

export async function getStaticProps(context: any) {
  const userScripts = await getAllScriptsGroupedByUser()

  return {
    props: {userScripts},
  }
}
