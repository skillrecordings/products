import React from 'react'
import Layout from '@/components/app/layout'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {useRouter} from 'next/router'
import {getIsoDate} from '@/utils/get-iso-date'
import AuthorImage from '../../public/instructor.png'
import {type Article} from '@/lib/articles'
import {type FrontMatter, type ArticleProps} from '../pages/[article]'
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

const ArticleTemplate: React.FC<ArticleProps> = ({frontMatter, mdx}) => {
  const router = useRouter()
  const {title, excerpt, socialImage, image, date} = frontMatter
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
      {/* <TableOfContents article={article} /> */}
      <main className="prose mx-auto w-full max-w-3xl px-5 py-8 md:prose-lg prose-code:break-words md:py-16 md:prose-code:break-normal">
        <MDX contents={mdx} />
      </main>
    </Layout>
  )
}

export default ArticleTemplate
