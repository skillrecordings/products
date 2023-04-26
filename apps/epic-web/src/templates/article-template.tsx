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

const ArticleTemplate: React.FC<{article: Article}> = ({article}) => {
  const router = useRouter()
  const {
    title,
    description,
    body,
    _updatedAt,
    _createdAt,
    estimatedReadingTime,
    ogImage: _ogImage,
  } = article
  const image = article?.image?.secure_url
  const ogImage = {url: _ogImage?.secure_url, alt: title}
  const pageDescription =
    description || `${toPlainText(body).substring(0, 157)}...`
  const author = `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  const url = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout meta={{title, description: pageDescription, ogImage}}>
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
        title={title}
        _updatedAt={_updatedAt}
        estimatedReadingTime={estimatedReadingTime}
        image={image}
      />
      {/* <TableOfContents article={article} /> */}
      <Body value={body} />
      <Share title={title} />
      <AboutKent />
      {!subscriber && <CTA article={article} />}
    </Layout>
  )
}

export default ArticleTemplate

type HeaderProps = {
  title: string
  estimatedReadingTime: number
  _updatedAt: string
  image: any
}

const Header: React.FC<HeaderProps> = ({
  title,
  estimatedReadingTime,
  _updatedAt,
  image,
}) => {
  return (
    <header className="relative mx-auto w-full max-w-screen-lg">
      <div className="relative flex w-full flex-col items-center justify-center pb-10 pt-10 sm:pb-16 sm:pt-24">
        <div className="flex flex-grow items-center justify-center">
          <h1 className="w-full max-w-screen-xl px-5 text-center font-semibold tracking-tight fluid-2xl sm:fluid-3xl md:font-medium">
            {title}
          </h1>
        </div>
      </div>
      {image && (
        <div className="relative aspect-video h-full w-full overflow-hidden sm:rounded-lg">
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
      <div className="flex w-full max-w-screen-lg flex-col gap-5 px-5 pt-8 text-base text-gray-700 dark:text-gray-300 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:text-base md:gap-16 lg:px-0">
        <div className="col-span-2 flex items-center justify-center gap-3 md:justify-start">
          <div className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
            <Image
              priority={true}
              src={KentImage}
              alt="Kent C. Dodds"
              width={56}
              height={56}
              quality={100}
            />
          </div>
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-100">
            Kent C. Dodds
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 text-center sm:justify-end sm:gap-16 sm:text-left">
          <div className="flex flex-shrink-0 flex-col justify-center text-sm sm:w-auto sm:text-base">
            <span className="font-semibold">Time to read</span>~
            {estimatedReadingTime} minutes
          </div>
          <div className="flex flex-shrink-0 flex-col text-sm sm:w-auto sm:text-base">
            <span className="font-semibold">Published</span>
            {format(new Date(_updatedAt), 'dd MMMM, y')}
          </div>
        </div>
      </div>
    </header>
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

const AboutKent = () => {
  return (
    <section className="mx-auto flex w-full max-w-screen-md flex-col items-center gap-10 px-5 py-16 md:flex-row md:py-24">
      <div className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <Image
          src={KentImage}
          width={140}
          height={140}
          alt="Kent C. Dodds"
          className="aspect-square"
        />
      </div>
      <div className="text-center md:text-left">
        <p className="pb-3 text-xl font-semibold">Written by Kent C. Dodds</p>
        <p className="text-lg text-gray-800 text-opacity-80 dark:text-gray-300">
          Kent is a world renowned speaker, teacher, and trainer and he's
          actively involved in the open source community as a maintainer and
          contributor of hundreds of popular npm packages. He is the creator of{' '}
          <a
            href="https://epicreact.dev"
            target="_blank"
            className="text-indigo-500 text-opacity-100 hover:underline dark:text-brand"
            rel="noreferrer"
          >
            EpicReact.Dev
          </a>{' '}
          and{' '}
          <a
            href="https://testingjavascript.com"
            target="_blank"
            className="text-indigo-500 text-opacity-100 hover:underline dark:text-brand"
            rel="noreferrer"
          >
            TestingJavaScript.com
          </a>
          .
        </p>
      </div>
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
