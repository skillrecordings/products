import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import cx from 'classnames'
import Icon from './icons'

const Navigation = () => {
  return (
    <nav
      aria-label="top"
      className="z-10 w-full bg-white py-4 shadow-xl shadow-gray-200/20 sm:py-8"
    >
      <div className="mx-auto flex max-w-screen-lg items-center justify-between px-5">
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
      <NavSlots>
        <NavLink href="/tips" icon={<Icon name="Anchor" />}>
          Tips
        </NavLink>
        <NavLink href="/articles" icon={<Icon name="Palm" />}>
          Articles
        </NavLink>
      </NavSlots>
    </div>
  )
}

const NavSlots: React.FC<React.PropsWithChildren> = ({children}) => {
  return <div className="flex items-center pb-1">{children}</div>
}

type NavLinkProps = React.PropsWithChildren<{
  href: string
  icon?: React.ReactElement
}>

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  icon = null,
  ...props
}) => {
  const router = useRouter()
  const isActive = router.pathname === href

  return (
    <Link href={href} passHref>
      <a
        aria-current={isActive ? 'page' : undefined}
        className={cx(
          'jusfify-center flex items-center gap-1 rounded-full px-4 py-2 transition hover:bg-gray-100',
          {
            'bg-gray-50': isActive,
          },
        )}
        {...props}
      >
        <>
          {icon} {children}
        </>
      </a>
    </Link>
  )
}

const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" aria-label="Pro Tailwind Home" passHref>
      <a
        tabIndex={router.pathname === '/' ? -1 : 0}
        className="font-heading text-xl font-black sm:text-2xl"
      >
        <span className="text-brand-red">Pro</span>Tailwind
      </a>
    </Link>
  )
}
