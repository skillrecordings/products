import * as React from 'react'
import {FunctionComponent} from 'react'
import Link from 'next/link'
import {Logo} from 'components/images'
import {useRouter} from 'next/router'

type NavigationProps = {}

const Navigation: FunctionComponent<NavigationProps> = () => {
  const router = useRouter()
  return (
    <nav className="flex items-center justify-between w-full p-3 text-white bg-black sm:p-5">
      <Link href="/" aria-label="Home" passHref>
        <a
          className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          tabIndex={router.pathname === '/' ? -1 : 0}
        >
          <div className="pr-1 sm:pr-2 w-7 sm:w-8">
            <Logo />
          </div>
          <div className="flex flex-col leading-tight ">
            <div className="font-semibold sm:text-lg">
              <span className="sr-only">Home page of&nbsp;</span>Testing
              Accessibility <span className="sr-only">&nbsp;.com</span>
            </div>
          </div>
        </a>
      </Link>
      <div className="text-right sm:pr-3">
        <Link href="/workshops" passHref>
          <a className="inline-block px-4 py-2 leading-5 transition-all duration-200 ease-in-out transform bg-white rounded-full hover:opacity-100 opacity-90 bg-opacity-5 hover:bg-opacity-10 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            Upcoming Workshops
          </a>
        </Link>
      </div>
    </nav>
  )
}

export default Navigation
