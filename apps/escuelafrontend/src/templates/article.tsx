import * as React from 'react'
import Layout from 'layouts'
import PoliteConvertkitForm from 'components/forms/convertkit/polite'
import Image from 'next/image'
import {FunctionComponent} from 'react'
import Link from 'next/link'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'
import mdxComponents from 'components/mdx'
import hydrate from 'next-mdx-remote/hydrate'
import HeroWave from 'components/waves/hero-wave'
import {HorizontalResourceCard} from 'components/cards/horizontal-resource-card'

type ArticleTemplateProps = {
  meta?: any
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({meta}) => {
  const {
    title = 'Missing title',
    author = {name: 'Unknown Author'},
    seo = {},
    body = ``,
    tag = {name: 'Unknown Tag'},
    relatedResources = {},
  } = meta

  const content = hydrate(body, {components: mdxComponents})
  const router = useRouter()

  const url = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath
  const canonicalUrl = seo.canonical ? seo.canonical : url

  return (
    <>
      <NextSeo
        title={title}
        description={seo.description}
        openGraph={{
          title: seo.ogTitle || title,
          description: seo.ogDescription,
          url,
          images: [
            {
              url: seo.ogImage || tag.image,
              alt: title,
            },
          ],
        }}
        twitter={{
          cardType: seo.cardType || 'summary_large_image',
          site: seo.site || 'Escuela Frontend',
          handle: seo.handle || '@EscuelaFrontend',
        }}
        canonical={canonicalUrl}
      />

      <article>
        <header className="pb-52 pt-32 bg-gradient-to-t from-gray-200 to-gray-100  dark:bg-gradient-to-t dark:from-gray-800 dark:to-gray-900 -m-5 px-5  flex flex-col items-center justify-center transition-colors ease-in-out duration-500 mb-8">
          {tag && (
            <Image
              src={tag.image}
              width={90}
              height={90}
              quality={100}
              alt={tag.name}
              priority={true}
              className="rounded-xl"
            />
          )}
          {title && (
            <h1 className="py-10 text-center max-w-screen-xl lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold leading-tighter">
              {title}
            </h1>
          )}
          {author && <Author author={author} />}
        </header>

        <HeroWave duration={60} />

        <main className="prose dark:prose-dark lg:prose-xl prose-lg mx-auto max-w-screen-md mt-10">
          {content}
        </main>
      </article>

      {relatedResources && (
        <section className="lg:py-24 sm:py-16 py-10 mx-auto max-w-screen-xl">
          <h2 className="py-16 mb-10 text-center lg:text-5xl md:text-4xl sm:text-3xl text-2xl w-full font-extrabold leading-tighter max-w-screen-lg m-auto">
            Artículos Relacionados
          </h2>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8`}>
            {relatedResources.map((resource: any) => {
              return (
                <div key={resource.path}>
                  <HorizontalResourceCard resource={resource} />
                </div>
              )
            })}
          </div>
        </section>
      )}

      <PoliteConvertkitForm
        peakingContent={
          <div className="w-56 text-md font-medium leading-tight">
            ¿Quieres mejorar tus habilidades de frontend?
          </div>
        }
      />
    </>
  )
}

export default ArticleTemplate

const Author: FunctionComponent<{
  author: {
    name: string
    image?: any
    twitter?: string
    website?: string
    role?: string
  }
}> = ({author}) => {
  const {name, image, twitter, website, role} = author

  const path = twitter || website

  const Profile = () => (
    <>
      {image && (
        <Image
          src={image}
          width={56}
          height={56}
          quality={100}
          alt={name}
          className="rounded-full"
          priority={true}
        />
      )}
      <div className="leading-tight">
        <span className="text-xs uppercase opacity-75">{role}</span>
        <div className="font-semibold">{name}</div>
      </div>
    </>
  )
  return name ? (
    path ? (
      <Link href={path}>
        <a className="inline-flex items-center space-x-2" target="_blank">
          <Profile />
        </a>
      </Link>
    ) : (
      <div className="inline-flex items-center space-x-2">
        <Profile />
      </div>
    )
  ) : null
}
