import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import cx from 'classnames'
import Bio from '../bio'

const Footer = () => {
  const router = useRouter()
  const isRoot = router.pathname === '/new-index'
  return (
    <footer className="flex flex-col items-center justify-center w-full pt-16 pb-40 bg-black/30">
      <div className="flex flex-col items-center justify-center w-full max-w-screen-lg px-5 md:flex-row  md:items-start lg:px-0 md:px-10">
        <div className="pt-16 md:pt-0">
          <Bio />
        </div>
      </div>
    </footer>
  )
}

const NavLink: React.FC<
  React.PropsWithChildren<{href: string; index: number}>
> = ({href, children, index, ...props}) => {
  const router = useRouter()
  const isActive = router.pathname === href

  return (
    <Link href={href} passHref>
      <a
        aria-current={isActive ? 'page' : undefined}
        className={cx('hover:opacity-100 transition', {
          'opacity-80': !isActive,
          '': isActive,
        })}
        {...props}
      >
        <span className="pr-2 font-mono text-sm font-semibold opacity-80">
          {isActive ? ' → ' : `0${index + 1}`}
        </span>
        <strong className="underline decoration-white/30 underline-offset-2">
          {children}
        </strong>
      </a>
    </Link>
  )
}

export default Footer
