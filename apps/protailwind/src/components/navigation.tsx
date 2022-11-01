import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import cx from 'classnames'

const Navigation = () => {
  return (
    <nav
      aria-label="top"
      className="py-8 absolute left-0 top-0 w-full z-10 bg-white shadow-xl shadow-gray-200/20"
    >
      <div className="mx-auto px-5 max-w-screen-lg flex justify-between items-center">
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
        <NavLink href="/articles" icon={<PalmIcon />}>
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
          'flex items-center jusfify-center gap-1 px-4 py-2 rounded-full hover:bg-gray-50 transition',
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
        className="font-heading font-black text-2xl"
      >
        <span className="text-brand-red">Pro</span>Tailwind
      </a>
    </Link>
  )
}

const PalmIcon = () => {
  return (
    <svg
      aria-hidden="true"
      className="text-emerald-500"
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="19"
      fill="none"
      viewBox="0 0 17 19"
    >
      <path
        fill="currentColor"
        d="M14.04 5.056a6.291 6.291 0 0 0-2.479-.98l3.778-1.678a.833.833 0 0 0 .124-1.455A6.02 6.02 0 0 0 10.686.2a5.906 5.906 0 0 0-3.305 3.03 4.61 4.61 0 0 0-2.63-1.748A5.822 5.822 0 0 0 .312 2.655a.833.833 0 0 0 .318 1.46l3.555.888a7.526 7.526 0 0 0-2.722 2.386 5.633 5.633 0 0 0-.571 5.391.834.834 0 0 0 1.432.204L7.967 5.73l7.404 4.936a.833.833 0 0 0 1.29-.797 6.48 6.48 0 0 0-2.622-4.813Z"
      />
      <path
        fill="currentColor"
        d="M9.995 12.424a18.375 18.375 0 0 1-.982 5.882H7.25a16.727 16.727 0 0 0 1.08-5.886c0-1.299-.154-2.593-.457-3.856l.46-.591 1.304.874c.237 1.177.356 2.375.358 3.577Z"
      />
    </svg>
  )
}
