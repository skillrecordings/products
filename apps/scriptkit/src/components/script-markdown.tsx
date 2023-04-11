import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import {Language} from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'
import CodeBlock from 'components/code-block'
import rehypeRaw from 'rehype-raw'
import {LoadedScript} from 'utils/types'

interface DiscussionPostProps {
  script: LoadedScript
}

const ScriptMarkdown = ({
  script: {author, url, command, title, content, user},
}: DiscussionPostProps) => (
  <div key={author + command} className="break-inside break-words">
    <ReactMarkdown
      className="prose"
      rehypePlugins={[rehypeRaw]}
      components={{
        p({children}: any) {
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
            <CodeBlock
              value={String(children).replace(/\n$/, '')}
              // @ts-ignore
              theme={theme}
              language={match[1] as Language}
            />
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
  </div>
)

export default ScriptMarkdown
