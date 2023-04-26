import * as React from 'react'
import {FunctionComponent} from 'react'
import Highlight, {defaultProps, Language} from 'prism-react-renderer'
import SimpleBar from 'simplebar-react'
import theme from 'prism-react-renderer/themes/nightOwl'

type CodeBlockProps = {
  language: Language
  value: string
  className?: string
}

const H = Highlight as any
const S = SimpleBar as any

const CodeBlock: FunctionComponent<React.PropsWithChildren<CodeBlockProps>> = ({
  language,
  value,
  className,
}: any) => {
  return (
    <div className={className}>
      <H {...defaultProps} code={value} language={language} theme={theme}>
        {({className, tokens, getLineProps, getTokenProps}: any) => (
          <div className={`${className} h-full `}>
            <S className="h-full whitespace-pre">
              <div className="p-3">
                {tokens.map((line: any, i: any) => (
                  <div
                    {...getLineProps({line, key: i})}
                    style={{fontSize: '90%'}}
                  >
                    {line.map((token: any, key: any) => (
                      <span {...getTokenProps({token, key})} />
                    ))}
                  </div>
                ))}
              </div>
            </S>
          </div>
        )}
      </H>
    </div>
  )
}

export default CodeBlock
