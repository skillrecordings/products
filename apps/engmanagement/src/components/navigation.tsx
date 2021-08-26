import * as React from 'react'
import config from '../config'
import Link from 'next/link'
import {useViewer} from '@skillrecordings/viewer'
import {useRouter} from 'next/router'

const Navigation = () => {
  const {isAuthenticated, logout} = useViewer()
  const router = useRouter()
  return (
    <nav className="absolute top-0 left-0 px-5 w-full flex items-center justify-between print:hidden z-20">
      <Link href="/">
        <a className="ml-5 font-din pt-4 scale-90 uppercase text-white text-2xl tracking-wide leading-none hover:opacity-100 opacity-90 transition-all ease-in-out duration-300 relative">
          {/* {config.defaultTitle} */}
          <div className="w-[1px] h-[120%] bg-gray-200 opacity-80 absolute -left-3 top-[-22%]" />
          <span className="tracking-wider ">Engineering</span>
          <span className="block"> Management</span>
          <span className="normal-case font-light font-souvenir block text-orange-300 text-[0.735rem]">
            with Sarah Drasner
          </span>
        </a>
      </Link>
      {router.pathname !== '/' && (
        <Link href="/">
          <a className="mt-3 rounded-full scale-90 px-5 py-3 text-sm border border-gray-400 border-opacity-30 hover:bg-white hover:bg-opacity-5 transition-all duration-300 ease-in-out">
            I wrote a book →
          </a>
        </Link>
      )}
      {/* <div className="flex space-x-3 items-center">
        {isAuthenticated && <button onClick={logout}>log out</button>}
      </div> */}
    </nav>
  )
}

export default Navigation
