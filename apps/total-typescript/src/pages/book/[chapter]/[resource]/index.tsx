import Layout from '@/components/app/layout'
import Heading from '@/components/heading'
import {setUserId} from '@amplitude/analytics-browser'
import {
  getAllChapterResources,
  type ChapterResource,
  getChapterResource,
} from '@/lib/chapters'
import {getOgImage} from '@/utils/get-og-image'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/skill-lesson/convertkit'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import type {GetStaticProps, GetStaticPaths} from 'next'
import type {MDXRemoteSerializeResult} from 'next-mdx-remote'
import Image from 'next/image'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {useRouter} from 'next/router'
import {cn} from '@skillrecordings/ui/utils/cn'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import config from '@/config'
import Link from 'next/link'

export const getStaticPaths: GetStaticPaths = async () => {
  const chapterResources = await getAllChapterResources()

  return {
    paths: chapterResources.map((chapterResource: ChapterResource) => {
      return {
        params: {
          chapter: chapterResource.chapter.slug.current,
          resource: chapterResource.slug.current,
        },
      }
    }),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const chapterResource = await getChapterResource(
    context.params?.resource as string,
  )

  const mdxBody = await serializeMDX(chapterResource?.body as string)

  return {
    props: {
      resource: chapterResource,
      mdxBody,
    },
    revalidate: 60,
  }
}

const BookResource: React.FC<{
  resource: ChapterResource
  mdxBody: MDXRemoteSerializeResult
}> = ({resource, mdxBody}) => {
  const ogImage = getOgImage({
    title: resource.title,
  })

  const pageDescription = 'Preview from upcoming Total TypeScript Book.'

  return (
    <Layout
      meta={{
        title: resource.title,
        description: pageDescription,
        ogImage,
      }}
    >
      <ArticleJsonLd
        title={resource.title}
        url={
          process.env.NEXT_PUBLIC_URL +
          `/book/${resource.chapter.slug.current}/${resource.slug.current}`
        }
        authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
        datePublished={resource._createdAt}
        dateModified={resource._updatedAt}
        type="Article"
        images={['']}
        description={pageDescription}
      />
      <Heading
        className="[&_h1]:mt-0 [&_h1]:pb-16 [&_h1]:pt-10 lg:[&_h1]:pb-32 lg:[&_h1]:pt-16"
        title={resource.title}
        withImage={false}
      />
      <main className="mx-auto flex h-full w-full max-w-screen-lg flex-grow flex-col gap-10 px-5 pb-24 pt-16">
        <div className="flex w-full flex-col gap-10">
          <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-5 md:pb-10">
            <ShortBio className="" />
            <BookPreviewCTA />
          </div>
          {mdxBody && (
            <article className="prose relative z-10 col-span-8 mx-auto w-full max-w-3xl sm:prose-lg md:prose-xl prose-p:text-gray-300 prose-a:text-cyan-300 prose-a:transition hover:prose-a:text-cyan-200 sm:prose-pre:-mx-5">
              <MDX contents={mdxBody} />
            </article>
          )}
          {/* <aside className="col-span-4 hidden flex-col gap-5 lg:flex">
            <BookPreviewCTAVertical />
          </aside> */}
        </div>
        <BookPreviewCTA />
      </main>
    </Layout>
  )
}

export default BookResource

const ShortBio: React.FC<{className?: string}> = ({className}) => {
  return (
    <Link
      href={`https://twitter.com/${config.twitter.handle}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('flex items-start gap-2', className)}
    >
      <Image
        src={require('../../../../../public/matt-pocock.jpg')}
        alt="Matt Pocock"
        width={56}
        height={56}
        className="flex-shrink-0 rounded-full"
      />
      <div className="flex flex-col">
        <strong className="text-lg font-semibold">Matt Pocock</strong>
        <p className="text-gray-200">{config.authorBio}</p>
      </div>
    </Link>
  )
}

const BookPreviewCTA = () => {
  const {subscriber, loadingSubscriber} = useConvertkit()
  const router = useRouter()
  const ckBookInterest = {
    [`book_interest`.toLowerCase()]: new Date().toISOString().slice(0, 10),
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center gap-0 rounded-lg border bg-gradient-to-r from-black/10 to-card md:flex-row">
      <div className="-my-5 flex-shrink-0">
        <Image
          src={require('../../../../../public/assets/book@2x.png')}
          aria-hidden="true"
          alt=""
          width={495 / 1.5}
          height={523 / 1.5}
          quality={100}
          priority
          className="relative md:-ml-10 md:rotate-[16deg]"
        />
      </div>
      <div className="-mt-10 flex flex-col gap-2 p-5 text-xl leading-relaxed text-gray-200 md:mt-0 md:py-0 md:pl-0 md:pr-10">
        <p className="text-center text-2xl font-semibold md:text-left">
          Pssst, this is a preview from my upcoming book.
        </p>
        {!subscriber && (
          <>
            <p className="text-balance text-center text-lg text-slate-300 md:text-left">
              If you’d like to receive updates about the book and all things
              TypeScript, subscribe below:
            </p>
            <div className="pt-3">
              <SubscribeToConvertkitForm
                fields={ckBookInterest}
                onSuccess={(subscriber, email) => {
                  if (subscriber) {
                    email && setUserId(email)
                    track('subscribed to email list', {
                      location: 'home',
                    })
                    const redirectUrl = redirectUrlBuilder(
                      subscriber,
                      '/confirm',
                    )
                    router.push(redirectUrl)
                  }
                }}
                className="flex flex-col gap-5 md:flex-row md:items-end [&_button]:h-12 [&_button]:text-base [&_button]:font-semibold [&_input]:h-12 [&_input]:border-white/10 [&_input]:bg-background [&_input]:bg-gray-900 [&_input]:text-base"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
