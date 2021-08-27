import * as React from 'react'
import Logo from 'components/icons/sr-logo'
import Link from 'next/link'

const Navigation = () => {
  return (
    <nav className="absolute left-0 top-0 p-8 w-full flex items-center justify-center">
      <Link href="/">
        <a>
          <Logo fill={true} className="text-white sm:w-32 w-28" />
        </a>
      </Link>
    </nav>
  )
}

export default Navigation
