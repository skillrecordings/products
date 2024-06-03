import React from 'react'
import Layout from 'components/app/layout'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {useRouter} from 'next/router'
import {type Article} from 'lib/articles'
import Starfield from 'components/starfield'
import {track} from 'utils/analytics'
import {format} from 'date-fns'
import Image from 'next/image'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import Share from 'components/share'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import AuthorBio from 'components/contributor-bio'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import removeMarkdown from 'remove-markdown'
import ResourceContributor from 'components/resource-contributor'
import Head from 'next/head'
import {useAvailableSale} from 'hooks/use-global-banner'
import {productOnSalePathBuilder} from 'components/app/navigation'
import {Button} from '@skillrecordings/ui'
import Link from 'next/link'
import Countdown, {zeroPad} from 'react-countdown'
import {ChevronRightIcon} from '@heroicons/react/solid'
import {getOgImage} from 'utils/get-og-image'

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
  const ogImage = getOgImage({
    title,
    authorName: author?.name,
    authorImage: author?.picture?.url,
  })
  const pageDescription =
    description || `${removeMarkdown(body).substring(0, 157)}...`
  const authorName =
    author?.name ||
    `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  const url = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout meta={{title, description: pageDescription, ogImage}}>
      <Head>
        <script async src="https://platform.twitter.com/widgets.js" />
      </Head>
      <ArticleJsonLd
        title={title}
        images={image ? [image] : []}
        authorName={authorName}
        datePublished={_createdAt}
        dateModified={_updatedAt}
        description={pageDescription}
        type="Article"
        url={url}
      />
      <Header article={article} estimatedReadingTime={estimatedReadingTime} />
      {/* <TableOfContents article={article} /> */}
      <main className="invert-svg prose mx-auto w-full max-w-3xl px-5 py-8 dark:prose-invert md:prose-xl prose-code:break-words prose-pre:bg-gray-900 prose-pre:leading-relaxed md:py-16 md:prose-code:break-normal">
        <MDX contents={articleBodySerialized} />
      </main>
      {subscriber && <LimitedOfferCTA />}
      <Share contributor={author} title={title} />
      <AuthorBio
        slug={author?.slug}
        name={author?.name}
        picture={
          author?.picture && {
            url: author.picture.url,
            alt: author.picture.alt || author.name,
          }
        }
        title={(name) => `Written by ${name}`}
        bio={author?.bio}
        className="sm:py-10"
      />

      <NewsletterCTA article={article} />
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
        <div className="relative flex w-full flex-col items-center justify-center pb-14 pt-24 sm:pb-24 sm:pt-32">
          <div className="flex flex-grow items-center justify-center">
            <h1 className="w-full max-w-screen-xl text-balance px-5 text-center font-semibold tracking-tight fluid-3xl sm:fluid-3xl md:font-bold">
              {title}
            </h1>
          </div>
        </div>
        {image?.secure_url && router.asPath === '/epic-stack' && (
          <div className="relative flex aspect-video h-full w-full items-center justify-center overflow-hidden bg-foreground/5 sm:rounded-lg">
            <Image
              src={image.secure_url}
              priority
              alt=""
              aria-hidden="true"
              quality={100}
              fill
            />
            <iframe
              className="absolute h-[calc(100%-32px)] w-[calc(100%-32px)] rounded-md shadow-2xl shadow-black/50"
              src={`https://www.youtube.com/embed/yMK5SVRASxM?autoplay=1&origin=${process.env.NEXT_PUBLIC_URL}`}
            />
          </div>
        )}
        <div className="mx-auto flex w-full max-w-3xl flex-row justify-center gap-5 px-5 pt-8 text-base text-gray-700 dark:text-gray-300 sm:items-center sm:justify-between sm:gap-10 sm:text-base md:gap-16 lg:px-5">
          <ResourceContributor
            className="col-span-2 flex-shrink-0 text-base sm:text-lg [&_span]:font-mono [&_span]:text-xs [&_span]:font-semibold [&_span]:uppercase [&_span]:opacity-75"
            name={author?.name}
            slug={author?.slug}
            image={author?.picture?.url}
            byline="Author"
          />
          <div className="hidden items-center justify-start gap-8 text-left text-sm sm:flex sm:justify-end sm:gap-16 sm:text-base">
            <div className="flex flex-shrink-0 flex-col justify-center font-semibold sm:w-auto">
              <span className=" font-mono text-xs font-semibold uppercase opacity-75">
                Reading time
              </span>
              ~ {estimatedReadingTime} minutes
            </div>
            <div className="flex flex-shrink-0 flex-col justify-center font-semibold sm:w-auto">
              <span className=" font-mono text-xs font-semibold uppercase opacity-75">
                Published
              </span>
              {format(new Date(_updatedAt), 'dd MMMM, y')}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

const NewsletterCTA: React.FC<{article: Article}> = ({article}) => {
  const {slug} = article

  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <section className="pt-16">
      {subscriber ? null : (
        <PrimaryNewsletterCta
          onSubmit={() => {
            track('subscribed from article', {
              article: slug,
            })
          }}
        />
      )}
    </section>
  )
}

const LimitedOfferCTA: React.FC = () => {
  const activeSale = useAvailableSale()
  if (!activeSale || !activeSale.product) return null
  const title = activeSale.product.title
  const contributor = activeSale.product.modules?.[0].instructors[0]
  const description = activeSale.product.modules?.[0].description
  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-10 sm:px-0">
      <strong className="inline-flex pb-2 text-sm uppercase text-amber-600 dark:text-amber-300">
        Limited Offer — Save{' '}
        {(Number(activeSale.percentageDiscount) * 100).toString()}%
      </strong>
      <div className="flex w-full flex-col items-center justify-center gap-8 rounded-lg border bg-card">
        <div className="flex flex-col items-center justify-center gap-8 px-5 pt-10 sm:flex-row">
          {activeSale.product.image?.url && (
            <Link
              href={productOnSalePathBuilder(activeSale.product)}
              className="flex-shrink-0"
            >
              <Image
                src={activeSale.product.image?.url}
                alt={activeSale.product.title}
                width={220}
                height={220}
              />
            </Link>
          )}
          <div className="flex flex-col items-start gap-3">
            <strong className="text-sm font-semibold uppercase text-primary dark:brightness-150">
              New self-paced workshop
            </strong>
            {title && (
              <h3 className="text-balance text-2xl font-semibold sm:text-3xl">
                <Link
                  href={productOnSalePathBuilder(activeSale.product)}
                  className="hover:underline"
                >
                  {title}
                </Link>
              </h3>
            )}
            {contributor && (
              <ResourceContributor
                className="text-sm [&_img]:w-10"
                as="div"
                {...contributor}
                image={contributor.picture?.url}
              />
            )}
            {description && (
              <p className="text-balance opacity-90">{description}</p>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-3 rounded-b-lg bg-gradient-to-r from-primary to-indigo-500 px-5 py-3 text-white sm:flex-row">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-background text-xs font-semibold leading-none text-foreground"
              aria-hidden="true"
            >
              %
            </div>
            <Countdown
              date={activeSale.expires?.toString()}
              renderer={({days, hours, minutes, seconds}) => {
                return (
                  <span className="">
                    <strong>
                      Save{' '}
                      {(Number(activeSale.percentageDiscount) * 100).toString()}
                      % for limited time only.
                    </strong>{' '}
                    <span>Price goes up in:</span>{' '}
                    <span className="font-orig tabular-nums">{days}d</span>{' '}
                    <span className="font-orig tabular-nums">{hours}h</span>{' '}
                    <span className="font-orig tabular-nums">{minutes}m</span>{' '}
                    <span className="font-orig tabular-nums">
                      {zeroPad(seconds)}s
                    </span>
                  </span>
                )
              }}
            />
          </div>
          <Button
            asChild
            className="w-full bg-white pr-2.5 text-sm font-semibold text-primary shadow-lg hover:bg-gray-100 sm:w-auto"
          >
            <Link href={productOnSalePathBuilder(activeSale.product)}>
              Learn more <ChevronRightIcon className="w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
