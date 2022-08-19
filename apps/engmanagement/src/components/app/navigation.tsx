import * as React from 'react'
import config from '../../config'
import Link from 'next/link'
import {NextRouter, useRouter} from 'next/router'
import {useNavState} from 'hooks/use-nav-state'
import {useUser} from '@skillrecordings/react'
import cx from 'classnames'
import {signOut} from 'next-auth/react'
import toast from 'react-hot-toast'
import {isEmpty} from 'lodash'
import {LogoutIcon} from '@heroicons/react/outline'
import {isSellingLive} from 'utils/is-selling-live'

const Navigation = () => {
  const router = useRouter()
  const {isSignedIn, canViewInvoice} = useNavState()

  return (
    <nav
      aria-label="top"
      className={cx(
        'md:p-8 p-5 absolute top-0 left-0 w-full flex items-center print:hidden z-20',
        {
          'justify-end': router.pathname === '/',
          'justify-between': router.pathname !== '/',
        },
      )}
    >
      {router.pathname !== '/' && <NavLogo />}
      <div className="flex items-center gap-5">
        {isSellingLive && (
          <>
            {canViewInvoice && (
              <Link href="/invoices" passHref>
                <a>Invoices</a>
              </Link>
            )}
            {isSignedIn ? (
              <SignOutButton />
            ) : (
              <Link href="/login" passHref>
                <a>Restore purchases</a>
              </Link>
            )}
          </>
        )}
        {router?.query?.slug === 'the-value-of-values' && !isSignedIn && (
          <Link href="/" passHref>
            <a className="mt-3 rounded-full scale-90 px-5 py-3 text-sm border border-gray-400 border-opacity-30 hover:bg-white hover:bg-opacity-5 transition-all duration-300 ease-in-out">
              I wrote a book{' '}
              <span role="img" aria-hidden="true">
                →
              </span>
            </a>
          </Link>
        )}
      </div>
    </nav>
  )
}

const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" aria-label="Engineering Management Home" passHref>
      <a
        tabIndex={router.pathname === '/' ? -1 : 0}
        className="font-din scale-90 uppercase text-white text-2xl tracking-wide leading-none  transition-all ease-in-out duration-300 relative"
      >
        <span className="tracking-wider">Engineering </span>
        <span className="block"> Management </span>
        <span className="normal-case font-light font-souvenir block text-orange-300 text-[0.81rem]">
          by Sarah Drasner
        </span>
      </a>
    </Link>
  )
}

export const handleSignOut = async (router: NextRouter) => {
  const data = await signOut({
    redirect: false,
    callbackUrl: '/',
  }).then((data) => data)
  window.location.href = data.url
}

const SignOutButton = React.forwardRef<HTMLButtonElement, any>(
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
                active ? 'bg-gray-100' : 'text-white'
              } group flex w-full items-center rounded-md px-2 py-2 font-normal`
        }
      >
        <span className="pr-2">Sign Out</span>
        <LogoutIcon className="w-4" aria-hidden="true" />
      </button>
    )
  },
)

export default Navigation
