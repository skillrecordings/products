import * as React from 'react'
import {Menu, Transition} from '@headlessui/react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import cx from 'classnames'
import Image from 'next/legacy/image'
import SkullLogo from '../../public/assets/skull@2x.png'
import Icon, {IconNames} from 'components/icons'

const Navigation = () => {
  return (
    <nav
      aria-label="top"
      className="w-full left-0 top-0 sm:px-5 px-1 sm:py-5 py-2 print:hidden"
    >
      <div className="flex items-center w-full h-full max-w-screen-xl mx-auto justify-between">
        <NavLogo />
        <DesktopNav />
        <MobileNav />
      </div>
    </nav>
  )
}
const NavLogo = () => {
  const router = useRouter()
  return (
    <Link
      href="/"
      aria-label="Badass Dev Home"
      passHref
      className="inline-flex items-center w-[176px] sm:w-[194px]"
      tabIndex={router.pathname === '/' ? -1 : 0}
    >
      <Image
        src="/assets/logo-skull@2x.png"
        alt="Badass Skull Logo"
        width={194}
        height={70}
      />
    </Link>
  )
}

const DesktopNav: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <div className={cx('w-full pl-5 gap-2 h-full justify-end hidden sm:flex')}>
      <NavSlots>
        <NavLink
          href="/partners"
          iconName="case-studies"
          iconColorClass="text-badass-red-500"
          iconColorHoverClass="group-hover:text-badass-red-500"
        >
          Case Studies
        </NavLink>
        <NavLink
          href="/podcast/course-builders"
          iconName="podcast"
          iconColorClass="text-badass-yellow-500"
          iconColorHoverClass="group-hover:text-badass-yellow-500"
        >
          Podcast
        </NavLink>
        <NavLink
          href="/articles"
          iconName="articles"
          iconColorClass="text-badass-pink-500"
          iconColorHoverClass="group-hover:text-badass-pink-500"
        >
          Articles
        </NavLink>
      </NavSlots>
    </div>
  )
}

const MobileNav: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <Menu as="div" className="sm:hidden inline-block text-left z-20">
      {({open}) => (
        <>
          <Menu.Button className="flex items-center justify-center p-2 outline-none rounded-md">
            <span className="sr-only">
              {open ? 'Close' : 'Open'} Site Navigation
            </span>
            <Icon
              aria-hidden="true"
              name={open ? 'close' : 'menu'}
              className="w-6 h-6 shrink-0 text-white"
            />
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
            <Menu.Items className="absolute right-0 w-full bg-black ring-1 ring-black ring-opacity-5 focus:outline-none left-0 border-b border-badass-gray-300/50">
              <div className="px-6 py-12 space-y-12 bg-black">
                <Menu.Item>
                  {(props) => (
                    <MenuLink href="/partners" {...props}>
                      <Icon
                        aria-hidden="true"
                        name="case-studies"
                        className="w-8 h-8 shrink-0 text-badass-red-500 mr-1.5"
                      />
                      Case Studies
                    </MenuLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {(props) => (
                    <MenuLink href="/podcast/course-builders" {...props}>
                      <Icon
                        aria-hidden="true"
                        name="podcast"
                        className="w-8 h-8 shrink-0 text-badass-yellow-500 mr-1.5"
                      />
                      Podcast
                    </MenuLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {(props) => (
                    <MenuLink href="/articles" {...props}>
                      <Icon
                        aria-hidden="true"
                        name="articles"
                        className="w-8 h-8 shrink-0 text-badass-pink-500 mr-1.5"
                      />
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

const NavLink: React.FC<
  React.PropsWithChildren<{
    href: string
    iconName: IconNames
    iconColorClass: string
    iconColorHoverClass: string
  }>
> = ({
  href,
  iconName,
  iconColorClass,
  iconColorHoverClass,
  children,
  ...props
}) => {
  const router = useRouter()
  const isActive = router.asPath.includes(href)

  return (
    <Link
      href={href}
      passHref
      aria-current={isActive ? 'page' : undefined}
      className={cx(
        'relative h-full font-heading flex items-center justify-center group transition outline-none group',
        isActive
          ? 'text-white'
          : 'text-badass-gray-300 hover:opacity-100 opacity-90',
      )}
      {...props}
    >
      <Icon
        aria-hidden="true"
        name={iconName}
        className={cx(
          `w-5 h-5 shrink-0 mr-1.5 duration-150`,
          isActive ? iconColorClass : iconColorHoverClass,
        )}
      />
      {children}
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
      <Link
        href={href}
        passHref
        ref={ref}
        className={cx(
          'font-heading flex items-center space-x-2 text-2xl',
          active ? 'text-white' : 'text-badass-gray',
        )}
        {...rest}
      >
        {children}
      </Link>
    )
  },
)

export default Navigation
