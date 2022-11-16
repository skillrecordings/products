import React from 'react'
import {signOut} from 'next-auth/react'
import {GetServerSideProps} from 'next'
import {LogoutIcon} from '@heroicons/react/outline'
import {isEmpty} from 'lodash'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      redirectUrl: process.env.NEXTAUTH_URL,
    },
  }
}

const Logout = ({redirectUrl}: {redirectUrl?: string}) => {
  const handleSignOut = async (redirectUrl?: string) => {
    await signOut({
      callbackUrl: redirectUrl,
    }).then((data) => data)
  }

  const SignOutButton = React.forwardRef<
    HTMLButtonElement,
    {redirectUrl?: string; className?: string; active: boolean}
  >(({className, active, redirectUrl, ...rest}, ref) => {
    return (
      <button
        ref={ref}
        {...rest}
        onClick={async () => {
          await handleSignOut(redirectUrl)
          // toast.success('Signed out successfully')
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
  })

  return (
    <SignOutButton
      redirectUrl={redirectUrl}
      active={false}
      className="font-nav mt-5 flex w-full items-center justify-center rounded-md border border-transparent bg-cyan-500 px-5 py-4 text-lg font-semibold text-black transition focus:outline-none focus:ring-2 focus:ring-cyan-200 hover:bg-cyan-400"
    />
  )
}

export default Logout
