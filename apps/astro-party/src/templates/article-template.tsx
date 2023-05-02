import React from 'react'
import Layout from 'components/app/layout'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {useRouter} from 'next/router'
import AuthorImage from '../../public/jason-lengstorf.jpg'
import {type Article} from 'lib/articles'
import {format} from 'date-fns'
import Image from 'next/image'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import Share from 'components/share'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Balancer from 'react-wrap-balancer'
import config from 'config'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'

const ArticleTemplate: React.FC<{
  article: Article
  mdx: MDXRemoteSerializeResult
}> = ({article, mdx}) => {
  const router = useRouter()
  const {
    title,
    description,
    body,
    _updatedAt,
    _createdAt,
    ogImage: _ogImage,
  } = article
  const image = article?.image?.secure_url
  const ogImage = {url: _ogImage?.secure_url as string, alt: title}
  const pageDescription = description || `${body.substring(0, 157)}...`
  const author = config.author
  const url = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout
      meta={{
        title,
        description: pageDescription,
        openGraph: {
          images: ogImage ? [ogImage] : undefined,
        },
      }}
    >
      <ArticleJsonLd
        title={title}
        images={image ? [image] : []}
        authorName={author}
        datePublished={_createdAt}
        dateModified={_updatedAt}
        description={pageDescription}
        url={url}
      />
      <Header
        author={author}
        title={title}
        _createdAt={_createdAt}
        image={image}
      />
      {/* <TableOfContents article={article} /> */}
      <Body mdx={mdx} />
      <Share title={title} />
      <AboutAuthor author={author} />
      {!subscriber && <CTA article={article} />}
    </Layout>
  )
}

export default ArticleTemplate

type HeaderProps = {
  title: string
  author: string
  _createdAt: string
  image: any
}

const Header: React.FC<HeaderProps> = ({title, author, _createdAt, image}) => {
  return (
    <header className="relative mx-auto w-full">
      <div className="relative flex w-full flex-col items-center justify-center pb-10 pt-10 sm:pb-16 sm:pt-24">
        <div className="flex flex-grow items-center justify-center">
          <h1 className="w-full max-w-screen-md px-5 text-center text-4xl font-semibold tracking-tight sm:text-5xl md:font-bold">
            <Balancer>{title}</Balancer>
          </h1>
        </div>
      </div>
      {image && (
        <div className="relative mx-auto aspect-video h-full w-full max-w-screen-lg overflow-hidden lg:rounded-lg">
          <Image
            src={image}
            priority
            alt=""
            aria-hidden="true"
            quality={100}
            fill
          />
        </div>
      )}
      <div className="mx-auto flex w-full max-w-screen-md flex-col gap-5 px-5 pt-8 text-base text-gray-700 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:text-base md:gap-16 lg:px-0">
        <div className="col-span-2 flex items-center justify-center gap-3 md:justify-start">
          <div className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            <Image
              priority={true}
              src={AuthorImage}
              alt={author}
              width={56}
              height={56}
              quality={100}
            />
          </div>
          <div className="text-lg font-semibold text-gray-700">{author}</div>
        </div>
        <div className="flex items-center justify-center gap-8 text-center sm:justify-end sm:gap-16 sm:text-left">
          <div className="flex flex-shrink-0 flex-col text-sm sm:w-auto sm:text-base">
            <span className="font-semibold">Published</span>
            {format(new Date(_createdAt), 'dd MMMM, y')}
          </div>
        </div>
      </div>
    </header>
  )
}

const CTA: React.FC<{article: Article}> = ({article}) => {
  const {slug} = article

  return (
    <section
      className="relative flex flex-col items-center justify-center bg-gray-100 px-5 py-16 md:pb-32 md:pt-24"
      id="article"
    >
      <PrimaryNewsletterCta
        title="Stay up to date"
        byline="Subscribe to the newsletter to stay up to date with articles, courses and much more!"
        onSuccess={() => {
          track('subscribed from article', {
            article: slug,
          })
        }}
      />
    </section>
  )
}

const AboutAuthor: React.FC<{author: string}> = ({author}) => {
  return (
    <section className="mx-auto flex w-full max-w-screen-md flex-col items-center gap-10 px-5 py-16 md:flex-row md:py-24">
      <div className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
        <Image
          src={AuthorImage}
          width={140}
          height={140}
          alt={author}
          className="aspect-square"
        />
      </div>
      <div className="text-center md:text-left">
        <p className="pb-3 text-xl font-semibold">
          Written by {process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME}{' '}
          {process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}
        </p>
        <p className="text-lg text-gray-800 text-opacity-80">
          {process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} is a world renowned
          speaker, teacher, and trainer and he's actively involved in the open
          source community as a maintainer and contributor of hundreds of
          popular npm packages.
        </p>
      </div>
    </section>
  )
}

const Body: React.FC<{mdx: MDXRemoteSerializeResult}> = ({mdx}) => {
  return (
    <main className="prose mx-auto w-full max-w-3xl px-5 py-8 md:prose-lg prose-code:break-words md:py-16 md:prose-code:break-normal">
      <MDX contents={mdx} />
    </main>
  )
}
