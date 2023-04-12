import React from 'react'
import ReactMarkdown from 'react-markdown'
import {LoadedScript} from 'utils/types'
import Link from 'next/link'
import {format} from 'date-fns'

const BlogTeaser: React.FC<{discussion: LoadedScript}> = ({discussion}) => {
  const {title, content, command, createdAt} = discussion
  return (
    <article className="">
      <h2 className="text-2xl font-semibold">
        <Link
          href={{
            pathname: '/blog/[slug]',
            query: {
              slug: command,
            },
          }}
          className="hover:underline hover:decoration-gray-400"
        >
          {title}
        </Link>
      </h2>
      {createdAt && (
        <time className="text-sm text-gray-500">
          {format(new Date(createdAt), 'MMMM dd, yyyy')}
        </time>
      )}
    </article>
  )
}

export default BlogTeaser
