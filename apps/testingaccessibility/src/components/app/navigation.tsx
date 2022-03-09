import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from 'next/link'
import {Logo} from 'components/images'
import {useRouter} from 'next/router'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import cx from 'classnames'

type NavigationProps = {}

const Navigation: FunctionComponent<NavigationProps> = () => {
  const router = useRouter()
  return (
    <nav className="sm:px-5 px-2 sm:py-2.5 py-2 flex items-center justify-between w-full text-white bg-black">
      <Link href="/" aria-label="Home" passHref>
        <a
          className="flex-shrink-0 flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          tabIndex={router.pathname === '/' ? -1 : 0}
        >
          <div className="pr-1 sm:pr-2 sm:w-8 w-6">
            <Logo />
          </div>
          <div className="flex flex-col leading-tight ">
            <div className="font-semibold lg:text-lg sm:text-base text-sm sm:w-auto w-5 leading-tighter">
              <span className="sr-only">Home page of&nbsp;</span>Testing
              Accessibility <span className="sr-only">&nbsp;.com</span>
            </div>
          </div>
        </a>
      </Link>
      <div className="flex sm:gap-2">
        <NavLink href="accessibility-reviews">Accessibility Reviews</NavLink>
        <NavLink href="workshops">Workshops</NavLink>
      </div>
    </nav>
  )
}

const NavLink: React.FC<{href: string}> = ({href, children}) => {
  const router = useRouter()

  return (
    <Link href={`/${href}`} passHref>
      <a
        className={cx(
          'rounded-full hover:bg-white bg-opacity-5 relative group sm:text-base text-sm inline-block sm:px-3 px-2 sm:py-2 py-1.5 leading-5 transition-all duration-200 ease-in-out transform hover:opacity-100 opacity-90 hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          {
            underline: router.pathname === `/${href}`,
          },
        )}
      >
        {children}
      </a>
    </Link>
  )
}

export default Navigation
