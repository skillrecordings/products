import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {ArticleJsonLd} from '@skillrecordings/next-seo'

import {getIsoDate} from '@/utils/get-iso-date'
import {getOgImage} from '@/utils/get-og-image'
import config from '@/config'
import {type FrontMatter, type Article} from '@/@types/mdx-articles'
import Layout from '@/components/app/layout'
import Divider from '@/components/divider'
import mdxComponents from '@/components/mdx-components'

interface ArticleTemplateProps {
  allArticles: Article[]
  mdx: MDXRemoteSerializeResult
  frontMatter: FrontMatter
}

const YouMightAlsoLike: React.FC<{articles: Article[]}> = ({articles}) => {
  return (
    <section>
      <h3 className="mb-8 text-xs uppercase text-gray-700 opacity-75">
        YOU MIGHT ALSO LIKE
      </h3>
      <ul className="grid gap-8 leading-relaxed md:grid-cols-2">
        {articles.map((article: Article) => {
          return (
            <li key={article.slug} className="flex min-h-[120px]">
              <Link
                href={`/${article.slug}`}
                className="flex w-full transform flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-gray-200 text-center transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl sm:flex-row sm:text-left"
              >
                <div className="relative h-full w-full shrink-0 overflow-hidden sm:w-[45%]">
                  <Image
                    src={`/articles-images${article.image}`}
                    alt={article.imageAlt}
                    fill
                    sizes="(max-width: 768px) 690px, 460px"
                    className="object-cover"
                  />
                </div>
                <div className="w-full p-6 sm:p-5">
                  <h3 className="text-lg font-semibold leading-tight">
                    {article.title}
                  </h3>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
  allArticles,
  frontMatter,
  mdx,
}) => {
  console.log({allArticles})
  const router = useRouter()
  const {
    title,
    excerpt,
    socialImage,
    image,
    imageAlt = '',
    date,
    slug,
  } = frontMatter
  const isoDate = getIsoDate(date)
  const ogImage = socialImage
    ? {url: socialImage as string}
    : getOgImage({title})
  const pageDescription = excerpt
  const author = config.author
  const url = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`
  const {subscriber, loadingSubscriber} = useConvertkit()
  const restArticles = allArticles.filter((article) => article.slug !== slug)

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
        datePublished={isoDate}
        dateModified={isoDate}
        description={pageDescription}
        url={url}
      />
      <main className="mx-auto w-full max-w-3xl px-5 py-8 md:py-16">
        <h1 className="mx-auto mb-4 mt-24 max-w-screen-md px-5 text-center text-3xl font-bold leading-tight sm:px-0 sm:text-4xl">
          {title}
        </h1>
        <h3 className="mb-10 text-center text-sm opacity-75">by {author}</h3>
        <Divider />
        <div className="mx-auto mt-16 max-w-screen-lg overflow-hidden rounded-none lg:rounded-lg">
          <Image
            src={`/articles-images${image}`}
            alt={imageAlt}
            width={2280}
            height={1080}
          />
        </div>
        <div className="prose mt-8 text-white md:prose-lg prose-code:break-words md:prose-code:break-normal">
          <MDX contents={mdx} components={{...mdxComponents}} />
        </div>
        <Divider className="my-40" />
        <YouMightAlsoLike articles={restArticles} />
      </main>
    </Layout>
  )
}

export default ArticleTemplate
