import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import cx from 'classnames'

const Navigation = () => {
  return (
    <nav
      aria-label="top"
      className="md:p-10 p-5 absolute left-0 top-0 w-full z-10"
    >
      <div className="mx-auto flex justify-between items-center">
        <NavLogo />
        {/* <DesktopNav /> */}
      </div>
    </nav>
  )
}

export default Navigation

const DesktopNav = () => {
  return (
    <div className="flex items-center space-x-5">
      <NavSlots>
        <NavLink href="/articles">Articles</NavLink>
      </NavSlots>
    </div>
  )
}

const NavSlots: React.FC<React.PropsWithChildren> = ({children}) => {
  return <div className="flex items-center">{children}</div>
}

type NavLinkProps = React.PropsWithChildren<{
  href: string
}>

const NavLink: React.FC<NavLinkProps> = ({href, children, ...props}) => {
  const router = useRouter()
  const isActive = router.pathname === href

  return (
    <Link href={href} passHref>
      <a
        aria-current={isActive ? 'page' : undefined}
        className={cx('', {
          underline: isActive,
        })}
        {...props}
      >
        {children}
      </a>
    </Link>
  )
}

const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" aria-label="Front to Back Home" passHref>
      <a
        className="font-bold md:text-2xl text-lg"
        tabIndex={router.pathname === '/' ? -1 : 0}
      >
        FrontToBack.dev
      </a>
    </Link>
  )
}
