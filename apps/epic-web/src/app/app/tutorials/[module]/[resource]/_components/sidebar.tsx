'use client'
import {CheckIcon} from '@heroicons/react/outline'
import type {LessonProgress, Prisma} from '@skillrecordings/database'
import type {ModuleProgress} from '@skillrecordings/skill-lesson/video/module-progress'
import {ScrollArea} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'
import Spinner from 'components/spinner'
import type {Tutorial} from 'lib/tutorials'
import Image from 'next/image'
import Link from 'next/link'
import {useParams} from 'next/navigation'
import React, {use, useRef} from 'react'
import {trpc} from 'trpc/trpc.client'

export const Sidebar: React.FC<{
  moduleLoader: Promise<Tutorial | null>
  //   userProgress?: ModuleProgress
}> = ({moduleLoader}) => {
  const module = use(moduleLoader)
  const ref = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLLIElement>(null)
  const params = useParams()
  const {data: userProgress, status: userProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: params?.module as string,
    })

  React.useEffect(() => {
    if (ref.current && activeRef.current) {
      ref.current.children[1].scrollTo({
        top: activeRef.current.offsetTop - ref.current.offsetTop,
        behavior: 'smooth',
      })
    }
  }, [])

  if (!params?.resource) return null

  return (
    <aside className="relative flex h-[calc(100vh-49px)] flex-col bg-gray-100">
      <div className="flex flex-wrap items-center gap-2 px-5 py-2">
        {module?.image && (
          <Image
            src={module.image}
            width={120}
            height={120}
            alt={module.title}
            className=""
          />
        )}
        <div className="flex flex-col">
          <div className="inline-flex gap-1">
            <Link href="/app/tutorials">Tutorials</Link>
            <span>/</span>
          </div>
          <Link
            href={`/app/tutorials/${module?.slug.current}`}
            className="text-xl font-black"
          >
            {module?.title}
          </Link>
        </div>
      </div>
      <ScrollArea className="relative h-full" ref={ref}>
        {userProgressStatus === 'loading' && (
          <Spinner className="absolute right-5 top-5 z-50 h-3 w-3" />
        )}

        {module?.sections.map((section) => {
          return (
            <ul
              key={section._id}
              className="flex flex-col gap-1 bg-secondary p-2"
            >
              {section.lessons.map((lesson) => {
                const isActive = params?.resource === lesson.slug
                const isCompleted = userProgress?.lessons?.some(
                  (progressLesson) =>
                    progressLesson.id === lesson._id &&
                    progressLesson.lessonCompleted,
                )
                return (
                  <li
                    key={lesson._id}
                    data-active={isActive}
                    ref={isActive ? activeRef : null}
                  >
                    <Link
                      href={lesson.slug}
                      className={cn(
                        'relative flex min-h-[65px] items-center overflow-hidden text-balance rounded border-l-4 border-transparent bg-background px-3 py-2 pr-6 font-semibold leading-tight',
                        {
                          'border-primary bg-slate-300/60 shadow-inner':
                            isActive,
                        },
                      )}
                    >
                      {lesson.title}
                      {isCompleted && (
                        <CheckIcon className="absolute right-4 w-3" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )
        })}
      </ScrollArea>
    </aside>
  )
}
