import React from 'react'
import Layout from 'components/app/layout'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {PortableText, toPlainText} from '@portabletext/react'
import {useRouter} from 'next/router'
import KentImage from '../../public/kent-c-dodds.png'
import {type Article} from 'lib/articles'
import Starfield from 'components/starfield'
import {track} from 'utils/analytics'
import {format} from 'date-fns'
import Image from 'next/image'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import Share from 'components/share'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {portableTextComponents} from '@skillrecordings/skill-lesson/portable-text'
import Spinner from 'components/spinner'
import AboutKent from 'components/about-kent'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import removeMarkdown from 'remove-markdown'
import ResourceAuthor from 'components/resource-author'

const ArticleTemplate: React.FC<{
  article: Article
  articleBodySerialized: MDXRemoteSerializeResult
  estimatedReadingTime: number
}> = ({article, articleBodySerialized, estimatedReadingTime}) => {
  const router = useRouter()
  const {
    title,
    description,
    body,
    author,
    _updatedAt,
    _createdAt,
    ogImage: _ogImage,
  } = article
  const image = article?.image?.secure_url
  const ogImage = {url: _ogImage?.secure_url, alt: title}
  const pageDescription =
    description || `${removeMarkdown(body).substring(0, 157)}...`
  const authorName = `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  const url = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout meta={{title, description: pageDescription, ogImage}}>
      <ArticleJsonLd
        title={title}
        images={image ? [image] : []}
        authorName={authorName}
        datePublished={_createdAt}
        dateModified={_updatedAt}
        description={pageDescription}
        url={url}
      />
      <Header article={article} estimatedReadingTime={estimatedReadingTime} />
      {/* <TableOfContents article={article} /> */}
      <main className="invert-svg prose mx-auto w-full max-w-3xl px-5 py-8 dark:prose-invert md:prose-xl prose-code:break-words prose-pre:bg-gray-900 prose-pre:leading-relaxed md:py-16 md:prose-code:break-normal">
        <MDX contents={articleBodySerialized} />
      </main>
      <Share title={title} />
      <AboutKent title="Written by Kent C. Dodds" className="mt-16" />
      {!subscriber && <CTA article={article} />}
    </Layout>
  )
}

export default ArticleTemplate

type HeaderProps = {
  article: Article
  estimatedReadingTime: number
}

const Header: React.FC<HeaderProps> = ({article, estimatedReadingTime}) => {
  const router = useRouter()
  const {title, author, _updatedAt, image} = article
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,#EAEBFF_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse_at_top,#1a1e2c_0%,transparent_65%)]">
      <header className="relative mx-auto w-full max-w-screen-lg">
        <div className="relative flex w-full flex-col items-center justify-center pb-10 pt-10 sm:pb-16 sm:pt-16">
          <div className="flex flex-grow items-center justify-center">
            <h1 className="w-full max-w-screen-xl px-5 text-center font-semibold tracking-tight fluid-2xl sm:fluid-3xl md:font-bold">
              {title}
            </h1>
          </div>
        </div>
        {image?.secure_url && (
          <div className="relative flex aspect-video h-full w-full items-center justify-center overflow-hidden bg-foreground/5 sm:rounded-lg">
            <Image
              src={image.secure_url}
              priority
              alt=""
              aria-hidden="true"
              quality={100}
              fill
            />
            {router.asPath === '/epic-stack' && (
              <iframe
                className="absolute h-[calc(100%-32px)] w-[calc(100%-32px)] rounded-md shadow-2xl shadow-black/50"
                src={`https://www.youtube.com/embed/yMK5SVRASxM?autoplay=1&origin=${process.env.NEXT_PUBLIC_URL}`}
              />
            )}
          </div>
        )}
        <div className="flex w-full max-w-screen-lg flex-col gap-5 px-5 pt-8 text-base text-gray-700 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:text-base md:gap-16 lg:px-0">
          <ResourceAuthor
            className="col-span-2 text-lg"
            name={author?.name}
            slug={author?.slug}
            image={author?.image}
          />
          <div className="flex items-center justify-center gap-8 text-center sm:justify-end sm:gap-16 sm:text-left">
            <div className="flex flex-shrink-0 flex-col justify-center text-sm sm:w-auto sm:text-base">
              <span className="font-semibold">Time to read</span>~{' '}
              {estimatedReadingTime} minutes
            </div>
            <div className="flex flex-shrink-0 flex-col text-sm sm:w-auto sm:text-base">
              <span className="font-semibold">Published</span>
              {format(new Date(_updatedAt), 'dd MMMM, y')}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

const CTA: React.FC<{article: Article}> = ({article}) => {
  const {slug} = article
  const [starfieldSpeed, setStarfieldSpeed] = React.useState(0.5)
  return (
    <section
      className="relative flex flex-col items-center justify-center bg-gray-100 px-5 py-16 dark:bg-black/40 md:pb-32 md:pt-24"
      id="article"
    >
      <div className="max-w-sm text-center">
        <p className="pb-5 text-4xl font-bold">Stay up to date</p>
        <p className="pb-10 text-lg opacity-80">
          Subscribe to the newsletter to stay up to date with articles, courses
          and much more!
        </p>
      </div>
      <PrimaryNewsletterCta
        onSubmit={() => {
          track('subscribed from article', {
            article: slug,
          })
        }}
        setStarfieldSpeed={setStarfieldSpeed}
      />
      <Starfield className="absolute" speed={starfieldSpeed} />
    </section>
  )
}

const Body: React.FC<{value: any[]}> = ({value}) => {
  return (
    <main className="invert-svg prose mx-auto w-full max-w-3xl px-5 py-8 dark:prose-invert md:prose-xl prose-code:break-words md:py-16 md:prose-code:break-normal">
      <PortableText
        value={value}
        components={portableTextComponents({loadingIndicator: <Spinner />})}
      />
    </main>
  )
}
