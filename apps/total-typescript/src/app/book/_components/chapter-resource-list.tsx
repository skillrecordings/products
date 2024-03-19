'use client'

import * as React from 'react'
import {type Chapter} from '@/lib/chapters'
import {ChapterResourceListItem} from './chapter-resource-list-item'

export const ChapterResourceList: React.FC<{
  chapterWithResourcesLoader: Promise<Chapter | null>
}> = ({chapterWithResourcesLoader}) => {
  const chapter = React.use(chapterWithResourcesLoader)

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
