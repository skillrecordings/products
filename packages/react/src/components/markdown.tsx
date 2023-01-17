import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter, {
  SyntaxHighlighterProps,
} from 'react-syntax-highlighter'

export const Markdown: React.FC<
  React.PropsWithChildren<{children: any; syntaxHighlighterTheme: any}>
> = ({children, syntaxHighlighterTheme, ...props}) => {
  return (
    <ReactMarkdown
      components={{
        code({
          node,
          inline,
          className,
          children,
          ...props
        }: SyntaxHighlighterProps) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              style={syntaxHighlighterTheme}
              language={match[1]}
              customStyle={{
                padding: '1rem',
                fontSize: '85%',
              }}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
      }}
      {...props}
    >
      {children}
    </ReactMarkdown>
  )
}
