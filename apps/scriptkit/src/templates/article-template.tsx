import React from 'react'
import theme from 'prism-react-renderer/themes/nightOwl'
import CodeBlock from 'components/code-block'
import ReactMarkdown from 'react-markdown'
import GitHubIcon from 'images/github.svg'
import remarkGfm from 'remark-gfm'
import Meta from 'components/meta'
import Layout from 'layouts'
import {Language} from 'prism-react-renderer'
import {LoadedScript} from 'utils/types'

const ArticleTemplate: React.FC<{discussion: LoadedScript}> = ({
  discussion,
}) => {
  const {title, content, discussion: onGitHub} = discussion
  const [hasMounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <Layout
      style={{
        backgroundImage: `url("/assets/gradient-bg-2.svg")`,
        backgroundRepeat: 'repeat-x',
      }}
      meta={{title, author: 'John Lindquist'}}
    >
      <header className="py-16 max-w-screen-md w-full mx-auto text-center relative z-10">
        <h1 className="font-semibold tracking-tight sm:text-5xl text-4xl">
          {title}
        </h1>
      </header>
      <main className="max-w-screen-lg mx-auto flex-grow w-full pt-8 relative z-10">
        {hasMounted && (
          <ReactMarkdown
            className="prose sm:prose-lg mx-auto"
            components={{
              h1: (props) => {
                return <h2>{props.children}</h2>
              },
              h2: (props) => {
                return <h3>{props.children}</h3>
              },
              h3: (props) => {
                return <h4>{props.children}</h4>
              },
              code: ({node, inline, className, children, ...props}: any) => {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <CodeBlock
                    value={String(children).replace(/\n$/, '')}
                    language={match[1] as Language}
                    // @ts-ignore
                    theme={theme}
                  />
                ) : (
                  <code className="inline-code" {...props}>
                    {children}
                  </code>
                )
              },
              a: (props) => {
                const c = String(props.children)

                if (c.startsWith('http') && c.endsWith('.mp4')) {
                  return (
                    <video controls className="w-full">
                      <source src={c} type="video/mp4" />
                    </video>
                  )
                } else {
                  return <a {...props}>{props.children}</a>
                }
              },
            }}
            remarkPlugins={[remarkGfm]}
          >
            {content}
          </ReactMarkdown>
        )}
      </main>
      <section className="text-center pt-16">
        <a
          className="px-3 py-2 rounded bg-gray-900 hover:underline inline-flex items-center gap-2"
          href={onGitHub}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon /> Discuss on GitHub
        </a>
      </section>
    </Layout>
  )
}

export default ArticleTemplate
