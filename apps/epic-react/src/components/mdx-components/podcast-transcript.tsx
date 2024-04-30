import * as React from 'react'
import SimpleBar from 'simplebar-react'
import cn from 'classnames'

const PodcastTranscript = ({children}: {children: React.ReactNode}) => {
  const [isOpen, setOpen] = React.useState(false)

  const Toggle = () => (
    <button
      className="flex items-center justify-center pt-6 text-er-primary hover:underline"
      onClick={() => setOpen(!isOpen)}
    >
      {isOpen ? (
        <>
          Collapse
          <svg
            className="ml-1"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM7 9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H7z"
                fill="currentColor"
              />
            </g>
          </svg>
        </>
      ) : (
        <>
          Expand
          <svg
            className="ml-1"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-11a1 1 0 1 0-2 0v2H7a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2V7z"
                fill="currentColor"
              />
            </g>
          </svg>
        </>
      )}
    </button>
  )
  return (
    <section aria-describedby="transcript">
      <div className="flex items-center justify-between">
        <h2>Transcript</h2>
        <Toggle />
      </div>
      <SimpleBar
        className={cn(
          'overflow-y-auto overscroll-contain rounded-lg border-er-gray-200 bg-er-gray-100 px-4 text-base sm:px-7 sm:text-lg',
          isOpen ? 'h-auto' : 'h-96',
        )}
      >
        {children}
      </SimpleBar>
      {isOpen && <Toggle />}
    </section>
  )
}

export default PodcastTranscript
