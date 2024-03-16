import * as React from 'react'
import {getChapterList} from '@/lib/book'
import Link from 'next/link'

export const ChaptersIndex: React.FC = async () => {
  const chapters = await getChapterList('total-typescript')

  return chapters ? (
    <>
      {chapters.map((chapter) => {
        return (
          <li key={chapter.slug.current}>
            <span className="text-lg font-semibold">{chapter.title}</span>
            <ul className="list-inside list-disc">
              {chapter.resources?.map((resource) => {
                return (
                  <li key={resource.slug.current}>
                    <Link
                      href={`/book/${chapter.slug.current}/${resource.slug.current}`}
                      className="font-medium hover:underline"
                    >
                      {resource.title}
                    </Link>
                    {resource?.solution && (
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
                    )}
                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </>
  ) : null
}
