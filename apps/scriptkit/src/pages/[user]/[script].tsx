import * as React from 'react'
import {FunctionComponent} from 'react'
import Layout from 'layouts'
import ScriptDetail from 'components/scripts/detail'
import {getScript, getScriptPaths} from 'lib/get-user-scripts'
import ScriptMarkdown from 'components/script-markdown'
import {Extension, LoadedScript} from 'utils/types'
import Link from 'components/link'
import Image from 'next/legacy/image'
import InstallScriptButton from 'components/scripts/install-script-button'
import CommentIcon from '../../../public/assets/icons/comment.svg'

const ScriptComponent: FunctionComponent<
  React.PropsWithChildren<{
    script: LoadedScript
  }>
> = ({script}) => {
  const {
    user,
    title,
    twitter,
    author,
    command,
    url,
    extension,
    discussion,
    description,
  } = script

  const Breadcrumb = () => (
    <nav className="font-mono text-xs pb-1">
      <Link href="/scripts">
        <a className="text-yellow-400 hover:underline">Scripts</a>
      </Link>{' '}
      /{' '}
      <Link href={`/${user}`}>
        <a className="text-yellow-400 hover:underline">
          {author ? author : user}
        </a>
      </Link>{' '}
      /{' '}
    </nav>
  )

  return (
    <Layout
      meta={{
        title,
        author,
        user,
        twitter: {handle: twitter},
        description,
      }}
    >
      <header className="rounded-xl sm:pt-24 pt-12 px-10 bg-gray-900 relative p-5">
        <div className="max-w-screen-lg mx-auto w-full flex sm:flex-row flex-col justify-between">
          <div>
            <div className="pb-8">
              <Breadcrumb />
              <h1 className="md:text-4xl sm:text-3xl text-2xl">{title}</h1>
            </div>
            <InstallScriptButton
              expanded
              name={command}
              url={url}
              className="translate-y-8 sm:flex hidden"
            />
          </div>
          <div className="flex items-center text-sm space-x-4 pb-10 flex-shrink-0">
            <Link href={`/${user}`}>
              <a className="flex items-center group hover:text-yellow-400 sm:px-3 py-2">
                <div className="flex items-center justify-center group-hover:border-yellow-400 border border-transparent rounded-full overflow-hidden">
                  <Image
                    width={32}
                    height={32}
                    src={`https://github.com/${user}.png`}
                    alt={author ? author : user}
                  />
                </div>
                <span className="pl-1">{author ? author : user}</span>
              </a>
            </Link>
            {discussion && (
              <a
                className="flex items-center hover:text-yellow-400 px-3 py-2"
                href={discussion}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CommentIcon className="mr-1" />
                View on GitHub
              </a>
            )}

            {/* TODO: Implement sharing feature */}
            {/* <a
              className="flex items-center hover:text-yellow-400"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ShareIcon className="mr-1" />
              Share
            </a> */}
          </div>
        </div>
        <div
          aria-hidden
          className="absolute right-0 bottom-0 bg-black h-5 w-2/5 skew-x-[-30deg]"
        />
      </header>
      {/* ——— */}
      <div className="max-w-screen-lg w-full mx-auto pt-16">
        {/* <Link href={`/${user}`}>
          <a className="flex md:flex-row flex-col-reverse w-full md:items-center justify-between pb-8">
            <div className="md:pt-0 pt-4 flex flex-row items-center justify-center">
              <img
                className="rounded-full h-8 mr-4"
                src={`https://github.com/${user}.png`}
                alt=""
              />
              <h2 className="text-4xl font-bold ">{author ? author : user}</h2>
            </div>
          </a>
        </Link> */}
        {extension === Extension.md ? (
          <ScriptMarkdown script={script} />
        ) : (
          <ScriptDetail {...script} />
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps(context: any) {
  const {params} = context
  const {script, user} = params

  return {
    props: {
      script: await getScript(user, script),
    },
  }
}

export async function getStaticPaths() {
  return (await getScriptPaths()) as any
}

export default ScriptComponent
