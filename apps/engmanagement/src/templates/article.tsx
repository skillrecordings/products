import * as React from 'react'
import Layout from 'layouts'
import Markdown from 'react-markdown'
import config from '../config'
import Image from 'next/image'
import {format} from 'date-fns'
import {ArticleJsonLd} from 'next-seo'
import {
  Twitter,
  Facebook,
  Reddit,
  CopyToClipboard,
  LinkedIn,
  Hacker,
} from 'components/share'
import {useRouter} from 'next/router'
import ConvertkitSubscribeForm from '@skillrecordings/convertkit/dist/forms'

type ArticleTemplateProps = {
  meta?: any
}

type AuthorProps = {
  name: string
  image: any
  url: string
}

const ShareArticle: React.FC<{title: string}> = ({children, title}) => {
  const router = useRouter()
  return (
    <div className="flex items-center md:flex-row flex-col md:space-x-2 md:space-y-0 space-y-5">
      {children}
      <div className="flex items-center justify-center flex-wrap md:pb-0">
        <Twitter
          link={`https://${config.siteUrl}${router.pathname}`}
          message={`${title}, by ${config.twitter.handle}`}
        />
        <Facebook link={`https://${config.siteUrl}${router.pathname}`} />
        <Reddit
          link={`https://${config.siteUrl}${router.pathname}`}
          message={`${title}, by ${config.author}`}
        />
        <LinkedIn link={`https://${config.siteUrl}${router.pathname}`} />
        <Hacker
          link={`https://${config.siteUrl}${router.pathname}`}
          message={`${title}, by ${config.author}`}
        />
        <CopyToClipboard link={`https://${config.siteUrl}${router.pathname}`} />
      </div>
    </div>
  )
}

const Author: React.FC<AuthorProps> = ({name, image, url}) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="group">
      <div className="relative z-10 flex items-center justify-center">
        <div className="rounded-full border-2 border-orange-300 flex items-center justify-center">
          <Image
            src={image}
            alt={name}
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
        <div className="pl-3 flex flex-col">
          <span className="text-sm text-orange-300 leading-none">
            Article by
          </span>
          <span className="text-lg group-hover:underline">{name}</span>
        </div>
      </div>
    </a>
  )
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({meta, children}) => {
  const {title, image, published, description, images, background} = meta
  const author = meta.author || {
    name: config.author,
    image: require('../../public/images/sarah-drasner@2x.jpg'),
    imageUrl: 'https://engmanagement.dev/images/sarah-drasner@2x.jpg',
    url: 'https://twitter.com/sarah_edo',
  }
  const dateFormatted = format(new Date(published), 'MMMM dd, y')
  const router = useRouter()

  return (
    <Layout meta={meta} className="bg-[#111725]">
      <ArticleJsonLd
        url={`https://${config.siteUrl}${router.pathname}`}
        title={title}
        images={images}
        datePublished={published}
        dateModified={published}
        authorName={[author.name]}
        publisherName="EngMangement.dev"
        publisherLogo={author.imageUrl}
        description={description}
      />
      <article>
        <header>
          <div className="pt-40 min-h-[750px] -mx-5 px-5 -mt-5 relative flex flex-col items-center justify-between">
            {title && (
              <h1 className="lg:text-7xl sm:text-6xl text-5xl font-bold font-din uppercase text-center relative z-10 py-8">
                <Markdown>{title}</Markdown>
              </h1>
            )}
            <Image
              src={image}
              alt=""
              layout="fill"
              className="md:object-contain object-cover object-top"
              quality={100}
              placeholder="blur"
              loading="eager"
              priority
            />
          </div>
          <div className="max-w-screen-sm w-full mx-auto flex md:flex-row flex-col items-center md:justify-between justify-center md:space-y-0 space-y-10 pb-16">
            <Author {...author} />
            <div>
              <ShareArticle title={title}>
                <time
                  className="pr-2 text-xs text-gray-400 opacity-80"
                  dateTime={published}
                >
                  {dateFormatted}
                </time>
              </ShareArticle>
            </div>
          </div>
        </header>
        <div className="relative overflow-hidden -mx-5 px-5">
          <main className="prose prose-dark sm:prose-xl max-w-screen-sm prose-lg mx-auto relative z-10">
            {children}
          </main>
          {background && background}
        </div>
        <footer className="mx-auto max-w-screen-md flex md:flex-row flex-col md:space-y-0 space-y-10 items-center w-full justify-between pt-24 pb-32">
          <Author {...author} />
          <ShareArticle title={title}>
            <div className="text-sm text-gray-300 opacity-80 pr-2">
              Share with your friends
            </div>
          </ShareArticle>
        </footer>
        <section className=" max-w-screen-md w-full mx-auto sm:pb-48 pb-28">
          <div className="flex items-start justify-center ">
            <div className="w-full">
              <h3 className="sm:text-5xl text-4xl font-medium pb-10 leading-none font-din uppercase text-center">
                Subscribe for More
              </h3>
              <ConvertkitSubscribeForm
                classNames={{
                  form: 'max-w-xs mx-auto space-y-4',
                  input:
                    'focus:outline-none focus:ring-2 focus:ring-orange-300 border-none rounded-lg bg-white text-black placeholder-coolGray-400 w-full',
                  label: 'block pb-1 font-medium',
                  asterisk: 'text-orange-300',
                  buttonContainer: 'flex items-center w-full justify-center',
                  button:
                    'px-6 py-3 rounded-lg border-orange-400 font-semibold mt-4 hover:scale-105 transition-all duration-300 ease-in-out border shadow-inner bg-orange-400 bg-opacity-5 hover:bg-opacity-20',
                  comment: 'text-center text-sm text-gray-300 opacity-60 pt-6',
                }}
              />
            </div>
          </div>
        </section>
      </article>
    </Layout>
  )
}

export default ArticleTemplate
