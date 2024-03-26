import React from 'react'
import getUserLocale from 'get-user-locale'
import {formatDistance, isFuture} from 'date-fns'

const Livestream = ({
  title,
  startDatetime,
  description,
  livestreamUrl,
  children,
  calendarUrl,
}: any) => {
  const userLocale = getUserLocale
  const milliseconds = startDatetime
  const isFutureLivestream = isFuture(startDatetime)
  const date = new Date(milliseconds)
  const dateOptions = {
    timeZoneName: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  const url = `${livestreamUrl}&utm_source=${process.env.SITE_NAME}`

  return (
    <article className="border-b border-er-gray-200 py-8">
      {isFutureLivestream && (
        <span
          className={`rounded-full bg-opacity-25 px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
            isFutureLivestream
              ? 'bg-red-400 text-red-400'
              : 'bg-green-400 text-green-400'
          }`}
        >
          ● Live
        </span>
      )}
      <a href={url} target="_blank">
        <h2 className="mb-1 mt-4 text-3xl font-bold leading-tight">{title}</h2>
      </a>
      <time className="mb-4 block text-lg font-medium text-er-primary">
        {isFutureLivestream ? 'Live in' : 'Streamed'}{' '}
        {formatDistance(date, Date.now())} {!isFutureLivestream && 'ago'}{' '}
        <span className="text-base font-normal text-er-primary opacity-75">
          ({date.toLocaleString(userLocale as any, dateOptions as any)})
        </span>
      </time>
      {description && (
        <p className="text-base text-er-gray-700">{description}</p>
      )}
      {children}
      {isFutureLivestream && calendarUrl ? (
        <a
          className="mt-4 inline-flex transform cursor-pointer items-center justify-center rounded-md bg-blue-500 px-4 py-2 font-semibold leading-8 text-white transition-all duration-100 ease-in-out hover:scale-105 hover:bg-blue-600"
          href={calendarUrl}
          target="_blank"
        >
          {/* prettier-ignore */}
          <svg className="text-blue-100 mr-1" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1zm0 5a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H6z" fill="currentColor"/></g></svg>
          Remind Me
        </a>
      ) : (
        <a
          className="mt-4 inline-flex transform cursor-pointer items-center justify-center rounded-md bg-blue-500 px-4 py-2 font-semibold leading-8 text-white transition-all duration-100 ease-in-out hover:scale-105 hover:bg-blue-600"
          href={url}
          target="_blank"
        >
          {/* prettier-ignore */}
          <svg className="mr-1 text-blue-100" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9.555 7.168A1 1 0 0 0 8 8v4a1 1 0 0 0 1.555.832l3-2a1 1 0 0 0 0-1.664l-3-2z" fill="currentColor"/></g></svg>
          Watch Recording
        </a>
      )}
      {isFutureLivestream && (
        <a
          className="mt-4 inline-flex transform cursor-pointer items-center justify-center rounded-md border-2 border-blue-500 bg-background px-4 py-2 font-semibold leading-7 text-text transition-all duration-100 ease-in-out hover:scale-105 hover:bg-blue-300 hover:bg-opacity-25 sm:ml-3"
          href={url}
          target="_blank"
        >
          {/* prettier-ignore */}
          <svg className="mr-1 text-gray-600" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M11 3a1 1 0 1 0 0 2h2.586l-6.293 6.293a1 1 0 1 0 1.414 1.414L15 6.414V9a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1h-5z" fill="currentColor"/><path d="M5 5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3a1 1 0 1 0-2 0v3H5V7h3a1 1 0 0 0 0-2H5z" fill="currentColor"/></g></svg>
          Open on Youtube
        </a>
      )}
    </article>
  )
}

export default Livestream
