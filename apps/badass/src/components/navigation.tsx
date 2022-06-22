import * as React from 'react'
import {ChevronDownIcon, MenuIcon} from '@heroicons/react/solid'
import {LogoutIcon} from '@heroicons/react/outline'
import {Menu, Transition} from '@headlessui/react'
import {NextRouter, useRouter} from 'next/router'
import isEmpty from 'lodash/isEmpty'
import toast from 'react-hot-toast'
import Link from 'next/link'
import cx from 'classnames'
import Image from 'next/image'
import SkullLogo from '../../public/assets/skull@2x.png'

const Navigation = () => {
  return (
    <nav
      aria-label="top"
      className="w-full left-0 top-0 px-2 pt-2 print:hidden"
    >
      <div className="flex items-center w-full h-full py-[2px] max-w-screen-lg mx-auto justify-between">
        <Link href="/" passHref>
          <a className="inline-flex items-center">
            <div className="flex items-center justify-center sm:w-auto w-16">
              <Image
                src={SkullLogo}
                alt="Badass Skull Logo"
                width={80}
                height={80}
              />
            </div>
            <div className="font-heading text-2xl">
              Badass
              <span className="pl-0.5 text-base font-condensed text-badass-yellow-500">
                .dev
              </span>
            </div>
          </a>
        </Link>
        <DesktopNav />
        <MobileNav />
      </div>
    </nav>
  )
}

const DesktopNav: React.FC = () => {
  return (
    <div className={cx('sm:flex hidden w-full pl-10 gap-2 h-full justify-end')}>
      <NavSlots>
        <NavLink href="/podcast/course-builders">Podcast</NavLink>
        <NavLink href="/articles">Articles</NavLink>
      </NavSlots>
    </div>
  )
}

const MobileNav: React.FC = () => {
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

const NavSlots: React.FC = ({children}) => {
  return <div className="flex items-center">{children}</div>
}

const NavLink: React.FC<{href: string}> = ({href, children, ...props}) => {
  const router = useRouter()
  const isActive = href.endsWith(router.pathname)

  return (
    <Link href={href} passHref>
      <a
        aria-current={isActive ? 'page' : undefined}
        className={cx(
          'relative px-5 h-full flex items-center justify-center hover:bg-gray-100 hover:bg-opacity-50 group transition outline-none hover:opacity-100 opacity-90 text-sm',
          {
            'after:content-[""] after:absolute after:w-full after:h-[2px] after:bottom-[-2px] after:left-0 after:bg-[#082C1B]':
              isActive,
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
