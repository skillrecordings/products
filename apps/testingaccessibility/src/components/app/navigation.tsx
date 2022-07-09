import * as React from 'react'
import {ChevronDownIcon, MenuIcon} from '@heroicons/react/solid'
import {LogoutIcon} from '@heroicons/react/outline'
import {isSellingLive} from 'utils/is-selling-live'
import {signOut} from 'next-auth/react'
import {Menu, Transition} from '@headlessui/react'
import {NextRouter, useRouter} from 'next/router'
import isEmpty from 'lodash/isEmpty'
import toast from 'react-hot-toast'
import Link from 'next/link'
import cx from 'classnames'
import Image from 'next/image'
import {useNavState} from '../../hooks/use-nav-state'

const Navigation = () => {
  return (
    <nav
      aria-label="top"
      className="font-nav text-sm font-medium sticky top-0 z-30 sm:h-16 h-14 xl:px-0 px-2 flex items-center w-full bg-white shadow-sm print:hidden"
    >
      <div className="flex items-center w-full h-full py-[2px] max-w-screen-lg mx-auto justify-between">
        <NavLogo />
        <DesktopNav />
        <MobileNav />
      </div>
    </nav>
  )
}

const DesktopNav: React.FC = () => {
  const {isSignedIn, isLoadingUser, canViewTeam} = useNavState()

  return (
    <div
      className={cx('sm:flex hidden w-full pl-10 gap-2 h-full', {
        'justify-between': isSellingLive || isSignedIn,
        'justify-end': !isSellingLive,
      })}
    >
      <NavSlots>
        <NavLink href={isSignedIn ? '/learn' : '/workshops'}>Workshops</NavLink>
        <NavLink href="/articles">Articles</NavLink>
      </NavSlots>
      {!isLoadingUser && (isSellingLive || isSignedIn) && (
        <NavSlots>
          {canViewTeam && <NavLink href="/team">Invite Team</NavLink>}
          {isSignedIn ? <AccountMenu /> : <RestorePurchasesLink />}
        </NavSlots>
      )}
    </div>
  )
}

const MobileNav: React.FC = () => {
  const {isSignedIn, isLoadingUser, canViewTeam, canViewInvoice} = useNavState()
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
                    <MenuLink
                      href={isSignedIn ? '/learn' : '/workshops'}
                      {...props}
                    >
                      Workshops
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
              {!isLoadingUser && isSellingLive && (
                <div className="px-1 pt-2 pb-1">
                  <div className="text-green-600 text-xs px-2 py-2 uppercase tracking-wide font-bold">
                    Account
                  </div>
                  {isSignedIn ? (
                    <>
                      {canViewInvoice && (
                        <Menu.Item>
                          {(props) => (
                            <MenuLink href="/invoices" {...props}>
                              Invoices
                            </MenuLink>
                          )}
                        </Menu.Item>
                      )}
                      {canViewTeam && (
                        <Menu.Item>
                          {(props) => (
                            <MenuLink href="/team" {...props}>
                              Invite Team
                            </MenuLink>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({active}) => <SignOutButton active={active} />}
                      </Menu.Item>
                    </>
                  ) : (
                    <Menu.Item>
                      {(props) => (
                        <MenuLink href="/login" {...props}>
                          Restore Purchases
                        </MenuLink>
                      )}
                    </Menu.Item>
                  )}
                </div>
              )}
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
  const isActive = router.pathname === href

  return (
    <Link href={href} passHref>
      <a
        aria-current={isActive ? 'page' : undefined}
        className={cx(
          'relative px-5 h-full flex items-center justify-center hover:bg-gray-100 hover:bg-opacity-50 group transition outline-none hover:opacity-100 opacity-90 text-sm',
          {
            'after:content-[""] after:absolute after:w-full after:h-[2px] after:bottom-[-2px] after:left-0 after:bg-green-500':
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

export const handleSignOut = async (router: NextRouter) => {
  const data = await signOut({
    redirect: false,
    callbackUrl: '/',
  }).then((data) => data)
  router.push(data.url)
}

const SignOutButton = React.forwardRef<HTMLButtonElement, MenuLinkProps>(
  ({className, active, ...rest}, ref) => {
    const router = useRouter()
    return (
      <button
        ref={ref}
        {...rest}
        onClick={async () => {
          await handleSignOut(router)
          toast.success('Signed out successfully')
        }}
        className={
          !isEmpty(className)
            ? className
            : `${
                active ? 'bg-gray-100' : 'text-gray-900'
              } group flex w-full items-center rounded-md px-2 py-2 font-normal`
        }
      >
        <span className="pr-2">Sign Out</span>
        <LogoutIcon className="w-4" aria-hidden="true" />
      </button>
    )
  },
)

const AccountMenu: React.FC = () => {
  const {canViewInvoice} = useNavState()
  return (
    <Menu as="div" className="relative inline-block text-left z-10 h-full">
      <Menu.Button className="flex h-full justify-center items-center px-3 py-2 hover:bg-[#F8F3ED] hover:bg-opacity-50 transition font-medium">
        Account <ChevronDownIcon className="w-3 ml-1" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 w-28 -mt-1 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {canViewInvoice && (
            <div className="px-1 py-1">
              <Menu.Item>
                {(props) => (
                  <MenuLink href="/invoices" {...props}>
                    Invoices
                  </MenuLink>
                )}
              </Menu.Item>
            </div>
          )}
          <div className="px-1 py-1">
            <Menu.Item>
              {({active}) => <SignOutButton active={active} />}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

const RestorePurchasesLink = () => {
  return <NavLink href="/login">Restore Purchases</NavLink>
}

export const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" aria-label="Testing Accessibility Home" passHref>
      <a
        className={cx(
          'h-full group text-gray-900 bg-white flex-shrink-0 flex items-center group after:content-[""] relative after:absolute after:-right-6 after:h-5 after:w-px sm:after:bg-gray-200',
          {
            'after:bg-transparent sm:after:bg-transparent': !isSellingLive,
          },
        )}
        tabIndex={router.pathname === '/' ? -1 : 0}
      >
        <div className="w-8 flex items-center justify-center">
          <Image
            src={require('../../../public/assets/logo-mark@2x.png')}
            quality={100}
            alt=""
            aria-hidden="true"
            width={64}
            height={64}
            priority
          />
        </div>
        <div className="pl-1 flex flex-col font-bold text-xs uppercase leading-none font-nav">
          <span className="block">Testing</span> <span>Accessibility</span>
        </div>
      </a>
    </Link>
  )
}

export default Navigation
