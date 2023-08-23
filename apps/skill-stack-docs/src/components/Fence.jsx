import { Fragment } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'

export function Fence({ children, language }) {
  return (
    <Highlight
      {...defaultProps}
      // little replace action to make the code look nicer for Anatomy examples
      code={children.trimEnd().replace(';() => (', '\n() => (')}
      language={language}
      theme={undefined}
    >
      {({ className, style, tokens, getTokenProps }) => {
        return (
          <pre className={className} style={style}>
            <code>
              {tokens.map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                  {line
                    .filter((token) => !token.empty)
                    .map((token, tokenIndex) => (
                      <span key={tokenIndex} {...getTokenProps({ token })} />
                    ))}
                  {'\n'}
                </Fragment>
              ))}
            </code>
          </pre>
        )
      }}
    </Highlight>
  )
}
