import * as React from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import {Language} from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'

import {DiscussionProps} from 'lib/get-discussions'
import CodeBlock from 'components/code-block'
import rehypeRaw from 'rehype-raw'

const DocsPost = ({
  discussion: {discussion: url, command, title, content},
  link,
}: DiscussionProps) => (
  <div key={url} className="docs pb-10">
    <h2 className="text-4xl font-bold">{title}</h2>
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        h2({children}) {
          return <h3 className="text-xl font-bold pt-4">{children}</h3>
        },
        p({children}) {
          const c = String(children)

          if (c.startsWith('http') && c.endsWith('.mp4')) {
            return (
              <video controls className="w-full">
                <source src={c} type="video/mp4" />
              </video>
            )
          }

          return <p>{children}</p>
        },
        code({node, inline, className, children, ...props}: any) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <div className="border border-white border-opacity-25 rounded-md my-6">
              <CodeBlock
                value={String(children).replace(/\n$/, '')}
                // @ts-ignore
                theme={theme}
                language={match[1] as Language}
              />
            </div>
          ) : (
            <code className="inline-code" {...props}>
              {children}
            </code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
    <section className="max-w-screen-lg mx-auto flex flex-col justify-end items-end mt-4">
      <a href={url}>{`Discuss "${title}" on Github`}</a>
    </section>
  </div>
)

export default DocsPost
