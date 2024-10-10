import * as React from 'react'
import cx from 'classnames'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import type {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import * as Dialog from '@radix-ui/react-dialog'
import {XIcon} from '@heroicons/react/solid'
import MuxPlayer from '@mux/mux-player-react'

import Icon from '@/components/icons'
import CertificateForm from '@/components/certificate-form'
import {trpc} from '@/trpc/trpc.client'
import {z} from 'zod'
import flatten from 'lodash/flatten'

const INTERVIEWS_PLAYLIST_SLUG = 'expert-interviews-module'

const AccessYourCourse: React.FunctionComponent<{
  product: SanityProduct
  className?: string
}> = ({product, className}) => {
  const {data: lessonProgress} = trpc.progress.get.useQuery()

  let courseCompleted: boolean

  if (!lessonProgress || 'error' in lessonProgress) {
    courseCompleted = false
  } else {
    const playlists = product.modules

    const PlaylistSchema = z.array(
      z.object({
        slug: z.string(),
        sections: z.array(
          z.object({
            lessons: z.array(z.object({_id: z.string()})),
          }),
        ),
      }),
    )
    const parsedPlaylists = PlaylistSchema.parse(playlists)
    const lessonsByPlaylistSlug = parsedPlaylists
      .map(
        (playlist) =>
          [
            playlist.slug,
            flatten(playlist.sections.map((section) => section.lessons)),
          ] as const,
      )
      .filter((playlist) => {
        const [playlistSlug] = playlist
        return playlistSlug !== INTERVIEWS_PLAYLIST_SLUG
      })

    courseCompleted = lessonsByPlaylistSlug.every((playlistLessons) => {
      const [_, lessons] = playlistLessons

      return lessons.every((lesson) => {
        const matchingLessonProgress = lessonProgress.find(
          ({lessonId}) => lessonId === lesson._id,
        )
        return Boolean(matchingLessonProgress?.completedAt)
      })
    })
  }

  return (
    <section className={cx(className)}>
      <div className="container max-w-6xl mb-20">
        <div className="flex flex-col items-center">
          <div className="w-40">
            <Image
              src={product.image.url}
              alt={product.name}
              width={368}
              height={368}
            />
          </div>
          <Balancer>
            <div className="space-y-6 text-lg">
              <h2 className="text-3xl md:text-4xl font-tt-regular text-center">
                Access your{' '}
                <span className="font-tt-demibold">{product.name}</span> course.
              </h2>
              <div className="max-w-3xl text-center mx-auto space-y-6">
                <p>
                  If you want to chat with other people taking this course, or
                  have content questions, please head on over to the{' '}
                  <a
                    href="/discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b-2  border-tjs-yellow hover:bg-tjs-yellow duration-200"
                  >
                    <b>Epic Web discord server</b>
                  </a>
                  . .
                </p>
                <p>
                  Also, don't miss{' '}
                  <a
                    href="https://testing-library.com/discord"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b-2  border-tjs-yellow hover:bg-tjs-yellow duration-200"
                  >
                    <b>the Testing Library discord server</b>
                  </a>{' '}
                  if you'd like help with implementing Testing Library in your
                  own project.
                </p>
                <p>
                  If you are having technical issues, please email{' '}
                  <a
                    href="mailto:help@testingjavascript.com"
                    className="border-b-2  border-tjs-yellow hover:bg-tjs-yellow duration-200"
                  >
                    help@testingjavascript.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </Balancer>
          {courseCompleted && (
            <Dialog.Root>
              <Dialog.Trigger data-download-certificate-button className="mt-8">
                <span>Download Course Completion Certificate</span>
              </Dialog.Trigger>
              <CertificateForm />
            </Dialog.Root>
          )}
          <Dialog.Root>
            <Dialog.Trigger className="space-x-4 inline-flex items-center bg-gray-100 text-black px-6 py-2 rounded-md mt-7 md:mt-10 lg:mt-16 hover:bg-gray-200 duration-100 min-h-[50px] self-center border-gray-200 border">
              <Icon name="play" className="w-[10px] h-[10px]" />
              <span>2020 Course Update</span>
            </Dialog.Trigger>
            <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-40 w-full -translate-x-1/2 -translate-y-1/2 container max-w-6xl">
              <MuxPlayer
                streamType="on-demand"
                playbackId="JQdURmWoO9fy9QTSY5KvGsD1K7XpPPMXZxyKWqIeqa8"
              />
              <Dialog.Close className="absolute right-7 -top-14 rounded-full px-3 py-1 space-x-2 flex items-center bg-gray-100 hover:bg-white duration-200">
                <span>close</span>
                <XIcon className="h-5 w-5" />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>
    </section>
  )
}

export default AccessYourCourse
