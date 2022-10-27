import * as React from 'react'

import {GetStaticPaths, GetStaticProps} from 'next'
import {
  getAllPodcastSeasons,
  getPodcastEpisode,
  PodcastEpisode,
} from '../../../lib/podcast'
import Layout from 'components/app/layout'
import PortableTextComponents from 'components/portable-text'
import PodcastPlayer from 'components/podcast-player'
import Markdown from 'react-markdown'
import {PortableText, toPlainText} from '@portabletext/react'
import {useRouter} from 'next/router'
import {getOgImage} from 'utils/get-og-image'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
  useConvertkit,
} from '@skillrecordings/convertkit'
import {motion} from 'framer-motion'
import {Button} from '@skillrecordings/react/dist/components'
import Image from 'next/image'

const formId = 3071922 // ALL TypeScript Email Course

export const getStaticProps: GetStaticProps = async ({params}) => {
  const episode = await getPodcastEpisode(params?.podcastEpisode as string)

  return {
    props: {
      episode,
    },
    revalidate: 10,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const seasons = await getAllPodcastSeasons()

  const paths = seasons
    .reduce((acc: any[], season: any) => {
      return season.episodes.map((episode: any) => {
        return {
          params: {
            podcastSeason: season.slug,
            podcastEpisode: episode.slug,
          },
        }
      })
    }, [])
    .flatMap((path: any) => path)
  return {paths, fallback: 'blocking'}
}

const PodcastEpisodePage = ({episode}: any) => {
  return <EpisodeLayout episode={episode} />
}

const EpisodeLayout = ({episode}: {episode: PodcastEpisode}) => {
  const {title, simplecastId, transcript, content, description} = episode

  const ogImage = getOgImage(title)
  const shortDescription = description
    ? description
    : content
    ? toPlainText(content).substring(0, 157) + '...'
    : ''
  const router = useRouter()

  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout
      meta={{
        ogImage,
        title,
        description: shortDescription,
        url: `${process.env.NEXT_PUBLIC_URL}${router.asPath}`,
      }}
    >
      <main className="max-w-screen-md px-5 mx-auto prose sm:py-16 py-5">
        <h1 className="max-w-screen-md py-4 mx-auto text-3xl font-bold leading-none font-heading sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <div className="prose opacity-90 md:prose-p:text-white/90 md:prose-headings:mx-auto md:prose-lg prose-p:my-5 md:prose-p:my-8 xl:prose-p:my-10 xl:prose-xl max-w-none">
          <Markdown>{description}</Markdown>
        </div>
        <PodcastPlayer simplecastId={simplecastId} />
        <div className="prose opacity-90 md:prose-p:text-white/90 md:prose-headings:mx-auto md:prose-lg prose-p:my-5 md:prose-p:my-8 xl:prose-p:my-10 xl:prose-xl max-w-none">
          <PortableText value={content} components={PortableTextComponents} />
        </div>
        <section data-article="">
          {!loadingSubscriber && !subscriber ? (
            <div className="relative flex flex-col items-center pt-16 pb-16 md:pt-24 md:pb-32">
              <Image
                src={'/images/emails/migrate-js-project-to-ts/thumb@2x.png'}
                alt=""
                width={300}
                height={180}
                quality={100}
                aria-hidden="true"
              />
              <div className="flex flex-col items-center py-8 text-center">
                <h2 className="text-4xl font-bold m-0">
                  Migrate an OSS JS Project to TypeScript
                </h2>
                <h3 className="max-w-md pt-2 text-xl font-light text-blue-200 opacity-90">
                  3 email lessons delivered over 3 days that will give you a
                  taste of real-world TypeScript!
                </h3>
              </div>

              <SubscribeToConvertkitForm
                formId={formId}
                onSuccess={(subscriber: any) => {
                  if (subscriber) {
                    const redirectUrl = redirectUrlBuilder(
                      subscriber,
                      '/confirm',
                    )
                    router.push(redirectUrl)
                  }
                }}
                actionLabel="Start the Course Email Now!"
                submitButtonElem={SubscribeButton()}
              />
              <small className="pt-16 text-sm font-light text-blue-100 opacity-60">
                We respect your privacy. Unsubscribe at any time.
              </small>
            </div>
          ) : null}
        </section>
        <div className="mt-20 prose opacity-90 md:prose-p:text-white/90 md:prose-headings:mx-auto md:prose-lg prose-p:my-5 md:prose-p:my-8 xl:prose-p:my-10 xl:prose-xl max-w-none">
          <h2>Transcript</h2>
          <Markdown>{transcript}</Markdown>
        </div>
      </main>
    </Layout>
  )
}

export default PodcastEpisodePage

const SubscribeButton = () => {
  return (
    <Button className="relative flex items-center justify-center overflow-hidden">
      <span className="relative z-10">Start the Course Now! </span>
      <motion.div
        initial={{
          background: 'transparent',
        }}
        aria-hidden="true"
        transition={{
          repeat: Infinity,
          duration: 3,
          repeatDelay: 1.6,
        }}
        animate={{
          background: [
            'linear-gradient(to right, rgba(132, 171, 255, 0) -50%, rgba(132, 171, 255, 0) 0%, rgba(132, 171, 255, 0) 100%)',
            'linear-gradient(to right, rgba(132, 171, 255, 0) 100%, rgb(132, 171, 255, 1) 200%, rgba(132, 171, 255, 0) 200%)',
          ],
        }}
        className="absolute top-0 left-0 items-center justify-center w-full h-full space-x-1 tracking-wide uppercase bg-white pointer-events-none bg-opacity-10 bg-blend-overlay "
      />
    </Button>
  )
}
