import * as React from 'react'
import {FunctionComponent} from 'react'
import {Children, ReactNode, ReactElement} from 'react'
import {paramsFromMetastring} from 'utils/code'
import useClipboard from 'react-use-clipboard'

type CodeBlockProps = {
  language: string
  metastring: string
}

const CodeBlock: FunctionComponent<React.PropsWithChildren<CodeBlockProps>> = ({
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
      linesArr.push([])
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
  for (let i = 0; i < linesArr.length - 1; i++) {
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
    <div>
      {/* <div className="relative px-5 py-4 mb-5 -mx-5 overflow-hidden bg-gray-800 border border-gray-700 md:rounded-md"> */}
      {labeled && (
        <>
          <div className="pt-0 pb-3 text-xs font-bold text-gray-200 pointer-events-none select-none sm:px-0 sm:pt-0">
            {language.replace('language-', '')}
            <span className="ml-2 font-normal">{filePath}</span>
          </div>
          <CopyToClipboard code={code} />
        </>
      )}
      <div>
        <pre className="px-5 py-0 text-gray-200 sm:mx-0 sm:px-0">
          <code>{linesNodes}</code>
        </pre>
      </div>
    </div>
  )
}

export default CodeBlock

const Line: FunctionComponent<
  React.PropsWithChildren<{highlight?: boolean}>
> = ({highlight, children}) => (
  <div className={highlight ? 'bg-gray-800' : ''}>{children}</div>
)

const Number: FunctionComponent<React.PropsWithChildren<unknown>> = ({
  children,
}) => (
  <span className="inline-block text-xs text-gray-500 pointer-events-none select-none line-number w-7">
    {children}
  </span>
)

const CopyToClipboard: FunctionComponent<
  React.PropsWithChildren<{code: string}>
> = ({code}) => {
  const [isCopied, setCopied] = useClipboard(code, {successDuration: 1000})
  return (
    <button
      onClick={setCopied}
      aria-label="Copy code to clipboard"
      className="absolute top-0 p-2 text-gray-200 outline-none right-3 hover:text-gray-300"
    >
      {isCopied ? (
        //   prettier-ignore
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
      ) : (
        // prettier-ignore
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></g></svg>
      )}
    </button>
  )
}
