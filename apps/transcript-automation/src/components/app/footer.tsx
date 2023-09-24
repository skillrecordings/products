import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {twMerge} from 'tailwind-merge'

type FooterProps = {
  className?: string
}

const Footer: React.FC<FooterProps> = ({className}) => {
  const {pathname, asPath} = useRouter()
  const isRoot = pathname === '/'

  return (
    <footer
      className={twMerge(
        'items-between mx-auto mt-5 flex h-full w-full max-w-screen-xl flex-col px-5 py-5',
        className,
      )}
    >
      <div className="pb-40">
        <Link
          href="/"
          aria-current={isRoot}
          tabIndex={isRoot ? -1 : 0}
          passHref
          className="text-lg font-bold"
        >
          {process.env.NEXT_PUBLIC_SITE_TITLE}
        </Link>
      </div>
      <div>
        <Link
          href="/privacy"
          passHref
          className="text-sm opacity-50 hover:opacity-100"
        >
          Terms & Conditions
        </Link>
      </div>
    </footer>
  )
}

export default Footer
