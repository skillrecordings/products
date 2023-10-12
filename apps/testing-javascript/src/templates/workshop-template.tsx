import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'

import {useModuleProgress} from 'utils/module-progress'
import Layout from 'components/layout'
import Icon from 'components/icons'
import {secondsToFormattedTime} from 'lib/secondsToFormattedTime'
import {Module} from '@types'

const LessonItem: React.FC<{lesson: any; index: number}> = ({
  lesson,
  index,
}) => {
  const {title, slug, body, durationInSeconds} = lesson
  const moduleProgress = useModuleProgress()
  const isLessonCompleted = moduleProgress?.lessons.find(
    (progressLesson) =>
      progressLesson.id === lesson._id && progressLesson.lessonCompleted,
  )
  return (
    <li className="border-b border-black/[.05] last-of-type:border-none pb-8 mb-10 space-y-4">
      <h3 className="text-[28px] max-w-[473px] leading-tight">
        <Link href={`/lessons/${slug}`} className="hover:underline">
          <span className="font-tt-light">{index + 1}.</span> {title}
        </Link>
      </h3>
      {body && (
        <div className="mt-7">
          <PortableText value={body} />
        </div>
      )}
      <div className="flex items-center space-x-5">
        {isLessonCompleted && (
          <div className="flex items-center text-base">
            <Icon name="check-circle-fill" className="w-5 h-5 ml-4 mr-2" />
            <span className="uppercase tracking-wider">completed</span>
          </div>
        )}
        <Link
          href={`/lessons/${slug}`}
          className="space-x-4 flex items-center bg-gray-100 text-black px-6 py-2 rounded-md hover:bg-gray-200 duration-100 min-h-[50px]"
        >
          <Icon name="play" className="w-[10px] h-[10px]" />
          <span>{isLessonCompleted ? 'Rewatch Lesson' : 'Watch Lesson'}</span>
        </Link>
        {durationInSeconds && (
          <div className="space-x-2 flex items-center text-base">
            <Icon name="duration" className="w-5 h-5 text-gray-400" />
            <span>
              {secondsToFormattedTime(Number.parseInt(durationInSeconds), {
                resolveToSeconds: true,
              })}
            </span>
          </div>
        )}
      </div>
    </li>
  )
}

const WorkshopTemplate: React.FC<{
  workshop: Module
}> = ({workshop}) => {
  const lessons = workshop?.sections?.[0]?.lessons || []
  const moduleProgress = useModuleProgress()
  const firstLessonSlug = lessons?.[0].slug
  const nextLessonSlug = moduleProgress?.nextLesson?.slug
  const ogImage = {
    url: `${process.env.NEXT_PUBLIC_URL}${
      process.env.NEXT_PUBLIC_OG_IMAGE_MODULE_API_URL
    }?type=module&image=${encodeURI(
      workshop.image as string,
    )}&title=${encodeURI(workshop.title)}`,
    alt: 'module image',
  }
  return (
    <Layout meta={{ogImage, title: workshop.title}}>
      {workshop?.sections?.map((section) => {
        return (
          <div
            key={section.slug}
            className="max-w-3xl mx-auto py-5 flex flex-col items-center"
          >
            {workshop?.image ? (
              <div className="w-full max-w-[340px]">
                <Image
                  src={workshop.image}
                  alt={workshop?.title}
                  title={workshop?.title}
                  width={340}
                  height={340}
                  priority
                />
              </div>
            ) : null}
            <h2 className="text-5xl mt-12">{section.title}</h2>
            <div className="mt-7 flex items-center space-x-6">
              <div className="space-x-2 flex items-center text-base">
                <Icon name="lesson" className="w-[22px] h-[22px]" />
                <span>
                  {workshop?.sections?.[0]?.lessons?.length} video lessons
                </span>
              </div>
              {workshop.durationInSeconds && (
                <div className="space-x-2 flex items-center text-base">
                  <Icon name="duration" className="w-[22px] h-[22px]" />
                  <span>
                    {secondsToFormattedTime(
                      Number.parseInt(workshop.durationInSeconds),
                    )}{' '}
                    of learning material
                  </span>
                </div>
              )}
            </div>
            <Link
              href={
                nextLessonSlug
                  ? `/lessons/${nextLessonSlug}`
                  : `/lessons/${firstLessonSlug}`
              }
              className="space-x-4 flex items-center bg-gray-100 text-black px-6 py-2 rounded-md mt-7 hover:bg-gray-200 duration-100 min-h-[50px]"
            >
              <Icon name="play" className="w-[10px] h-[10px]" />
              <span>
                {nextLessonSlug && nextLessonSlug !== firstLessonSlug
                  ? 'Continue'
                  : 'Start'}{' '}
                Watching
              </span>
            </Link>
            <div className="mt-7">
              <PortableText
                value={workshop.body}
                components={{
                  list: {
                    bullet: ({children}) => (
                      <ul className="space-y-5 mt-6">{children}</ul>
                    ),
                  },
                  listItem: {
                    bullet: ({children}) => (
                      <li className="flex items-center space-x-3">
                        <Icon
                          name="check-circle"
                          className="w-[23px] h-[23px] text-[#5cc7c7]"
                        />
                        <span>{children}</span>
                      </li>
                    ),
                  },
                }}
              />
            </div>
            <div className="mt-20 pt-10 border-t border-black/[.08] w-full">
              <h3 className="uppercase opacity-60 text-base font-sans tracking-wider">
                lessons
              </h3>
              {lessons && (
                <ul className="mt-10">
                  {lessons.map((lesson, index) => (
                    <LessonItem
                      key={lesson._id}
                      lesson={lesson}
                      index={index}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        )
      })}
    </Layout>
  )
}

export default WorkshopTemplate
