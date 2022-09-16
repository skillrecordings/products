import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'

const Navigation = () => {
  return (
    <nav aria-label="top" className="absolute top-0 left-0 z-10 w-full py-5">
      <div className="flex items-center justify-between max-w-screen-lg px-5 mx-auto">
        <NavLogo />
        <DesktopNav />
      </div>
    </nav>
  )
}

export default Navigation

const DesktopNav = () => {
  return (
    <div className="flex items-center space-x-5">
      <Link href="/articles">
        <a>Articles</a>
      </Link>
    </div>
  )
}

const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" aria-label="Escuela Frontend Home" passHref>
      <a tabIndex={router.pathname === '/' ? -1 : 0}>
        <span className="sr-only">Escuela Frontend</span>
      </a>
    </Link>
  )
}
