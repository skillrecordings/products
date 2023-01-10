import React from 'react'
import Link from 'next/link'
import {NextRouter, useRouter} from 'next/router'
import cx from 'classnames'
import Icon from './icons'
import {track} from 'utils/analytics'
import {signOut, useSession} from 'next-auth/react'
import toast from 'react-hot-toast'

type NavigationProps = {
  className?: string
}

const Navigation: React.FC<NavigationProps> = ({className}) => {
  return (
    <nav
      aria-label="top"
      className="z-10 w-full bg-white py-3 shadow-xl shadow-gray-200/20 sm:py-4"
    >
      <div
        className={cx(className, {
          'mx-auto flex max-w-screen-lg flex-col items-center justify-between gap-2 px-5 sm:flex-row sm:gap-0':
            !className,
        })}
      >
        <NavLogo />
        <DesktopNav />
      </div>
    </nav>
  )
}

export default Navigation

const DesktopNav = () => {
  const router = useRouter()
  const {status} = useSession()
  return (
    <div className="flex items-center space-x-5">
      <NavSlots>
        <NavLink
          href="/tutorials"
          icon={<Icon name="Video" className="text-brand-red" />}
        >
          Tutorials
        </NavLink>
        <NavLink href="/tips" icon={<Icon name="Anchor" />}>
          Tips
        </NavLink>
        <NavLink href="/articles" icon={<Icon name="Palm" />}>
          Articles
        </NavLink>
        {status === 'authenticated' && (
          <button
            onClick={async () => {
              await handleLogOut(router)
              toast.success('Logged out successfully')
            }}
            className="flex w-full rounded px-3 py-2 transition hover:underline"
          >
            Log out
          </button>
        )}
      </NavSlots>
    </div>
  )
}

const NavSlots: React.FC<React.PropsWithChildren> = ({children}) => {
  return <div className="flex items-center sm:pb-1">{children}</div>
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
        onClick={() => {
          track(`clicked ${children} in primary navigation`)
        }}
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

export const handleLogOut = async (router: NextRouter) => {
  const data = await signOut({
    redirect: false,
    callbackUrl: '/',
  }).then((data) => data)
  window.location.href = data.url
}
