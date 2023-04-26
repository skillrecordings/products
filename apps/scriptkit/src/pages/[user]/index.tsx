import * as React from 'react'
import {getAllUsers, getScriptsByUser} from 'lib/get-user-scripts'
import _ from 'lodash'
import ScriptCard from 'components/scripts/card'
import Layout from 'layouts'
import Image from 'next/legacy/image'
import {LoadedScript} from 'utils/types'
import Link from 'components/link'
import TwitterIcon from '../../../public/assets/icons/twitter.svg'

interface UserProps {
  scripts: LoadedScript[]
  user: string
}

export default function User({user, scripts}: UserProps) {
  const author = scripts.find((s: LoadedScript) => s.author)?.author || ''
  const title = `${author ? author : user}`
  let twitter = scripts.find((s: LoadedScript) => s.twitter)?.twitter || ''
  twitter = twitter.startsWith('@') ? twitter.slice(1) : twitter

  const Breadcrumb = () => (
    <nav className="font-mono text-xs pb-1">
      <Link href="/scripts">
        <a className="text-yellow-400 hover:underline">Scripts</a>
      </Link>{' '}
      /{' '}
    </nav>
  )

  return (
    <Layout
      meta={{
        title: `Scripts by ${title}`,
        author,
        user,
        twitter: {
          handle: twitter,
        },
        additionalMetaTags: [{property: 'author', content: title}],
      }}
    >
      <header className="-mx-5 sm:pt-20 pt-12 pb-6 px-10 bg-gray-900 relative overflow-hidden">
        <div className="max-w-screen-lg mx-auto w-full flex md:flex-row md:items-center flex-col justify-between">
          <div className="pb-8">
            <div className="flex items-center">
              <Image
                className="rounded-full"
                width={80}
                height={80}
                src={`https://github.com/${user}.png`}
                alt={author ? author : user}
              />
              <div className="pl-3">
                <Breadcrumb />
                <h1 className="md:text-4xl sm:text-3xl text-2xl">{title}</h1>
              </div>
            </div>
          </div>
          {twitter && (
            <div>
              <a
                href={`https://twitter.com/${twitter}`}
                className="flex items-center hover:text-yellow-500 text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon className="mr-1" />
                {twitter}
              </a>
            </div>
          )}
        </div>
        <div
          aria-hidden
          className="absolute right-0 bottom-0 bg-black h-5 w-2/5 skew-x-[-30deg]"
        />
      </header>
      <main className="px-5 w-full max-w-screen-lg mx-auto pt-16 grid md:grid-cols-2 grid-cols-1 gap-5">
        {scripts.map((script: LoadedScript) => (
          <ScriptCard key={script.url || script.command} script={script} />
        ))}
      </main>
    </Layout>
  )
}

export async function getStaticProps(context: any) {
  const {params} = context
  const {user} = params

  const scripts = await getScriptsByUser(user)

  return {
    props: {user, scripts}, // will be passed to the page component as props
  }
}

export async function getStaticPaths() {
  const users = await getAllUsers()
  const paths = users.map((user) => `/${user}`)

  return {
    paths,
    fallback: false,
  }
}
