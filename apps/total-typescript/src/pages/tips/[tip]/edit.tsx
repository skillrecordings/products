import Layout from 'components/app/layout'
import * as React from 'react'
import VideoUploader from 'module-builder/video-uploader'
import {NextPageContext} from 'next'
import {sanityWriteClient} from '../../../utils/sanity-server'
import Link from 'next/link'
import MuxPlayer from '@mux/mux-player-react'
import {isEmpty} from 'lodash'

const SANITY_STUDIO_TIPS_BASE_URL = `https://totaltypescript.sanity.studio/desk`

export async function getServerSideProps(context: NextPageContext) {
  const {query} = context
  const {tip} = query
  const tipData = await sanityWriteClient.fetch(
    `*[_type == "tip" && slug.current == $slug][0]{
      ...,
      "videoResources": resources[@->._type == 'videoResource']->
    }`,
    {slug: tip},
  )

  if (!tipData) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      tip: tipData,
    },
  }
}

export default function Adminpage({tip}: {tip: any}) {
  console.log({tip})

  return (
    <div>
      <header className="relative flex flex-col items-center justify-center overflow-hidden px-5 pt-12">
        <div className="relative z-10 flex w-full max-w-screen-lg flex-col-reverse items-center  lg:flex-row">
          <div className="relative z-10 max-w-2xl pb-10 lg:py-12 lg:pb-12">
            <h1 className="w-full max-w-[14ch] font-heading text-4xl font-normal leading-[1.25] sm:mt-0 sm:text-5xl sm:leading-[1.15] lg:text-5xl lg:leading-[1.15] xl:text-6xl xl:leading-[1.15]">
              {tip.title}
            </h1>

            <Link
              href={`${SANITY_STUDIO_TIPS_BASE_URL}/tips;${tip._id}`}
              className="group mt-5 inline-block gap-2 rounded bg-gray-800 px-4 py-2 font-medium transition hover:bg-gray-700"
            >
              edit tip in Sanity Studio{' '}
              <span
                aria-hidden="true"
                className="text-gray-300 transition group-hover:text-white"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </header>
      <div>
        <VideoResources tip={tip} />
      </div>
      <div className="flex min-h-full items-center">
        <VideoUploader />
      </div>
    </div>
  )
}

/**
 * 1. Create a component that lists all videoResources within a tip
 */
const VideoResources = ({tip}: {tip: {videoResources: any[]}}) => {
  return !isEmpty(tip.videoResources) ? (
    <div>
      <ul>
        {tip.videoResources.map((videoResource: any) => {
          console.log({videoResource})
          return (
            <li key={videoResource._id}>
              <h2 className="text-2xl">{videoResource.title}</h2>
              <MuxPlayer playbackId={videoResource.muxAsset.muxPlaybackId} />
              <Link
                href={`${SANITY_STUDIO_TIPS_BASE_URL}/videoResource;${videoResource._id}`}
                className="group mt-5 inline-block gap-2 rounded bg-gray-800 px-4 py-2 font-medium transition hover:bg-gray-700"
              >
                edit {videoResource.title} in Sanity Studio{' '}
                <span
                  aria-hidden="true"
                  className="text-gray-300 transition group-hover:text-white"
                >
                  →
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  ) : (
    <div>
      <p>No video resources yet</p>
    </div>
  )
}
