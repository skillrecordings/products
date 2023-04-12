import classNames from 'classnames'
import React from 'react'
import createInstallLink from 'utils/createInstallLink'

const InstallScriptButton: React.FC<
  React.PropsWithChildren<{
    name: string
    url: string
    className?: string
    expanded?: boolean
  }>
> = ({name, url, className = '', expanded = false}) => {
  if (!Boolean(url)) return <p />
  return (
    <div className={className}>
      <div className="relative group">
        <a
          className={`translate-y-[-1px] ${classNames({
            'hover:translate-y-[-3px] rounded-xl': expanded,
            'rounded-full': !expanded,
          })} relative z-10 flex items-center group hover:bg-yellow-200 transition-all ease-in-out duration-200 p-1 text-yellow-900 bg-gradient-to-t from-yellow-400 to-yellow-300`}
          href={createInstallLink(name, url)}
        >
          <span
            className={`${classNames({
              block: expanded,
              hidden: !expanded,
            })} group-hover:block pl-2 text-xs font-semibold font-mono`}
          >
            Install
          </span>
          <span className="sr-only">Add to Kit.app</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
            className="p-1"
          >
            <path
              fill="currentColor"
              d="M4 3.323A1.25 1.25 0 015.939 2.28l10.32 6.813a1.25 1.25 0 010 2.086L5.94 17.992A1.25 1.25 0 014 16.949V3.323z"
            />
          </svg>
        </a>
        <div
          aria-hidden
          className={`rounded-full bottom-0 z-0 absolute w-full h-full translate-y-[2px] bg-yellow-600`}
        />
      </div>
    </div>
  )
}

export default InstallScriptButton
