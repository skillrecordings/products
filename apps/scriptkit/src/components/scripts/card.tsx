import * as React from 'react'
import Link from 'next/link'
import {FunctionComponent} from 'react'
import CodeBlock from 'components/code-block'
import createInstallLink from '../../utils/createInstallLink'
import {Extension, LoadedScript} from 'utils/types'
import {Language} from 'prism-react-renderer'
import ReactMarkdown from 'react-markdown'
import theme from 'prism-react-renderer/themes/nightOwl'
import InstallScriptButton from 'components/scripts/install-script-button'

type ScriptCardProps = {
  script: LoadedScript
  handleOpenScriptDetail?: (script: LoadedScript) => void
  withAuthor?: boolean
}

const ScriptCard: FunctionComponent<
  React.PropsWithChildren<ScriptCardProps>
> = ({script, withAuthor = true}) => {
  return (
    <article className="rounded-lg overflow-hidden flex flex-col max-h-[500px] min-h-[500px] bg-gray-900 bg-opacity-40">
      <header className="relative border-b border-black">
        <div>
          <Link
            href={`/${script.user}/${script.command}`}
            className="group bg-gray-900 bg-opacity-80 flex flex-col hover:bg-gray-700 hover:bg-opacity-50 transition-all ease-in-out duration-200"
          >
            <div className="flex items-start px-6 pt-6">
              <div className="flex-grow">
                <h2 className="md:text-2xl text-xl font-bold leading-tight">
                  {script.command}
                </h2>
                {withAuthor && (
                  <div className="flex space-x-2 font-xs text-sm opacity-70">
                    {script.author && <div>by {script.author}</div>}
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 pb-6 pt-2">
              {script.description && (
                <h3 className="leading-normal text-gray-100">
                  {script.description}
                </h3>
              )}
            </div>
          </Link>
        </div>
        <InstallScriptButton
          className="absolute right-5 -bottom-4 z-10"
          url={script.url}
          name={script.command}
        />
      </header>
      <Link
        href={`/${script.user}/${script.command}`}
        className="block h-full hover:bg-gray-800 hover:bg-opacity-50 transition-all ease-in-out duration-200"
      >
        {script.extension === Extension.md ? (
          <ReactMarkdown
            allowedElements={['pre', 'code', 'p']}
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

                return null // <p>{children}</p>
              },
              code({node, inline, className, children, ...props}: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <CodeBlock
                    value={String(children).replace(/\n$/, '')}
                    // @ts-ignore
                    theme={theme}
                    language={match[1] as Language}
                    className="text-sm"
                  />
                ) : (
                  <code className="inline-code" {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {script.content}
          </ReactMarkdown>
        ) : (
          <CodeBlock
            className="font-mono pb-5 text-sm"
            value={script.content}
            language="javascript"
            // @ts-ignore
            theme={theme}
          />
        )}
      </Link>
    </article>
  )
}

export default ScriptCard
