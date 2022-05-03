import * as React from 'react'
import {ChevronDownIcon, MenuIcon} from '@heroicons/react/solid'
import {isSellingLive} from 'utils/is-selling-live'
import {useSession, signOut} from 'next-auth/react'
import {Menu, Transition} from '@headlessui/react'
import {Logo} from 'components/images'
import {useRouter} from 'next/router'
import isEmpty from 'lodash/isEmpty'
import toast from 'react-hot-toast'
import Link from 'next/link'
import cx from 'classnames'

const Navigation = () => {
  const {data: sessionData, status: sessionStatus} = useSession()
  const isSignedIn = Boolean(sessionData?.user)
  const isLoadingUser = sessionStatus === 'loading'
  return (
    <nav className="sm:h-14 h-12 sm:px-3 px-2 sm:py-2.5 py-2 flex items-center justify-between w-full text-white bg-black print:hidden">
      <NavLogo />
      <DesktopNav isSignedIn={isSignedIn} isLoadingUser={isLoadingUser} />
      <MobileNav isSignedIn={isSignedIn} isLoadingUser={isLoadingUser} />
    </nav>
  )
}

type NavProps = {
  isSignedIn: boolean
  isLoadingUser: boolean
}

const DesktopNav: React.FC<NavProps> = ({isLoadingUser, isSignedIn}) => {
  return (
    <div
      className={cx('sm:flex hidden w-full sm:pl-8 pl-5 gap-2', {
        'justify-between': isSellingLive,
        'justify-end': !isSellingLive,
      })}
    >
      <NavSlots>
        <NavLink href={isSignedIn ? '/learn' : '/workshops'}>Workshops</NavLink>
        <NavLink href="/articles">Articles</NavLink>
      </NavSlots>
      {!isLoadingUser && isSellingLive && (
        <NavSlots>
          {isSignedIn ? <AccountMenu /> : <RestorePurchasesLink />}
        </NavSlots>
      )}
    </div>
  )
}

const MobileNav: React.FC<NavProps> = ({isLoadingUser, isSignedIn}) => {
  return (
    <Menu as="div" className="sm:hidden relative inline-block text-left z-10">
      {({open}) => (
        <>
          <Menu.Button className="flex items-center justify-center p-2 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
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
                  <div className="text-blue-600 text-xs px-2 py-2 uppercase tracking-wide font-medium">
                    Account
                  </div>
                  {isSignedIn ? (
                    <>
                      <Menu.Item>
                        {(props) => (
                          <MenuLink href="/invoices" {...props}>
                            Invoices
                          </MenuLink>
                        )}
                      </Menu.Item>
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
  return <div className="gap-1 flex items-center">{children}</div>
}

const NavLink: React.FC<{href: string}> = ({href, children, ...props}) => {
  const router = useRouter()
  const isActive = router.pathname === href

  return (
    <Link href={href} passHref>
      <a
        aria-current={isActive ? 'page' : undefined}
        className={cx(
          'sm:px-3 px-2 py-2 rounded-md hover:bg-white bg-opacity-5 group sm:text-base text-sm inline-block transition-all duration-200 ease-in-out outline-none hover:opacity-100 opacity-90 hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          {
            underline: isActive,
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
  [rest: string]: any
}

const MenuLink: React.FC<MenuLinkProps> = ({href, children, ...rest}) => {
  return (
    <Link href={href}>
      <a
        className={`${
          rest.active ? 'bg-blue-500 text-white' : 'text-gray-900'
        } group flex w-full items-center rounded-md px-2 py-2 text-base`}
        {...rest}
      >
        {children}
      </a>
    </Link>
  )
}

const SignOutButton: React.FC<{
  className?: string
  active?: boolean
  [rest: string]: any
}> = ({className, active, ...restProps}) => {
  const router = useRouter()
  const handleSignOut = async () => {
    const data = await signOut({
      redirect: false,
      callbackUrl: '/',
    }).then((data) => {
      toast.success('Signed out successfully')
      return data
    })
    await router.push(data.url)
  }
  return (
    <button
      onClick={handleSignOut}
      className={
        !isEmpty(className)
          ? className
          : `${
              active ? 'bg-blue-500 text-white' : 'text-gray-900'
            } group flex w-full items-center rounded-md px-2 py-2 text-base`
      }
      {...restProps}
    >
      Sign Out
    </button>
  )
}

const AccountMenu: React.FC = () => {
  return (
    <Menu as="div" className="relative inline-block text-left z-10">
      <Menu.Button className="flex items-center px-3 py-2 hover:bg-white hover:bg-opacity-5 rounded-md focus:outline-none outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
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
        <Menu.Items className="absolute right-0 mt-1 w-24 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {(props) => (
                <MenuLink href="/invoices" passHref {...props}>
                  Invoices
                </MenuLink>
              )}
            </Menu.Item>
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

const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" aria-label="Home" passHref>
      <a
        className="flex-shrink-0 flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        tabIndex={router.pathname === '/' ? -1 : 0}
      >
        <div className="pr-1 sm:pr-2 sm:w-8 w-6">
          <Logo />
        </div>
        <div className="flex flex-col leading-tight ">
          <div className="font-semibold lg:text-lg sm:text-base text-sm leading-tighter">
            <span className="sr-only">Home page of&nbsp;</span>
            <span className="sm:inline-block block">Testing</span>
            Accessibility <span className="sr-only">&nbsp;.com</span>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default Navigation
