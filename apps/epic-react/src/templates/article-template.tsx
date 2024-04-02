import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import Balancer from 'react-wrap-balancer'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {ArticleJsonLd} from '@skillrecordings/next-seo'

import {getIsoDate} from '@/utils/get-iso-date'
import config from '@/config'
import {type ArticleFrontMatter, type Article} from '@/@types/mdx-article'
import Layout from '@/components/app/layout'
import Divider from '@/components/divider'
import mdxComponents from '@/components/mdx-components'

interface ArticleTemplateProps {
  allArticles: Article[]
  mdx: MDXRemoteSerializeResult
  frontMatter: ArticleFrontMatter
}

const YouMightAlsoLike: React.FC<{articles: Article[]}> = ({articles}) => {
  return (
    <section className="mx-auto max-w-screen-lg pb-24">
      <h3 className="mb-8 text-sm uppercase text-er-gray-700 opacity-75">
        YOU MIGHT ALSO LIKE
      </h3>
      <ul className="grid gap-8 leading-relaxed md:grid-cols-2">
        {articles.map((article: Article) => {
          return (
            <li key={article.slug}>
              <Link
                href={`/${article.slug}`}
                className="flex transform flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-er-gray-200 text-center transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-xl sm:flex-row sm:text-left"
              >
                <div className="relative aspect-[350/166] h-full w-full shrink-0 overflow-hidden sm:aspect-[auto] sm:min-h-[120px] sm:w-56 md:w-[45%]">
                  <Image
                    src={`/articles-images${article.image}`}
                    alt={article.imageAlt}
                    fill
                    sizes="(max-width: 768px) 690px, 460px"
                    className="object-cover"
                  />
                </div>
                <div className="w-full p-6 sm:p-5">
                  <h3 className="line-clamp-3 text-xl font-semibold leading-tight">
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
        ogImage: {
          url: `${process.env.NEXT_PUBLIC_URL}${socialImage}`,
          alt: title,
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
      <main className="mx-auto w-full px-5 py-8 md:pb-16 md:pt-[19px]">
        <h1 className="mx-auto mb-4 mt-[68px] max-w-screen-md px-5 text-center text-4xl font-bold leading-tight sm:mt-24 sm:px-0 sm:text-[44px]">
          <Balancer>{title}</Balancer>
        </h1>
        <h3 className="mb-10 text-center opacity-75">by {author}</h3>
        <Divider />
        <div className="-mx-5 mt-16 max-w-screen-lg overflow-hidden rounded-none lg:mx-auto lg:rounded-lg">
          <Image
            src={`/articles-images${image}`}
            alt={imageAlt}
            width={2280}
            height={1080}
          />
        </div>
        <div className="prose mx-auto mt-8 pb-24 md:prose-lg lg:prose-xl sm:pb-32 md:mt-16 md:px-8 lg:mt-24">
          <MDX contents={mdx} components={{...mdxComponents}} />
        </div>
        <Divider />
        <YouMightAlsoLike articles={restArticles} />
      </main>
    </Layout>
  )
}

export default ArticleTemplate
