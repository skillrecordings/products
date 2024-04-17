import * as React from 'react'
import {getChapterList} from '@/lib/book'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@skillrecordings/ui/primitives/accordion'

export const ChaptersIndex: React.FC = async () => {
  const chapters = await getChapterList('total-typescript')

  return chapters ? (
    <Accordion type="single" collapsible className="flex flex-col gap-1">
      {chapters.map((chapter) => {
        return (
          <AccordionItem
            className="rounded border bg-white/5"
            value={chapter.slug.current}
            key={chapter.slug.current}
          >
            <AccordionTrigger
              // href={`/book/${chapter.slug.current}`}
              className="flex w-full px-3 py-2.5 text-left text-lg font-semibold leading-tight transition hover:bg-white/5"
            >
              {chapter.title}
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <ul className="">
                {chapter.resources?.map((resource) => {
                  return (
                    <li key={resource.slug.current}>
                      <Link
                        href={`/book/${chapter.slug.current}/${resource.slug.current}`}
                        className="flex px-3 py-2 text-base font-medium text-gray-200 transition hover:bg-white/5 hover:text-white"
                      >
                        {resource.title}
                      </Link>
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
