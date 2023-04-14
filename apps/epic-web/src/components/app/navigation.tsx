import React from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {track} from 'utils/analytics'
import ColorModeToggle from 'components/color-mode-toggle'
import {twMerge} from 'tailwind-merge'

type NavigationProps = {
  className?: string
}

const Navigation: React.FC<NavigationProps> = ({className}) => {
  const {pathname, asPath} = useRouter()
  const isRoot = pathname === '/'

  const tipsAllowed = process.env.NEXT_PUBLIC_TIPS_ALLOWED === 'true'
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <div className="relative z-20 flex items-center justify-center">
      <nav
        aria-label="top"
        className={twMerge(
          'z-10 mx-auto flex w-full max-w-screen-lg items-center justify-between border-b border-gray-200/80 px-3 py-2.5 pr-3 text-sm dark:border-gray-800/60 sm:pl-4 sm:pr-2',
          className,
        )}
      >
        <Link
          href="/"
          aria-current={isRoot}
          tabIndex={isRoot ? -1 : 0}
          passHref
          className="relative z-10 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-white dark:to-gray-400"
        >
          EpicWeb.Dev
        </Link>
        <div className="hidden items-center justify-center gap-2 font-medium sm:flex">
          <Link
            href="/articles"
            className="flex items-center gap-1 rounded-md px-2.5 py-1 transition hover:bg-indigo-300/10 dark:hover:bg-white/5"
            passHref
            onClick={() => {
              track('clicked Articles from navigation', {
                page: asPath,
              })
            }}
          >
            <ArticlesIcon /> Articles
          </Link>
          <Link
            href="/tutorials"
            className="flex items-center gap-1 rounded-md px-2.5 py-1 transition hover:bg-indigo-300/10 dark:hover:bg-white/5"
            passHref
            onClick={() => {
              track('clicked Free Tutorials from navigation', {
                page: asPath,
              })
            }}
          >
            <TutorialsIcon /> Free Tutorials
          </Link>
          {tipsAllowed && (
            <Link
              href="/tips"
              className="flex items-center gap-1 rounded-md px-2.5 py-1 transition hover:bg-indigo-300/10 dark:hover:bg-white/5"
              passHref
              onClick={() => {
                track('clicked Tips from navigation', {
                  page: asPath,
                })
              }}
            >
              <TipsIcon /> Tips
            </Link>
          )}
          <div className="flex items-center justify-center pl-1">
            <ColorModeToggle />
          </div>
        </div>
        <button
          className="relative z-10 flex p-1 sm:hidden"
          onClick={() => {
            setMenuOpen(!menuOpen)
          }}
        >
          {menuOpen ? <CrossIcon /> : <HamburgerMenuIcon />}
        </button>
        {menuOpen && (
          <div className="absolute left-0 top-0 flex w-full flex-col gap-3 bg-white px-5 pb-5 pt-20 text-lg font-semibold backdrop-blur-sm dark:bg-black/80">
            <Link
              href="/articles"
              className="flex items-center gap-1 rounded-md px-2.5 py-1 transition hover:bg-indigo-300/10 dark:hover:bg-white/5"
              passHref
              onClick={() => {
                track('clicked Articles from navigation', {
                  page: asPath,
                })
              }}
            >
              <ArticlesIcon /> Articles
            </Link>
            <Link
              href="/tutorials"
              className="flex items-center gap-1 rounded-md px-2.5 py-1 transition hover:bg-indigo-300/10 dark:hover:bg-white/5"
              passHref
              onClick={() => {
                track('clicked Free Tutorials from navigation', {
                  page: asPath,
                })
              }}
            >
              <TutorialsIcon /> Free Tutorials
            </Link>
            {tipsAllowed && (
              <Link
                href="/tips"
                className="flex items-center gap-1 rounded-md px-2.5 py-1 transition hover:bg-indigo-300/10 dark:hover:bg-white/5"
                passHref
                onClick={() => {
                  track('clicked Tips from navigation', {
                    page: asPath,
                  })
                }}
              >
                <TipsIcon /> Tips
              </Link>
            )}
            <div className="flex w-full pt-5">
              <ColorModeToggle />
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Navigation

const ArticlesIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 text-indigo-500 dark:text-indigo-300"
      viewBox="0 0 24 24"
    >
      <title>document-copy</title>
      <g
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
      >
        <rect x="2" y="5" width="16" height="18"></rect>{' '}
        <polyline points=" 5,1 22,1 22,21 " stroke="currentColor"></polyline>{' '}
        <line x1="6" y1="10" x2="14" y2="10"></line>{' '}
        <line x1="6" y1="14" x2="14" y2="14"></line>{' '}
        <line x1="6" y1="18" x2="10" y2="18"></line>
      </g>
    </svg>
  )
}

const TutorialsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 text-orange-500 dark:text-orange-300"
      viewBox="0 0 24 24"
    >
      <title>box-caret-right</title>
      <g
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
      >
        <polygon points="9 16 9 8 15 12 9 16" stroke="currentColor"></polygon>
        <rect x="2" y="2" width="20" height="20" rx="2"></rect>
      </g>
    </svg>
  )
}

const TipsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 text-sky-500 dark:text-sky-300"
      viewBox="0 0 24 24"
    >
      <title>pacman</title>
      <g
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeWidth="2"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
      >
        <path
          d="M12,12l9.519-5.5a11,11,0,1,0,0,10.992Z"
          strokeLinecap="butt"
        ></path>
        <circle
          cx="22"
          cy="12"
          r="2"
          stroke="none"
          fill="currentColor"
        ></circle>
        <circle
          cx="12.5"
          cy="6.5"
          r="1.5"
          fill="currentColor"
          stroke="none"
        ></circle>
      </g>
    </svg>
  )
}

const HamburgerMenuIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      scale="24"
    >
      <path
        d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

const CrossIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      scale="24"
    >
      <path
        d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}
