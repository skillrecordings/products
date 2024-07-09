import React from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import {
  Highlight,
  themes,
  Language,
  PrismTheme,
  LineInputProps,
  TokenInputProps,
} from 'prism-react-renderer'

type ExtendedLanguage = Language | 'bash'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({children, className}) => {
  const language = className
    ? (className.replace(/language-/, '') as ExtendedLanguage)
    : 'tsx'

  const code = React.isValidElement(children)
    ? children?.props?.children
    : children

  if (typeof code !== 'string') {
    return null
  }

  return (
    <Highlight
      theme={themes.nightOwl as PrismTheme}
      code={code.trim()}
      language={language}
      prism={Prism as any}
    >
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre
          className={className}
          style={{
            ...style,
            padding: '20px',
            fontSize: '80%',
            borderRadius: 5,
            marginBottom: '1.25rem',
            overflowX: 'auto',
            background: '#142035',
            border: '1px solid #2F3D56',
          }}
        >
          {tokens.map((line, i) => {
            const {key: _, ...lineProps} = getLineProps({
              line,
              key: i,
            } as LineInputProps)
            return (
              <div key={i} {...lineProps}>
                {line.map((token, key) => {
                  const {key: __, ...tokenProps} = getTokenProps({
                    token,
                    key,
                  } as TokenInputProps)
                  return <span key={key} {...tokenProps} />
                })}
              </div>
            )
          })}
        </pre>
      )}
    </Highlight>
  )
}

export default CodeBlock
