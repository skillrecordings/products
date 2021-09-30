import * as React from 'react'
import {Children, ReactNode, ReactElement} from 'react'
import {paramsFromMetastring} from 'utils/code'
import useClipboard from 'react-use-clipboard'
import SimpleBar from 'simplebar-react'
import Tippy from '@tippyjs/react'

type CodeBlockProps = {
  language: string
  metastring: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  language,
  metastring,
  children,
}) => {
  const {numbered, linesHighlighted, labeled, filePath} =
    paramsFromMetastring(metastring)

  // extract code from nodes ?
  let code = ''

  // create arrays of arrays wit only spans inside
  const linesArr: ReactNode[][] = [[]]

  Children.forEach(children, (child) => {
    const index = linesArr.length - 1

    if (typeof child === 'string') {
      if (language === '') {
        linesArr.push([child])
      } else {
        linesArr.push([])
      }
      // add to code
      code += child
    } else {
      if (linesArr[index]) {
        linesArr[index].push(child)
      }

      // add content to code
      if (child && typeof child === 'object') {
        code += (child as ReactElement).props.children
      }
    }
  })

  // transform lines into divs > [span]
  const linesNodes = []
  for (let i = 0; i < linesArr.length; i++) {
    const lineIndex = i + 1
    const childs = numbered
      ? [
          <Number key={`line-number-${lineIndex}`}>{lineIndex}</Number>,
          linesArr[i],
        ]
      : linesArr[i]

    linesNodes.push(
      <Line
        key={`line-${lineIndex}`}
        highlight={linesHighlighted.indexOf(lineIndex) > -1}
      >
        {childs}
      </Line>,
    )
  }

  return (
    <div className="sm:text-base text-sm relative bg-black bg-opacity-40 -mx-5 sm:rounded-md rounded-none overflow-hidden mb-8">
      {labeled && (
        <div className="flex w-full justify-between items-center px-1 py-1">
          <div className="text-brand-text text-sm font-bold select-none pointer-events-none pl-3">
            {language.replace('language-', '')}
            <span className="ml-2 font-light">{filePath}</span>
          </div>
          <CopyToClipboard code={code} />
        </div>
      )}
      <div
        className={`${labeled ? 'border-t border-white border-opacity-5' : ''}`}
      >
        <pre>
          <code>
            {/* <SimpleBar autoHide={false} style={{padding: 20}}> */}
            {linesNodes}
            {/* </SimpleBar> */}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default CodeBlock

const Line: React.FC<{highlight?: boolean}> = ({highlight, children}) => (
  <div className={highlight ? 'bg-white bg-opacity-5' : ''}>{children}</div>
)

const Number: React.FC = ({children}) => (
  <span className="line-number opacity-20 text-xs w-7 inline-block select-none pointer-events-none">
    {children}
  </span>
)

const CopyToClipboard: React.FC<{code: string}> = ({code}) => {
  const [isCopied, setCopied] = useClipboard(code, {successDuration: 1000})

  return (
    <Tippy
      animation={false}
      hideOnClick={false}
      content={
        <span className="text-sm bg-black bg-opacity-50 px-3 py-1 rounded-md">
          {isCopied ? 'Copied' : 'Copy code to clipboard'}
        </span>
      }
    >
      <button
        onClick={() => {
          setCopied()
        }}
        type="button"
        aria-label="Copy code to clipboard"
        className="hover:bg-opacity-5 bg-white bg-opacity-0 p-2 text-gray-400 hover:text-white transition-all duration-100 ease-in-out focus:ring-1 focus:ring-white focus:ring-opacity-30 focus:outline-none rounded-md"
      >
        {isCopied ? (
          //   prettier-ignore
          <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
        ) : (
          // prettier-ignore
          <svg aria-hidden xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></g></svg>
        )}
      </button>
    </Tippy>
  )
}
