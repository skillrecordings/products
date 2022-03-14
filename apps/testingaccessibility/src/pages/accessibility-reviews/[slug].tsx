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
import {
  VideoStateContext,
  VideoEvent,
} from '@skillrecordings/player/dist/machines/video-machine'
import {serialize} from 'next-mdx-remote/serialize'
import {MDXRemote} from 'next-mdx-remote'
import {format} from 'date-fns'
import {useRouter} from 'next/router'

const Review: React.FC<any> = ({review, body}) => {
  const {hlsUrl, title, date, description, videoPoster, subtitlesUrl} = review

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

  return (
    <Layout meta={meta}>
      <header className="md:pb-24 pb-8 md:pt-16 pt-8 text-center md:bg-gray-100 bg-gray-50">
        <Link href="/accessibility-reviews" passHref>
          <a className="sm:text-base text-sm group relative font-normal px-4 py-2 inline-flex hover:shadow-md bg-white rounded-full transition-all ease-in-out duration-300 opacity-90 hover:opacity-100">
            <span className="pr-1" role="img" aria-label="left arrow">
              ←
            </span>{' '}
            All Reviews
          </a>
        </Link>
        <h1 className="py-5 md:text-5xl sm:text-4xl text-3xl font-bold">
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
      <main>
        <div className={cx('bg-[#fff]')}>
          <div
            className={cx('w-full', {
              'absolute top-0': isFullscreen,
              'max-w-screen-lg mx-auto md:-translate-y-8 relative':
                !isFullscreen,
            })}
            ref={fullscreenWrapperRef}
          >
            <Player
              aspectRatio="8:5"
              className={cx('font-sans', {
                'lg:rounded-md lg:overflow-hidden shadow-2xl': !isFullscreen,
              })}
              container={fullscreenWrapperRef.current || undefined}
              poster={videoPoster}
            >
              {hlsUrl && <HLSSource src={hlsUrl} />}
              {subtitlesUrl && (
                <track
                  key={subtitlesUrl}
                  src={subtitlesUrl}
                  kind="subtitles"
                  srcLang="en"
                  label="English"
                />
              )}
            </Player>
            <article className={cx('prose md:prose-lg mx-auto py-16 px-5')}>
              <h2>Transcript</h2>
              <MDXRemote {...body} />
            </article>
          </div>
        </div>
      </main>
      <footer className="flex flex-col items-center justify-center pb-16 text-center">
        <p className="text-lg pb-4 font-medium">
          Share this accessibility review with your friends
        </p>
        <Share
          link={`https://testingaccessibility.com${router.asPath}`}
          message={title}
        />
      </footer>
    </Layout>
  )
}

const Page: React.FC<any> = (props) => {
  return (
    <VideoProvider
      services={{
        loadResource:
          (_context: VideoStateContext, _event: VideoEvent) => async () => {
            return {}
          },
        loadViewer:
          (_context: VideoStateContext, _event: VideoEvent) => async () => {
            return {}
          },
      }}
    >
      <Review {...props} />
    </VideoProvider>
  )
}

const reviewQuery = groq`*[_type == "review" && slug.current == $slug][0]{
    title,
    'slug': slug.current,
    date,
    body,
    description,
    ogImage,
    hlsUrl,
    videoPoster,
    subtitlesUrl
    }`

const allReviewsQuery = groq`
        *[_type == "review"]{
          "slug": slug.current
        }`

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const allReviews = await sanityClient.fetch(allReviewsQuery)
  const currentReview = find(allReviews, {slug: context.params.slug})

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
