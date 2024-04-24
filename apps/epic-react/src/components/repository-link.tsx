import React from 'react'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'
import useClipboard from 'react-use-clipboard'

const RepositoryLink = ({codeUrl}: {codeUrl: string}) => {
  const [isCopied, setIsCopied] = React.useState(false)
  const [state, copyToClipboard] = useClipboard(`${codeUrl}.git`)
  if (!codeUrl) {
    return null
  }

  return (
    <div className="flex">
      <Link
        href={codeUrl}
        target="_blank"
        aria-label={codeUrl}
        className="flex w-auto items-center justify-start overflow-hidden rounded-l-md border border-er-gray-200 bg-transparent p-3 font-mono text-xs leading-none text-text transition-all duration-200 ease-in-out hover:bg-er-gray-100 hover:bg-opacity-25"
      >
        {/* prettier-ignore */}
        <span className="whitespace-no-wrap flex items-center">
            <svg className="mr-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="currentColor"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z" /></g></svg>
              {codeUrl.replace(
                'https://github.com/',
                '',
              )}
            </span>
      </Link>
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={(e) => {
                e.preventDefault()
                copyToClipboard()
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 1000)
              }}
              aria-label="Copy to clipboard"
              className="-ml-px flex items-center justify-center rounded-r-md border border-er-gray-200 bg-transparent p-3 leading-none text-er-gray-600 transition-colors duration-200 ease-in-out hover:bg-er-gray-100 hover:bg-opacity-25 hover:text-text"
              type="button"
            >
              {isCopied ? (
                // prettier-ignore
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
              ) : (
                // prettier-ignore
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0l3-3m-3 3l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
              )}
            </button>
          </TooltipTrigger>
          {isCopied ? (
            <TooltipContent>
              <p>{'Copied!'}</p>
            </TooltipContent>
          ) : (
            <TooltipContent>
              <p>{'Copy clone URL'}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default RepositoryLink
