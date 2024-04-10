'use client'

import {cn} from '@skillrecordings/ui/utils/cn'
import Link from 'next/link'
import React from 'react'
import {useParams, usePathname} from 'next/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@skillrecordings/ui/primitives/accordion'
import type {ChapterList} from '../_schema/book-schemas'

export const ChapterToC: React.FC<{
  chaptersLoader: Promise<ChapterList | null>
}> = ({chaptersLoader}) => {
  const chapters = React.use(chaptersLoader)
  const params = useParams()
  const pathname = usePathname()

  return chapters ? (
    <Accordion
      type="single"
      defaultValue={params?.chapter as string}
      collapsible
      className="flex flex-col gap-1"
    >
      {chapters.map((chapter) => {
        return (
          <AccordionItem
            className="rounded border bg-white/5"
            value={chapter.slug.current}
            key={chapter.slug.current}
          >
            <AccordionTrigger className="flex w-full px-3 py-2.5 text-left text-lg font-semibold leading-tight transition hover:bg-white/5">
              {chapter.title}
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <ul className="flex flex-col">
                {chapter.resources?.map((resource) => {
                  const isActiveSolution = pathname?.includes('/solution')
                  const isActive = resource.slug.current === params?.resource

                  return (
                    <li key={resource.slug.current} className="">
                      {resource.solution ? (
                        <div className="flex flex-col">
                          <Link
                            href={`/book/${chapter.slug.current}/${resource.slug.current}`}
                            className={cn(
                              'flex px-3 py-2 text-base font-medium text-gray-200 transition hover:bg-white/5 hover:text-white',
                              {
                                'bg-white/10': isActive && !isActiveSolution,
                              },
                            )}
                          >
                            {resource.title}
                          </Link>
                          <div className="flex flex-col">
                            {/* <Link
                              href={`/book/${chapter.slug.current}/${resource.slug.current}`}
                              className={cn(
                                'flex px-5 py-1.5 text-base font-medium text-gray-200 transition hover:bg-white/5 hover:text-white',
                                {
                                  'bg-white/10': isActive && !isActiveSolution,
                                },
                              )}
                            >
                              Problem
                            </Link> */}
                            <Link
                              href={`/book/${chapter.slug.current}/${resource.slug.current}/solution`}
                              className={cn(
                                'flex px-5 py-1.5 text-sm font-medium text-gray-200 transition hover:bg-white/5 hover:text-white',
                                {
                                  'bg-white/10': isActive && isActiveSolution,
                                },
                              )}
                            >
                              Solution
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={`/book/${chapter.slug.current}/${resource.slug.current}`}
                          className={cn(
                            'flex px-3 py-2 text-base font-medium text-gray-200 transition hover:bg-white/5 hover:text-white',
                            {
                              'bg-white/10': isActive,
                            },
                          )}
                        >
                          {resource.title}
                        </Link>
                      )}

                      {/* {resource?.solution && (
                      <>
                        {' '}
                        |{' '}
                        <Link
                          href={`/book/${chapter.slug.current}/${resource.slug.current}/solution`}
                          className=" hover:underline"
                        >
                          Solution
                        </Link>
                      </>
                    )} */}
                    </li>
                  )
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  ) : null
}
