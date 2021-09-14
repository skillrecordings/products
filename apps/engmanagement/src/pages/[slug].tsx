import * as React from 'react'
import {GetServerSideProps} from 'next'
import {serialize} from 'next-mdx-remote/serialize'
import {MDXRemote, MDXRemoteSerializeResult} from 'next-mdx-remote'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import ArticleTemplate from 'templates/article'
import ConvertkitSubscribeAndTagForm from 'components/convertkit-subscribe-and-tag'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import checkSubscriber from 'utils/check-subscriber'
import {useNextSanityImage} from 'next-sanity-image'
import Image from 'next/image'
import {useConvertkit} from '@skillrecordings/convertkit'
import {
  TheFutureOfRemoteWorkBackground,
  TheValueOfValuesExample,
} from 'components/article-assets'
import {useRouter} from 'next/router'
import toast, {Toaster} from 'react-hot-toast'

type ArticleProps = {
  post: {
    title: string
    slug: string
    mainImage?: any
    description?: string
    ckTagId?: string
    publishedAt: Date
    ogImage: {
      url: string
      alt?: string
    }
    subscribersOnly: boolean
  }
  authorized: boolean
  source: MDXRemoteSerializeResult
  backgroundColor?: string
}

const Article = ({
  post,
  source,
  authorized,
  backgroundColor = '#111725',
}: ArticleProps) => {
  const {
    title,
    slug,
    mainImage,
    description,
    ckTagId,
    publishedAt,
    ogImage,
    subscribersOnly,
  } = post
  const router = useRouter()
  const {subscriber} = useConvertkit()

  React.useEffect(() => {
    if (router.query.continue && authorized) {
      toast('Enjoy!')
      document.getElementById('continue')?.scrollIntoView()
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname,
      )
    }
  }, [authorized, router])

  const MainImage = () => {
    const imageProps: any = useNextSanityImage(sanityClient, mainImage)
    if (!mainImage) return null
    return (
      <Image
        src={imageProps.src}
        {...imageProps}
        alt=""
        layout="fill"
        className="xl:object-contain object-cover object-top select-none pointer-events-none"
        quality={100}
        placeholder="blur"
        loading="eager"
        priority
      />
    )
  }
  return (
    <div className={`bg-[${backgroundColor}]`}>
      <Toaster />
      <ArticleTemplate
        footer={authorized}
        subscribeForm={!subscribersOnly && isEmpty(subscriber)}
        meta={{
          title,
          type: 'article',
          slug,
          image: <MainImage />,
          description,
          published: publishedAt,
          background: slug === 'the-future-of-remote-work' && (
            <TheFutureOfRemoteWorkBackground />
          ),
          ogImage: ogImage && {
            width: 1200,
            height: 628,
            url: ogImage.url,
            alt: ogImage.alt,
          },
        }}
      >
        <MDXRemote
          {...source}
          components={{Example: TheValueOfValuesExample}}
        />
        {!authorized && (
          <div className="absolute -mx-5 bottom-0 h-96 bg-gradient-to-b from-transparent to-[#111725] w-full" />
        )}
      </ArticleTemplate>
      {!authorized && (
        <section className=" max-w-screen-md w-full mx-auto sm:pb-48 pb-28">
          <div className="flex items-start justify-center py-24 px-5 bg-gray-800 rounded-lg">
            <div className="w-full">
              <h3 className="sm:text-4xl text-3xl font-bold leading-none font-brandon text-center">
                Read the rest of this article
                {/* Unlock this chapter for free */}
              </h3>
              <h4 className="text-center text-xl text-orange-300 pt-4 pb-10">
                This article is for subscribers only. Enter your email to
                continue reading.
              </h4>
              <ConvertkitSubscribeAndTagForm tag={ckTagId} />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

const initialQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  mainImage,
  description,
  publishedAt,
  'slug': slug.current,
  subscribersOnly,
  ckTagId,
  ogImage,
  'body': preview
  }`

const restQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  body,
  }`

const allPostsQuery = groq`
  *[_type == "post"]{
    "slug": slug.current
  }
`

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const allPosts = await sanityClient.fetch(allPostsQuery)
  const currentPost = find(allPosts, {slug: context.params.slug})

  if (isEmpty(currentPost)) {
    return {
      notFound: true,
    }
  }

  const initialData = await sanityClient.fetch(initialQuery, {
    slug: currentPost.slug,
  })

  const authorized = initialData.subscribersOnly
    ? await checkSubscriber(context, initialData.ckTagId)
    : true

  const {body: fullBody} =
    authorized &&
    (await sanityClient.fetch(restQuery, {
      slug: currentPost.slug,
    }))

  const {body, ...post} = authorized
    ? {...initialData, body: fullBody}
    : initialData

  const mdxSource = await serialize(body || post.preview)

  return {
    props: {post: post, source: mdxSource, authorized},
  }
}

export default Article
