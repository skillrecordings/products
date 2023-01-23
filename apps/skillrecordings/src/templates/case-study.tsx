import * as React from 'react'
import {CaseStudyTemplateProps} from '@types'
import Layout from 'components/app/layout'
import Image from 'next/legacy/image'
import {Twitter, Facebook, Reddit, LinkedIn} from 'components/share'
import {useRouter} from 'next/router'
import config from 'config'

const CaseStudyTemplate: React.FC<
  React.PropsWithChildren<CaseStudyTemplateProps>
> = ({children, meta}) => {
  const {title, published, image, client} = meta
  const router = useRouter()
  const shareUrl = `https://${config.siteUrl}${router.pathname}`
  const shareMessage = `${title}, case study by ${config.twitter.handle}`
  return (
    <Layout meta={meta}>
      <article>
        <header className=" w-full mx-auto sm:pt-32 pt-20 sm:pb-20 pb-14 relative">
          <div className="container  flex flex-col items-center justify-center">
            <h1 className="lg:text-8xl sm:text-7xl text-6xl font-display uppercase text-center font-extrabold">
              {meta.title}
            </h1>
            <div className="flex sm:flex-row flex-col items-center justify-center pt-4 font-mono font-medium text-xs uppercase sm:space-x-8 tracking-tight">
              <span className="opacity-75">case study</span>
              {client && (
                <div>
                  <span className="opacity-75">client:</span>{' '}
                  {client.links ? (
                    <a
                      href={client.links[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-75 hover:opacity-90"
                    >
                      {client.name}
                    </a>
                  ) : (
                    <span className="opacity-75">{client.name}</span>
                  )}
                </div>
              )}
              {published && (
                <time className="opacity-75">published: {published}</time>
              )}
            </div>
          </div>
          <div className="pt-16 max-w-screen-lg mx-auto w-full flex items-center justify-center">
            <Image src={meta.image} placeholder="blur" />
          </div>
        </header>
        <main className="container prose sm:prose-lg dark:prose-dark relative">
          {children}
        </main>
        <footer className="py-24 flex sm:flex-row flex-col items-center justify-center sm:space-x-5 sm:space-y-0 space-y-5">
          <p className="text-sm">Share this case study with your friends:</p>
          <div className="flex items-center">
            <Twitter link={shareUrl} message={shareMessage} />
            <Facebook link={shareUrl} message={shareMessage} />
            <LinkedIn link={shareUrl} message={shareMessage} />
            <Reddit link={shareUrl} message={shareMessage} />
          </div>
        </footer>
      </article>
    </Layout>
  )
}

export default CaseStudyTemplate
