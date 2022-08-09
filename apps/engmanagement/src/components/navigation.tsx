import * as React from 'react'
import config from '../config'
import Link from 'next/link'
import {useRouter} from 'next/router'

const Navigation = () => {
  const router = useRouter()
  return (
    <nav
      aria-label="top"
      className="md:p-8 p-5 absolute top-0 left-0 w-full flex items-center justify-between print:hidden z-20"
    >
      <Link href="/" aria-label="Engineering Management Home" passHref>
        <a
          tabIndex={router.pathname === '/' ? -1 : 0}
          className="font-din scale-90 uppercase text-white text-2xl tracking-wide leading-none  transition-all ease-in-out duration-300 relative"
        >
          <span className="tracking-wider">Engineering </span>
          <span className="block"> Management </span>
          <span className="normal-case font-light font-souvenir block text-orange-300 text-[0.81rem]">
            by Sarah Drasner
          </span>
        </a>
      </Link>
      {router?.query?.slug === 'the-value-of-values' && (
        <Link href="/">
          <a className="mt-3 rounded-full scale-90 px-5 py-3 text-sm border border-gray-400 border-opacity-30 hover:bg-white hover:bg-opacity-5 transition-all duration-300 ease-in-out">
            I wrote a book{' '}
            <span role="img" aria-hidden="true">
              →
            </span>
          </a>
        </Link>
      )}
    </nav>
  )
}

export default Navigation
