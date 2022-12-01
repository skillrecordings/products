import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import cx from 'classnames'
import Bio from '../bio'

const Footer = () => {
  const router = useRouter()
  const isRoot = router.pathname === '/new-index'
  return <Bio />
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
