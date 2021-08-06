import * as React from 'react'
import type {LessonResource, Resource} from '@types'
import Image from 'next/image'
import Markdown from 'react-markdown'
import {convertTimeWithTitles} from 'utils/time-utils'
import Lessons from 'components/learn/module/lessons'
import Play from 'components/learn/module/play'

type ModuleProps = {
  resource: Resource
  items: LessonResource[]
  progress: any
  i: number
}

const Module: React.FC<ModuleProps> = ({resource, items, progress, i}) => {
  const [isExpanded, setExpanded] = React.useState(false)
  const {isModuleCompleted} = progress
  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
        <div className="flex sm:space-x-10 sm:p-10 p-5">
          <div className="flex sm:flex-row flex-col sm:items-start items-center sm:space-x-10 w-full">
            <div className="flex-shrink-0">
              <Image
                src={resource.square_cover_large_url}
                width={200}
                height={200}
                quality={100}
                alt={resource.title}
              />
            </div>
            <div className="w-full flex flex-col justify-between space-y-5">
              <h2 className="sm:text-3xl text-2xl font-bold tracking-tight">
                <span className="pr-1 font-light">{i + 1}</span>{' '}
                {resource.title}
              </h2>
              <div
              // className="p-5 bg-white dark:bg-black"
              >
                <Play items={items} progress={progress} />
              </div>
              <div className="space-y-3">
                <Markdown
                  children={resource.description}
                  className="prose dark:prose-dark max-w-none"
                />
                {items && (
                  <button
                    onClick={() => setExpanded(!isExpanded)}
                    className="flex items-center py-1 font-semibold"
                    aria-expanded={isExpanded}
                    aria-pressed={isExpanded}
                  >
                    <i
                      className={
                        isExpanded ? 'gg-chevron-up' : 'gg-chevron-down'
                      }
                    />
                    {/* <span>{isExpanded ? '-' : '+'}</span> */}
                    <span className="sr-only">view </span>
                    {items.length} lessons (
                    {convertTimeWithTitles(resource.duration)})
                  </button>
                )}
                {isExpanded && <Lessons items={items} progress={progress} />}
              </div>
            </div>
          </div>
        </div>
        {isModuleCompleted && (
          <div className="transform -rotate-45 w-12 h-1 bg-teal-500 absolute -left-3 top-3" />
        )}
      </div>
    </>
  )
}

export default Module
