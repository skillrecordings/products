import * as React from 'react'
import Link from 'next/link'
import {Logo} from 'components/images'

const Navigation = () => {
  return (
    <nav className="absolute left-0 top-0 w-full p-5 flex items-center justify-center print:hidden">
      <Link href="/">
        <a className="w-32 pt-5">
          <Logo />
        </a>
      </Link>
    </nav>
  )
}

export default Navigation
