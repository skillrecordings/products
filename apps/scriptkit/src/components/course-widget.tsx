import * as React from 'react'
import {convertTimeToMins} from 'utils/time-utils'
import {Course} from 'utils/types'

const CourseWidget: React.FC<
  React.PropsWithChildren<{course: Course; cta?: string}>
> = ({course, cta}) => {
  const {title, path, lessons, instructor, duration, image_thumb_url} = course
  return (
    <div className="sm:grid grid-cols-2 bg-gradient-to-bl from-gray-900 to-gray-800 rounded-lg overflow-hidden">
      <div className="sm:p-8 p-5">
        <img
          src={image_thumb_url}
          alt={title}
          width={100}
          height={100}
          className="-m-3"
        />
        <div className="sm:pt-8 pt-5">
          <p className="uppercase text-xs font-semibold pb-2 text-yellow-500">
            video course
          </p>
          <h2 className="text-3xl font-bold">
            {title}{' '}
            <span className="text-xl text-gray-400 font-normal">
              – by {instructor.full_name}
            </span>
          </h2>
          <a
            href={`https://egghead.io${path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:mt-8 mt-5 relative inline-flex flex-col group"
          >
            <div className="z-10 relative w-full font-medium px-5 py-3 rounded-xl group-hover:-translate-y-0.5 will-change-transform text-white bg-gradient-to-tr from-purple-500 to-pink-500 transition">
              <span className="">{cta || 'Watch the course'}</span>
            </div>
            <div
              aria-hidden="true"
              className="absolute left-0 -bottom-1 w-full h-6 rounded-b-xl bg-gradient-to-tr from-purple-700 to-pink-700 z-0"
            />
          </a>
        </div>
      </div>
      <div className="sm:border-l border-gray-800 border-t sm:border-t-0">
        <div className="px-3.5 pt-5 pb-2 flex items-center text-xs justify-between">
          <span className="font-medium uppercase text-gray-400">
            {lessons.length} lessons
          </span>
          <span className="font-medium text-gray-400">
            {convertTimeToMins(Number(duration))}
          </span>
        </div>
        <ul>
          {lessons.map((lesson) => {
            return (
              <li key={lesson.path}>
                <a
                  href={`https://egghead.io${lesson.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between space-x-1 px-2 py-2 hover:bg-gray-800 group transition"
                >
                  <div className="flex items-center">
                    <PlayIcon />
                    <span className="leading-tighter text-sm text-gray-300 group-hover:text-white transition">
                      {lesson.title}
                    </span>
                  </div>
                  <div className="text-xs pr-2 pl-1 text-gray-500">
                    {convertTimeToMins(Number(lesson.duration))}
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 20 20"
    className="p-1.5 group-hover:text-yellow-500 text-gray-500 transition"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M4 3.323A1.25 1.25 0 015.939 2.28l10.32 6.813a1.25 1.25 0 010 2.086L5.94 17.992A1.25 1.25 0 014 16.949V3.323z"
    />
  </svg>
)

export default CourseWidget
