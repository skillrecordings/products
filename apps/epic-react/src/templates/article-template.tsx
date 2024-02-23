import React from 'react'
import Layout from '@/components/app/layout'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {useRouter} from 'next/router'
import {getIsoDate} from '@/utils/get-iso-date'
import AuthorImage from '../../public/instructor.png'
import {type FrontMatter, type Article} from '@/@types/mdx-articles'
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
import {getOgImage} from '@/utils/get-og-image'
import Divider from '@/components/divider'
import mdxComponents from '@/components/mdx-components'

interface ArticleTemplateProps {
  allArticles: Article[]
  mdx: MDXRemoteSerializeResult
  frontMatter: FrontMatter
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
  allArticles,
  frontMatter,
  mdx,
}) => {
  console.log({allArticles})
  const router = useRouter()
  const {title, excerpt, socialImage, image, imageAlt = '', date} = frontMatter
  const isoDate = getIsoDate(date)
  const ogImage = socialImage
    ? {url: socialImage as string}
    : getOgImage({title})
  const pageDescription = excerpt
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
      </main>
    </Layout>
  )
}

export default ArticleTemplate
