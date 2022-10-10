import React from 'react'
import Layout from 'components/app/layout'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import cx from 'classnames'
import {PortableText, toPlainText} from '@portabletext/react'
import {getOgImage} from 'utils/get-og-image'
import {useRouter} from 'next/router'
import KentImage from '../../public/kent-c-dodds.png'
import {type Article} from 'lib/articles'
import Starfield from 'components/starfield'
import {format} from 'date-fns'
import TableOfContents from 'components/portable-text/table-of-contents'
import PortableTextComponents from 'components/portable-text'
import Image from 'next/image'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import Share from 'components/share'

const ArticleTemplate: React.FC<{article: Article}> = ({article}) => {
  const router = useRouter()
  const {
    title,
    description,
    body,
    _updatedAt,
    _createdAt,
    estimatedReadingTime,
  } = article
  const image = article?.image?.secure_url
  const ogImage = getOgImage({title, image, path: 'article'})
  const pageDescription =
    description || `${toPlainText(body).substring(0, 157)}...`
  const author = `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  const url = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`

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
      <TableOfContents value={body} />
      <Body value={body} />
      <Share title={title} />
      <AboutKent />
      <CTA />
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
    <header className="relative">
      {image && (
        <Image
          src={image}
          priority
          alt=""
          aria-hidden="true"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      )}
      <div
        className={cx(
          'w-full md:min-h-screen flex items-center justify-center flex-col relative',
          {
            'bg-gray-800/40': !image,
          },
        )}
      >
        <div className="flex-grow flex items-center justify-center md:pt-16 pt-32 md:pb-16 pb-16">
          <h1 className="fluid-4xl lg:px-16 px-5 tracking-tight max-w-screen-xl w-full text-center md:font-normal font-semibold">
            {title}
          </h1>
        </div>
        <div className="md:absolute bottom-16 md:pb-0 pb-16 w-full max-w-screen-md px-5 text-gray-300 grid md:grid-cols-4 grid-cols-2 md:gap-16 gap-10 items-center">
          <div className="flex items-center md:justify-start justify-center gap-3 col-span-2">
            <div className="flex items-center justify-center rounded-full overflow-hidden bg-black/50 flex-shrink-0">
              <Image
                priority={true}
                src={KentImage}
                alt="Kent C. Dodds"
                width={80}
                height={80}
                quality={100}
              />
            </div>
            <div className="text-lg font-semibold text-gray-100">
              Kent C. Dodds
            </div>
          </div>
          <div className="w-full flex md:items-start items-center justify-center flex-col">
            <span className="font-semibold">Time to read</span>~
            {estimatedReadingTime} minutes
          </div>
          <div className="w-full flex md:items-start items-center justify-center flex-col">
            <span className="font-semibold">Published</span>

            {format(new Date(_updatedAt), 'dd MMMM, y')}
          </div>
        </div>
      </div>
    </header>
  )
}

const CTA = () => {
  const [starfieldSpeed, setStarfieldSpeed] = React.useState(0.5)
  return (
    <section
      className="md:py-40 py-16 bg-black/40 relative flex flex-col items-center justify-center px-5"
      id="article"
    >
      <div className="text-center max-w-sm">
        <p className="pb-5 text-4xl font-bold">Stay up to date</p>
        <p className="pb-16 text-lg opacity-80">
          Subscribe to the newsletter to stay up to date with articles, courses
          and much more!
        </p>
      </div>
      <PrimaryNewsletterCta setStarfieldSpeed={setStarfieldSpeed} />
      <Starfield className="absolute" speed={starfieldSpeed} />
    </section>
  )
}

const AboutKent = () => {
  return (
    <section className="flex md:flex-row flex-col px-5 max-w-screen-md mx-auto w-full items-center gap-10 md:py-24 py-16">
      <div className="flex items-center justify-center rounded-full overflow-hidden bg-black/50 flex-shrink-0">
        <Image
          src={KentImage}
          width={140}
          height={140}
          alt="Kent C. Dodds"
          className="aspect-square"
        />
      </div>
      <div>
        <p className="font-semibold pb-3 text-xl">Written by Kent C. Dodds</p>
        <p className="text-yellow-50 text-opacity-80 text-lg">
          Kent is a world renowned speaker, teacher, and trainer and he's
          actively involved in the open source community as a maintainer and
          contributor of hundreds of popular npm packages. He is the creator of{' '}
          <a
            href="https://epicreact.dev"
            target="_blank"
            className="text-brand text-opacity-100 hover:underline"
            rel="noreferrer"
          >
            EpicReact.Dev
          </a>{' '}
          and{' '}
          <a
            href="https://testingjavascript.com"
            target="_blank"
            className="text-brand text-opacity-100 hover:underline"
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
    <main className="prose md:prose-xl text-lg mx-auto md:py-16 py-8 max-w-3xl px-5">
      <PortableText value={value} components={PortableTextComponents} />
    </main>
  )
}
