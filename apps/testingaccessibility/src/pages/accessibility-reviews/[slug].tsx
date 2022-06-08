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
    <Layout meta={meta} className="bg-gray-50">
      <header className="flex flex-col items-center relative px-5 pt-16 pb-24 overflow-hidden text-white bg-green-700 bg-noise">
        <Link href="/accessibility-reviews" passHref>
          <a className="group text-white/80 relative hover:text-white font-normal px-4 py-2 hover:bg-opacity-5 bg-opacity-0 bg-white rounded-full transition">
            <span className="pr-1" role="img" aria-label="left arrow">
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
      <main>
        <div
          className={cx('w-full', {
            'absolute top-0': isFullscreen,
            'max-w-screen-lg mx-auto md:-translate-y-8 relative': !isFullscreen,
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
    <VideoProvider>
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
