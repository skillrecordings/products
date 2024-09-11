import React from 'react'
import {Logo, useNavigationLinks} from './navigation'
import Link from 'next/link'
import {cn} from '@skillrecordings/ui/utils/cn'
import {useRouter} from 'next/router'
import {SearchIcon} from '@heroicons/react/outline'
// import {useSearchBar} from 'search-bar/use-search-bar'

const Footer = () => {
  const primaryNavLinks = useNavigationLinks()
  const footerNavLinks = [
    ...primaryNavLinks.filter(({label}) => label !== 'FAQ'),
    {
      label: 'Livestreams',
      href: '/livestreams',
    },
    {
      label: 'Newsletter',
      href: '/newsletter',
    },
    {
      label: 'React 19 Cheat Sheet',
      href: '/react-19-cheatsheet',
    },
  ]

  const contactLinks = [
    {
      label: 'Contact Us',
      href: '/contact',
    },
    {
      label: 'Email Support',
      href: `mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`,
    },
  ]

  const aboutLinks = [
    {
      label: 'FAQ',
      href: '/faq',
    },
    {
      label: 'Credits',
      href: '/credits',
    },
  ]

  const router = useRouter()
  // const {setOpen: setSearchBarOpen} = useSearchBar()

  return (
    <footer className="shadow-soft-2xl relative w-full bg-white before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-gradient-to-r before:from-transparent before:via-gray-200 before:to-transparent before:content-[''] dark:bg-black/20 dark:before:via-gray-800/75 print:hidden">
      <div className="relative mx-auto flex w-full max-w-screen-xl flex-col items-start justify-between gap-16 px-5 pb-48 pt-14 sm:flex-row sm:px-10 sm:pt-16 lg:px-5">
        <div className="relative mx-auto flex w-full flex-col items-center gap-8 text-center sm:items-start sm:gap-16 sm:text-left md:flex-row [&>div]:min-w-[140px]">
          <div>
            <strong className="font-mono text-xs uppercase tracking-wider opacity-60">
              Learn
            </strong>
            <ul className="pt-3 text-sm font-medium">
              {footerNavLinks.map(({label, href}) => (
                <li key={href}>
                  <Link
                    className={cn(
                      'relative inline-flex items-center py-1 opacity-80 transition hover:opacity-100',
                      {
                        'underline [&_span]:underline':
                          router.pathname.includes(href),
                      },
                    )}
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="font-mono text-xs uppercase tracking-wider opacity-60">
              Contact
            </strong>
            <ul className="pt-3 text-sm font-medium">
              {contactLinks.map(({label, href}) => (
                <li key={href}>
                  <Link
                    className="inline-block py-1 opacity-80 transition hover:opacity-100"
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="font-mono text-xs uppercase tracking-wider opacity-60">
              About
            </strong>
            <ul className="pt-3 text-sm font-medium">
              {aboutLinks.map(({label, href}) => (
                <li key={href}>
                  <Link
                    className={cn(
                      'inline-block py-1 opacity-80 transition hover:opacity-100',
                      {
                        'underline [&_span]:underline':
                          router.pathname.includes(href),
                      },
                    )}
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-center gap-10 sm:items-end">
          {/* <button
            className="group relative flex w-full max-w-[200px] flex-shrink-0 items-center justify-between gap-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm font-medium shadow-inner transition dark:border-white/5 dark:bg-gray-800/50 hover:dark:bg-gray-900"
            type="button"
            onClick={() => {
              setSearchBarOpen(true)
            }}
          >
            <div className="flex items-center gap-1.5">
              <SearchIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>Search</span>
            </div>
            <div className="flex items-center justify-center gap-0.5 text-xs uppercase transition group-hover:text-blue-500 dark:group-hover:text-blue-300">
              <kbd className="tracking-[0.25em]">⌘k</kbd>
            </div>
          </button> */}
        </div>
        <Link href="/" className="absolute bottom-5 right-8">
          <svg
            className="h-10 w-10 opacity-20 saturate-0 transition duration-300 ease-in-out hover:opacity-100 hover:saturate-100 sm:h-12 sm:w-12"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 133 140"
          >
            <g
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="8"
            >
              <path d="M100.109 69.173c17.025-13.337 26.625-26.064 23.035-32.283-5.086-8.809-34.715-1.225-66.177 16.94C25.505 71.994 4.123 93.86 9.21 102.67c2.741 4.747 12.61 4.733 26.051.869"></path>
              <path d="M87.724 78.505c-11.84 7.894-21.534 11.409-21.05 11.84 27.843 14.45 51.883 20.265 56.469 12.322 4.701-8.142-13.211-27.441-40.796-44.66M35.364 36.042c-13.495-3.894-23.406-3.92-26.154.84-3.618 6.267 6.157 19.14 23.426 32.589"></path>
              <path d="M80.33 27.68C76.952 13.21 71.866 4 66.177 4 56.005 4 47.76 33.45 47.76 69.78c0 36.329 8.246 65.78 18.418 65.78 5.605 0 10.626-8.941 14.004-23.048"></path>
            </g>
          </svg>
        </Link>
        <small className="absolute bottom-5 left-5 flex items-center gap-5">
          <span className="opacity-75">© EpicReact.dev</span>
          <Link
            className="opacity-75 transition hover:opacity-100"
            href="/privacy"
          >
            Terms & Conditions
          </Link>
        </small>
      </div>
    </footer>
  )
}

export default Footer
