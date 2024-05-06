'use client'

import * as React from 'react'
import type {ChapterResource} from '@/lib/chapters'
import {cn} from '@skillrecordings/ui/utils/cn'
import {Button} from '@skillrecordings/ui/primitives/button'

export const ResourceItem: React.FC<{
  resource: ChapterResource
  body: any
  solutionBody: any
}> = ({resource, body, solutionBody}) => {
  const [isSolutionExpanded, setIsSolutionExpanded] = React.useState(false)

  return (
    <section
      id={resource.slug.current}
      key={resource.slug.current}
      className="relative"
    >
      <h2 className="top-0 z-20 w-full bg-background p-3">{resource.title}</h2>
      {resource.body && <div className="px-3">{body}</div>}
      {solutionBody && (
        <div
          className={cn('relative', {
            "flex h-80 flex-col items-center justify-start overflow-y-hidden after:absolute after:bottom-0 after:left-0 after:h-56 after:w-full after:bg-gradient-to-t after:from-background after:to-transparent after:content-['']":
              !isSolutionExpanded,
            'h-auto': isSolutionExpanded,
          })}
        >
          <div className="relative w-full px-3">
            <h3>Solution</h3>
            {solutionBody}
          </div>
          {!isSolutionExpanded && (
            <Button
              className="absolute bottom-10 z-10"
              size="lg"
              onClick={() => {
                setIsSolutionExpanded(!isSolutionExpanded)
              }}
            >
              {isSolutionExpanded ? 'Hide' : 'Display'} Solution
            </Button>
          )}
        </div>
      )}
      <hr />
    </section>
  )
}
