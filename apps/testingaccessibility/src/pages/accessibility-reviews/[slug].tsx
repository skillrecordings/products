import * as React from 'react'
import Layout from 'components/app/layout'
import Share from 'components/content/share'
import Link from 'next/link'
import cx from 'classnames'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import groq from 'groq'
import {GetServerSideProps} from 'next'
import {sanityClient} from 'utils/sanity-client'
import {useSelector} from '@xstate/react'
import {
  VideoProvider,
  Player,
  useVideo,
  HLSSource,
  selectIsFullscreen,
} from '@skillrecordings/player'
import {serialize} from 'next-mdx-remote/serialize'
import {format} from 'date-fns'
import {useRouter} from 'next/router'
import {PortableText} from '@portabletext/react'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
  useConvertkit,
} from '@skillrecordings/convertkit'
import {MailIcon} from '@heroicons/react/solid'
import {track} from '@skillrecordings/analytics'

const SubscribeForm = ({
  handleOnSuccess,
}: {
  handleOnSuccess: (subscriber: any, email?: string) => void
}) => {
  return (
    <div
      id="tip"
      className="flex w-full flex-col items-center justify-between gap-5 border-b border-gray-200 px-3 pt-4 pb-5 md:flex-row md:pb-3 md:pt-3 2xl:px-0"
    >
      <div className="inline-flex items-center gap-2 text-base font-medium leading-tight md:text-sm lg:flex-shrink-0 lg:text-base">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500/10"
        >
          <MailIcon className="h-5 w-5 text-green-600" />
        </div>{' '}
        New a11y reviews delivered to your inbox
      </div>
      <SubscribeToConvertkitForm
        actionLabel="Subscribe for a11y reviews"
        onSuccess={(subscriber, email) => {
          return handleOnSuccess(subscriber, email)
        }}
      />
    </div>
  )
}

const Review: React.FC<React.PropsWithChildren<any>> = ({review, body}) => {
  const {video, title, date, description, videoPoster} = review
  const {mediaUrl, srt, transcript} = video
  const {subscriber, loadingSubscriber} = useConvertkit()
  const meta = {
    title,
    description,
    ogImage: {
      url: 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1646816239/testingaccessibility.com/accessibility-reviews/accessibility-reviews-card_2x.png',
    },
  }

  const router = useRouter()
  const fullscreenWrapperRef = React.useRef<HTMLDivElement>(null)
  const videoService: any = useVideo()
  const isFullscreen = useSelector(videoService, selectIsFullscreen)
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleOnSuccess = (subscriber: any, email?: string) => {
    if (subscriber) {
      const redirectUrl = redirectUrlBuilder(subscriber, router.asPath, {
        confirmToast: 'true',
      })

      track('subscribed to email list', {
        lesson: review.slug,
        module: 'tips',
        location: 'below tip video',
        moduleType: 'review',
        lessonType: 'review',
      })
      router.push(redirectUrl).then(() => {
        router.reload()
      })
    }
  }

  return (
    <Layout meta={meta} className="bg-gray-50">
      <main>
        <header className="flex flex-col items-center relative px-5 pt-16 pb-24 overflow-hidden text-white bg-green-700 bg-noise">
          <Link href="/accessibility-reviews" passHref>
            <a className="group text-white/80 relative hover:text-white font-normal px-4 py-2 hover:bg-opacity-5 bg-opacity-0 bg-white rounded-full transition">
              <span className="pr-1" role="presentation" aria-hidden="true">
                ←
              </span>{' '}
              All Reviews
            </a>
          </Link>
          <h1 className="max-w-screen-md font-heading font-bold mx-auto leading-none text-center text-3xl sm:text-4xl lg:text-5xl py-4">
            {title}
          </h1>
          <time
            dateTime={date}
            className="sm:text-base text-sm flex items-center justify-center opacity-80"
          >
            <i className="gg-calendar mr-1.5 opacity-90 scale-75" aria-hidden />{' '}
            {format(new Date(date), 'MMMM d, yyyy')}
          </time>
        </header>
        <div>
          <div
            className={cx('w-full', {
              'max-w-screen-lg mx-auto md:-translate-y-8 relative':
                !isFullscreen,
            })}
            ref={fullscreenWrapperRef}
          >
            {isMounted && (
              <Player
                aspectRatio="8:5"
                className={cx('font-sans', {
                  'lg:rounded-md lg:overflow-hidden shadow-2xl': !isFullscreen,
                })}
                container={fullscreenWrapperRef.current || undefined}
                poster={videoPoster}
                enableGlobalShortcuts={false}
              >
                {mediaUrl && <HLSSource src={mediaUrl} />}
                {srt && (
                  <track
                    src={`/api/srt/${video._id}`}
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                )}
              </Player>
            )}
            {!subscriber && !loadingSubscriber && (
              <SubscribeForm handleOnSuccess={handleOnSuccess} />
            )}
            <article className={cx('prose md:prose-lg mx-auto py-16 px-5')}>
              <h2>Transcript</h2>
              <PortableText value={transcript} />
            </article>
          </div>
        </div>
        <footer className="flex flex-col items-center justify-center pb-16 text-center">
          <p className="text-lg pb-4 font-medium">
            Share this accessibility review with your friends
          </p>
          <Share
            link={`https://testingaccessibility.com${router.asPath}`}
            message={title}
          />
        </footer>
      </main>
    </Layout>
  )
}

const Page: React.FC<React.PropsWithChildren<any>> = (props) => {
  return (
    <VideoProvider>
      <Review {...props} />
    </VideoProvider>
  )
}

const reviewQuery = groq`*[_type == "review" && slug.current == $slug][0]{
    title,
    'slug': slug.current,
    date,
    description,
    ogImage,
    videoPoster,
    'video': resources[@->._type == 'videoResource'][0]->{
      mediaUrl,
      srt,
      transcript,
      ...
    },
    }`

const allReviewsQuery = groq`
        *[_type == "review"]{
          "slug": slug.current
        }`

export const getServerSideProps: GetServerSideProps = async (context) => {
  const allReviews = await sanityClient.fetch(allReviewsQuery)
  const currentReview = find(allReviews, {slug: context.params?.slug})

  if (isEmpty(currentReview)) {
    return {
      notFound: true,
    }
  }

  const data = await sanityClient.fetch(reviewQuery, {
    slug: currentReview.slug,
  })

  const {body, ...review} = data
  const mdxSource = await serialize(body)

  return {
    props: {review, body: mdxSource},
  }
}

export default Page
