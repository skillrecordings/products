import {useRouter} from 'next/router'
import Link from 'next/link'
import {track} from 'utils/analytics'
import ColorModeToggle from 'components/color-mode-toggle'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'

type NavigationProps = {
  className?: string
}

const Navigation: React.FC<NavigationProps> = ({className}) => {
  const {pathname, asPath} = useRouter()
  const isRoot = pathname === '/'

  const tipsAllowed = process.env.NEXT_PUBLIC_TIPS_ALLOWED === 'true'

  return (
    <div className="flex items-center justify-center px-5">
      <nav
        aria-label="top"
        className={twMerge(
          'z-10 mx-auto flex w-full max-w-screen-lg items-center justify-between border-b border-gray-100 py-2.5 text-sm dark:border-gray-800/60',
          className,
        )}
      >
        <Link
          href="/"
          aria-current={isRoot}
          tabIndex={isRoot ? -1 : 0}
          passHref
          className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-white dark:to-gray-400"
        >
          EpicWeb.Dev
        </Link>
        <div className="flex items-center justify-center gap-2 font-medium">
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
          <div className="flex items-center justify-center pl-3">
            <ColorModeToggle />
          </div>
        </div>
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
