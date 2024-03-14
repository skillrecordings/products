import * as React from 'react'
import {getChapterWithResources} from '@/lib/chapters'
import {ChapterResourceListItem} from './chapter-resource-list-item'

export const ChapterResourceList: React.FC<{
  currentChapterSlug: string
}> = async ({currentChapterSlug}) => {
  const chapter = await getChapterWithResources(currentChapterSlug)

  if (!chapter?.resources) return null

  return (
    <>
      {chapter?.resources.map((resource) => {
        return (
          <ChapterResourceListItem
            key={resource._id}
            resource={resource}
            chapter={chapter}
          />
        )
      })}
    </>
  )
}
