import * as React from 'react'
import type {Chapter} from '@/lib/chapters'
import {ChapterResourceListItem} from './chapter-resource-list-item'

export const ChapterResourceList: React.FC<{
  chapterLoader: Promise<Chapter | null>
}> = async ({chapterLoader}) => {
  const chapter = await chapterLoader

  if (!chapter?.resources) return null

  return (
    <>
      {chapter?.resources.map((resource) => {
        return <ChapterResourceListItem resource={resource} chapter={chapter} />
      })}
    </>
  )
}
