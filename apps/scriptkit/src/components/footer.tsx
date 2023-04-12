import * as React from 'react'
import JohnIcon from 'images/john.svg'
import GitHubIcon from 'images/github.svg'

const Footer = () => {
  return (
    <footer className="flex flex-row items-center justify-between w-full max-w-screen-lg pt-24 pb-10 mx-auto sm:items-end sm:pt-32">
      <a
        className="flex items-center origin-left transform scale-90 group sm:scale-100"
        href="https://johnlindquist.com"
      >
        <JohnIcon width={52} />
        <div className="pl-2">
          <div className="font-mono text-xs text-yellow-400 uppercase">
            created by
          </div>
          <div className="text-xl font-semibold group-hover:underline">
            John Lindquist
          </div>
        </div>
      </a>

      <div className="flex items-center space-x-4">
        <a
          href="https://github.com/johnlindquist/kit"
          className="flex items-center px-3 py-2 space-x-1 text-sm transition-all duration-100 ease-in-out rounded-lg hover:bg-gray-900 opacity-90 hover:opacity-100 sm:text-base"
        >
          <GitHubIcon />
          <span className="hidden pl-1 text-sm font-medium leading-snug sm:block">
            GitHub
          </span>
        </a>
      </div>
    </footer>
  )
}

export default Footer
