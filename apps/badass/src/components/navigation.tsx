import * as React from 'react'
import {MenuIcon} from '@heroicons/react/solid'
import {Menu, Transition} from '@headlessui/react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import cx from 'classnames'
import Image from 'next/image'
import SkullLogo from '../../public/assets/skull@2x.png'

const Navigation = () => {
  return (
    <nav
      aria-label="top"
      className="w-full left-0 top-0 sm:px-5 px-3 sm:py-5 py-2 print:hidden"
    >
      <div className="flex items-center w-full h-full max-w-screen-xl mx-auto justify-between">
        <NavLogo />
        <DesktopNav />
        {/* <MobileNav /> */}
      </div>
    </nav>
  )
}
const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" aria-label="Badass Dev Home" passHref>
      <a
        className="inline-flex items-center"
        tabIndex={router.pathname === '/' ? -1 : 0}
      >
        <div className="flex items-center justify-center sm:w-auto w-14 flex-shrink-0">
          <Image
            src={SkullLogo}
            alt="Badass Skull Logo"
            width={80}
            height={80}
          />
        </div>
        <div className="font-heading sm:text-2xl text-xl">
          Badass
          <span className="pl-0.5 text-base font-condensed text-badass-yellow-500">
            .dev
          </span>
        </div>
      </a>
    </Link>
  )
}

const DesktopNav: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <div className={cx('flex w-full pl-10 gap-2 h-full justify-end')}>
      <NavSlots>
        <NavLink href="/podcast/course-builders">
          <span
            aria-hidden="true"
            className="sm:text-4xl text-3xl text-badass-yellow-300 font-symbol mr-1.5"
          >
            z
          </span>{' '}
          Podcast
        </NavLink>
        <NavLink href="/articles">
          <span
            aria-hidden="true"
            className="sm:text-4xl text-3xl text-badass-pink-400 font-symbol mr-1.5"
          >
            h
          </span>{' '}
          Articles
        </NavLink>
      </NavSlots>
    </div>
  )
}

const MobileNav: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <Menu as="div" className="sm:hidden relative inline-block text-left z-10">
      {({open}) => (
        <>
          <Menu.Button className="flex items-center justify-center p-2 outline-none rounded-md">
            <span className="sr-only">
              {open ? 'Close' : 'Open'} Site Navigation
            </span>
            <MenuIcon aria-hidden="true" className="w-6" />
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-1 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {(props) => (
                    <MenuLink href="/podcast/course-builders" {...props}>
                      Podcast
                    </MenuLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {(props) => (
                    <MenuLink href="/articles" {...props}>
                      Articles
                    </MenuLink>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

const NavSlots: React.FC<React.PropsWithChildren<unknown>> = ({children}) => {
  return (
    <div className="flex lg:gap-10 sm:gap-8 gap-5 lg:pr-10 pr-2 items-center sm:text-lg text-sm">
      {children}
    </div>
  )
}

const NavLink: React.FC<React.PropsWithChildren<{href: string}>> = ({
  href,
  children,
  ...props
}) => {
  const router = useRouter()
  const isActive = href.endsWith(router.pathname)

  return (
    <Link href={href} passHref>
      <a
        aria-current={isActive ? 'page' : undefined}
        className={cx(
          'relative h-full font-heading flex items-center justify-center group transition outline-none hover:opacity-100 opacity-90',
          {
            'first-letter:text-pink-500': isActive,
          },
        )}
        {...props}
      >
        {children}
      </a>
    </Link>
  )
}

type MenuLinkProps = {
  href: string
  className?: string
  active?: boolean
  [rest: string]: any
}

const MenuLink = React.forwardRef<HTMLAnchorElement, MenuLinkProps>(
  ({href, children, active, ...rest}, ref) => {
    return (
      <Link href={href} passHref>
        <a
          ref={ref}
          className={`${
            active ? 'bg-gray-100' : 'text-gray-900'
          } group flex w-full items-center rounded-md px-2 py-2`}
          {...rest}
        >
          {children}
        </a>
      </Link>
    )
  },
)

export default Navigation
