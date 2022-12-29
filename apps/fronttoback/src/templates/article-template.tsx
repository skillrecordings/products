import React from 'react'
import Layout from 'components/app/layout'
import type {ArticlePageProps} from 'pages/[article]'
import {PortableText, toPlainText} from '@portabletext/react'
import Link from 'next/link'
import Image from 'next/image'
import ChanceImage from '../../public/images/chance-strickland.jpeg'
import {NextRouter, useRouter} from 'next/router'
import {LinkedIn, Twitter} from '@skillrecordings/react'
import SubscribeForm from 'components/app/subscribe-form'
import {useConvertkit} from '@skillrecordings/convertkit-react-ui'

const ArticleTemplate: React.FC<ArticlePageProps> = ({article}) => {
  const {title, body} = article
  const description =
    article.description || toPlainText(body).substring(0, 157) + '...'
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout meta={{title, description}}>
      <header className="relative flex flex-col items-center overflow-hidden px-5 pt-24 pb-8 bg-brand-purple">
        <div className="relative z-10 mx-auto flex w-full max-w-screen-lg flex-col items-center">
          <Link passHref href="/articles">
            <a className="group relative rounded-mdpx-4 py-2 text-base font-normal opacity-80 transition hover:text-black font-normal px-4 py-2 hover:bg-opacity-10 bg-opacity-0 bg-white rounded-md transition opacity-80 hover:opacity-90 focus-visible:ring-white focus-visible:opacity-100">
              <span className="pr-1" role="presentation" aria-hidden="true">
                ←
              </span>{' '}
              All Articles
            </a>
          </Link>
          <div className="flex flex-col items-center justify-center pt-10 pb-24 text-center">
            <h1 className="mx-6 mt-12 mb-4 w-[400px] text-black text-center text-4xl font-extrabold leading-tight  sm:text-4xl md:!w-full md:text-5xl lg:text-6xl">
              {title}
            </h1>
          </div>
          <div className="lg:px-0 px-5 w-full flex md:flex-row flex-col md:space-y-0 space-y-3 items-center justify-between max-w-screen-md">
            <Author />
            <div className="flex space-x-5 items-center">
              <Share title={title} />
            </div>
          </div>
        </div>
      </header>
      <main className="sm:p-10 p-5 sm:py-16 py-10">
        <article className="max-w-2xl mx-auto w-full prose sm:prose-lg break-words">
          <PortableText value={body} />
        </article>
      </main>
      {!subscriber && !loadingSubscriber && <SubscribeForm />}
    </Layout>
  )
}

const Author = () => {
  return (
    <div className="flex items-center">
      <Image
        src={ChanceImage}
        alt="Chance Strickland"
        width={40}
        height={40}
        placeholder="blur"
        priority
        loading="eager"
        className="rounded-full"
      />
      <span className="pl-2 font-medium leading-tight">Chance Strickland</span>
    </div>
  )
}

const Share: React.FC<React.PropsWithChildren<{title: string}>> = ({title}) => {
  const router = useRouter()
  const url = process.env.NEXT_PUBLIC_URL + router.asPath
  const className =
    'p-3 hover:bg-white hover:bg-opacity-10 transition rounded-full focus-visible:ring-white'
  const message = `${title} by @chancethedev`

  return (
    <div className="flex">
      <Twitter className={className} link={url} message={message} />
      <LinkedIn className={className} link={url} message={message} />
    </div>
  )
}

export default ArticleTemplate
