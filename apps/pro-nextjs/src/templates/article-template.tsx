import React from 'react'
import Layout from '@/components/app/layout'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {useRouter} from 'next/router'
import AuthorImage from '../../public/jack-herrington.jpg'
import {type Article} from '@/lib/articles'
import {format} from 'date-fns'
import Image from 'next/image'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import Share from '@/components/share'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Balancer from 'react-wrap-balancer'
import config from '@/config'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import common from '@/text/common'
import Link from 'next/link'
import {ArrowLeftIcon} from '@heroicons/react/outline'
import {getOgImage} from '@/utils/get-og-image'
import {motion} from 'framer-motion'

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
  const ogImage = _ogImage
    ? {url: _ogImage?.secure_url as string, alt: title}
    : getOgImage({title})
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
      {!subscriber && <CTA article={article} />}
      <AboutAuthor author={author} />
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
    <header className="relative mx-auto w-full max-w-3xl px-5">
      <div className="relative flex w-full flex-col items-center pb-10 pt-5 sm:items-start sm:pb-16 sm:pt-14">
        <Link
          className="inline-flex items-center gap-2 text-sm opacity-60 transition hover:opacity-100"
          href="/articles"
        >
          <ArrowLeftIcon className="w-3" /> All Articles
        </Link>
        <motion.h1
          initial={{opacity: 0}}
          transition={{
            duration: 0.5,
            ease: [0.48, 0.15, 0.25, 0.96],
          }}
          animate={{
            opacity: 1,
          }}
          className="w-full pt-10 text-center text-3xl font-semibold tracking-tight sm:pt-8 sm:text-left sm:text-4xl lg:text-5xl"
        >
          <Balancer>{title}</Balancer>
        </motion.h1>
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
      <div className="mx-auto flex w-full justify-center gap-5 border-b pb-5 text-base text-foreground sm:justify-start sm:gap-10 sm:text-base">
        <div className="flex items-center justify-center gap-3 md:justify-start">
          <div className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
            <Image
              priority={true}
              src={AuthorImage}
              alt={author}
              width={48}
              height={48}
              quality={100}
            />
          </div>
          <div className="flex flex-col">
            <div className="font-medium">{author}</div>
            <div className="text-sm opacity-75">
              {format(new Date(_createdAt), 'MMMM do, y')}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

const CTA: React.FC<{article: Article}> = ({article}) => {
  const {slug} = article

  return (
    <section className="-mt-5 w-full sm:px-5" id="article">
      <PrimaryNewsletterCta
        className="py-32"
        // title="Stay up to date"
        // byline="Subscribe to the newsletter to stay up to date with articles, courses and much more!"
      />
    </section>
  )
}

const AboutAuthor: React.FC<{author: string}> = ({author}) => {
  return (
    <section className="mx-auto flex w-full max-w-screen-md flex-col items-center gap-10 px-5 py-10 sm:py-24 md:flex-row">
      <div className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
        <Image
          src={AuthorImage}
          width={180}
          height={180}
          alt={author}
          className="aspect-square"
        />
      </div>
      <div className="text-center md:text-left">
        <p className="pb-3 text-lg font-semibold sm:text-xl">
          Written by {process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME}{' '}
          {process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}
        </p>
        <p className="text-opacity-80 sm:text-lg">
          <Balancer>{common['about-instructor']}</Balancer>
        </p>
      </div>
    </section>
  )
}

const Body: React.FC<{mdx: MDXRemoteSerializeResult}> = ({mdx}) => {
  return (
    <main className="prose mx-auto w-full max-w-3xl px-5 pb-16 pt-8 md:prose-lg prose-code:break-words md:prose-code:break-normal">
      <MDX contents={mdx} />
    </main>
  )
}
