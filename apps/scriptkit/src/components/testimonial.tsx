import React from 'react'
import {Testimonial as TestimonialType} from 'utils/types'
import ReactMarkdown from 'react-markdown'

const Testimonial: React.FC<{testimonial: TestimonialType}> = ({
  testimonial,
}) => {
  const {name, avatar, url, handle, review} = testimonial

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-2">
          <img
            src={`/assets/testimonials/${avatar}`}
            alt={name}
            width={54}
            height={54}
            className="rounded-full"
          />
          <div className="leading-tight">
            <a
              href={`https://twitter.com/${handle}`}
              rel="noopener noreferrer"
              target="_blank"
              className="hover:underline block"
            >
              {name}
            </a>
            {handle && (
              <a
                href={`https://twitter.com/${handle}`}
                rel="noopener noreferrer"
                target="_blank"
                className="opacity-60 block"
              >
                @{handle}
              </a>
            )}
          </div>
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5"
              viewBox="0 0 16 16"
            >
              <title>logo-twitter</title>
              <g fill="#69ACE0">
                <path
                  fill="#69ACE0"
                  d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z"
                ></path>
              </g>
            </svg>
          </a>
        )}
      </div>
      <div className="pt-3">
        <ReactMarkdown className="prose">{review}</ReactMarkdown>
      </div>
    </div>
  )
}

export default Testimonial
