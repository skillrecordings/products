import * as React from 'react'
import PoliteConvertkitForm from 'components/forms/convertkit/polite'
import Image from 'next/image'
import {FunctionComponent} from 'react'
import Link from 'next/link'
import {NextSeo} from 'next-seo'
import {useRouter} from 'next/router'
import HeroWave from 'components/waves/hero-wave'
import {HorizontalResourceCard} from 'components/cards/horizontal-resource-card'
import {MDXRemote} from 'next-mdx-remote'
import mdxComponents from 'components/mdx'
import qs from 'query-string'

type ArticleTemplateProps = {
  meta?: any
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({meta}) => {
  const {
    title = 'Missing title',
    instructor = {name: 'Unknown Instructor'},
    seo = {},
    body = ``,
    tag = {name: 'Unknown Tag'},
    relatedResources = {},
    publishedTime,
    modifiedTime,
  } = meta

  /* NextSeo urls */
  const router = useRouter()
  const urlmain = process.env.NEXT_PUBLIC_DEPLOYMENT_URL + router.asPath
  const canonicalUrl = seo.canonical ? seo.canonical : urlmain
  let url = `${process.env.NEXT_PUBLIC_VERCEL_URL}${router.asPath}`

  /*  opengraphImage */
  const contentType = 'article'
  const tagImage = tag.image
  const tagSlug = tag.slug
  const instructorImage = instructor.image
  const instructorName = instructor.name
  const query = {
    title,
    contentType,
    tagImage,
    instructorImage,
    instructorName,
    tagSlug,
  }
  const opengraphImage = `${
    process.env.NEXT_PUBLIC_VERCEL_URL
  }/api/opengraph?${qs.stringify(query)}`

  return (
    <>
      <NextSeo
        title={title}
        description={seo.description}
        openGraph={{
          title: seo.ogTitle || title,
          description: seo.ogDescription,
          url,
          type: 'article',
          article: {
            publishedTime: publishedTime,
            modifiedTime: modifiedTime,
            authors: [instructor.name],
            tags: [tag.name],
          },
          images: opengraphImage
            ? [{url: opengraphImage, width: 1200, height: 630}]
            : undefined,
        }}
        twitter={{
          cardType: seo.cardType || 'summary_large_image',
          site: seo.site || 'Escuela Frontend',
          handle: seo.handle || '@EscuelaFrontend',
        }}
        canonical={canonicalUrl}
      />

      <article>
        <header className="flex flex-col items-center justify-center px-5 pt-32 mb-8 -m-5 transition-colors duration-500 ease-in-out pb-52 bg-gradient-to-t from-gray-200 to-gray-100 dark:bg-gradient-to-t dark:from-gray-800 dark:to-gray-900">
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
            <h1 className="w-full max-w-screen-xl py-10 text-3xl font-extrabold text-center lg:text-6xl md:text-5xl sm:text-4xl leading-tighter">
              {title}
            </h1>
          )}
          {instructor && <Instructor instructor={instructor} />}
        </header>

        <HeroWave duration={60} />

        <main className="max-w-screen-md mx-auto mt-10 prose prose-lg dark:prose-dark lg:prose-xl">
          <MDXRemote {...body} components={mdxComponents} />
        </main>
      </article>

      {relatedResources && (
        <section className="max-w-screen-xl py-10 mx-auto lg:py-24 sm:py-16">
          <h2 className="w-full max-w-screen-lg py-16 m-auto mb-10 text-2xl font-extrabold text-center lg:text-5xl md:text-4xl sm:text-3xl leading-tighter">
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
          <div className="w-56 font-medium leading-tight text-md">
            ¿Quieres mejorar tus habilidades de frontend?
          </div>
        }
      />
    </>
  )
}

export default ArticleTemplate

const Instructor: FunctionComponent<{
  instructor: {
    slug?: string
    name?: string
    image?: any
  }
}> = ({instructor}) => {
  const {slug, name, image} = instructor

  return (
    <Link href={'/instructores/' + slug}>
      <a className="items-center space-x-2 text-center">
        <Image
          src={image}
          width={56}
          height={56}
          quality={100}
          alt={name}
          className="rounded-full"
          priority={true}
        />

        <div className="leading-tight">
          <div className="font-semibold">{name}</div>
        </div>
      </a>
    </Link>
  )
}
