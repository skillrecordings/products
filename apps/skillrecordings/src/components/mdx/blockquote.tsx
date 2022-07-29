import * as React from 'react'

type BlockquoteProps = {
  children: React.ReactNode
}

const Blockquote: React.FC<React.PropsWithChildren<BlockquoteProps>> = ({
  children,
}) => {
  return (
    <blockquote className="not-prose p-5 dark:border-gray-700 border-gray-300 border-l-[3px] dark:bg-gray-800 bg-gray-100 dark:text-gray-200 text-gray-800 relative not-italic font-normal">
      <div className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="85"
          height="70"
          fill="none"
          viewBox="0 0 85 70"
          className="w-4 fill-white"
        >
          <path d="M18.857.143c-3.343 5.4-6.428 10.8-9 16.457-4.886 9.514-9 21.6-9 31.114 0 14.4 9 21.857 19.286 21.857 10.285 0 19.285-7.457 19.285-20.571C39.428 38.714 33 29.714 24 28.428L30.428.143h-11.57zm45 0c-3.343 5.4-6.428 10.8-9 16.457-4.886 9.514-9 21.6-9 31.114 0 14.4 9 21.857 19.286 21.857 10.285 0 19.286-7.457 19.286-20.571C84.429 38.714 78 29.714 69 28.428L75.429.143H63.857z" />
        </svg>
      </div>
      {children}
    </blockquote>
  )
}

export default Blockquote
