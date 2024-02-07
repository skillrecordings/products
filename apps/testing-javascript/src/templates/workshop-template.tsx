import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {PortableText} from '@portabletext/react'

import {useModuleProgress} from '@/utils/module-progress'
import Layout from '@/components/layout'
import Icon from '@/components/icons'
import {secondsToFormattedTime} from '@/lib/secondsToFormattedTime'
import {Module} from '@/@types/'
import {getNextLessonDetails} from '@/utils/get-next-lesson-details'

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
    <li className="mb-10 space-y-4 border-b border-black/[.05] pb-8 last-of-type:border-none">
      <h3 className="max-w-[473px] text-[28px] leading-tight">
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
            <Icon name="check-circle-fill" className="ml-4 mr-2 h-5 w-5" />
            <span className="uppercase tracking-wider">completed</span>
          </div>
        )}
        <Link
          href={`/lessons/${slug}`}
          className="flex min-h-[50px] items-center space-x-4 rounded-md bg-gray-100 px-6 py-2 text-black duration-100 hover:bg-gray-200"
        >
          <Icon name="play" className="h-[10px] w-[10px]" />
          <span>{isLessonCompleted ? 'Rewatch Lesson' : 'Watch Lesson'}</span>
        </Link>
        {durationInSeconds && (
          <div className="flex items-center space-x-2 text-base">
            <Icon name="duration" className="h-5 w-5 text-gray-400" />
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

  let nextLessonDetails: ReturnType<typeof getNextLessonDetails>

  {
    const firstLessonSlug = lessons?.[0].slug
    const nextLessonSlug = moduleProgress?.nextLesson?.slug
    const moduleCompleted = moduleProgress?.moduleCompleted || false
    const completedLessonCount = moduleProgress?.completedLessonCount || 0

    nextLessonDetails = getNextLessonDetails({
      firstLessonSlug,
      nextLessonSlug,
      moduleCompleted,
      completedLessonCount,
    })
  }

  const {nextLessonSlug, buttonText} = nextLessonDetails

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
            className="container flex max-w-3xl flex-col items-center py-5"
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
            <h2 className="mt-12 text-5xl">{section.title}</h2>
            <div className="mt-7 flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-base">
                <Icon name="lesson" className="h-[22px] w-[22px]" />
                <span>
                  {workshop?.sections?.[0]?.lessons?.length} video lessons
                </span>
              </div>
              {workshop.durationInSeconds && (
                <div className="flex items-center space-x-2 text-base">
                  <Icon name="duration" className="h-[22px] w-[22px]" />
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
              href={`/lessons/${nextLessonSlug}`}
              className="mt-7 flex min-h-[50px] items-center space-x-4 rounded-md bg-gray-100 px-6 py-2 text-black duration-100 hover:bg-gray-200"
            >
              <Icon name="play" className="h-[10px] w-[10px]" />
              <span>{buttonText}</span>
            </Link>
            <div className="mt-7">
              <PortableText
                value={workshop.body}
                components={{
                  list: {
                    bullet: ({children}) => (
                      <ul className="mt-6 space-y-5">{children}</ul>
                    ),
                  },
                  listItem: {
                    bullet: ({children}) => (
                      <li className="flex items-center space-x-3">
                        <Icon
                          name="check-circle"
                          className="h-[23px] w-[23px] text-[#5cc7c7]"
                        />
                        <span>{children}</span>
                      </li>
                    ),
                  },
                }}
              />
            </div>
            <div className="mt-20 w-full border-t border-black/[.08] pt-10">
              <h3 className="font-sans text-base uppercase tracking-wider opacity-60">
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
