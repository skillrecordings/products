import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import cx from 'classnames'
import Bio from '../bio'
import Icon from '/public/android-chrome-192x192.png'
import Image from 'next/image'

const modules = [
  {
    title: 'Migrate an OSS JS Project to TypeScript',
    href: '/migrate-an-open-source-javascript-project-to-typescript',
  },
  {
    title: 'Build a TypeScript Project from Scratch',
    href: '/build-a-typescript-project-from-scratch',
  },
  {
    title: 'Navigate a TypeScript Codebase Effectively',
    href: '/navigate-a-typescript-codebase',
  },
]

const Footer = () => {
  const router = useRouter()
  const isRoot = router.pathname === '/new-index'
  return (
    <footer className="flex flex-col items-center justify-center w-full pt-16 pb-40 bg-black/30">
      <div className="flex flex-col items-center justify-center w-full max-w-screen-lg px-5 md:flex-row md:justify-between md:items-start lg:px-0 md:px-10">
        <nav aria-label="Secondary Navigation">
          {/* {!isRoot && <NavLink href="/new-index">All modules</NavLink>} */}
          <div className="flex items-center gap-3 pb-10">
            <Image
              src={Icon}
              alt="TypeScript Course"
              loading="eager"
              width={32}
              height={32}
              quality={100}
            />
            <h3 className="text-xl font-semibold">Course Modules</h3>
          </div>
          <ul className="flex flex-col gap-3">
            {modules.map((module: any, i: number) => {
              return (
                <li key={module.title}>
                  {module.href ? (
                    <NavLink href={module.href} index={i}>
                      {module.title}
                    </NavLink>
                  ) : (
                    <>
                      <span className="font-mono font-semibold pr-0.5 opacity-60 text-sm">
                        0{i + 1}
                      </span>{' '}
                      <strong className="opacity-80">
                        Navigate a TypeScript Codebase
                      </strong>{' '}
                      <sup className="font-bold text-blue-300">Coming Soon</sup>
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="pt-16 md:pt-0">
          <Bio />
        </div>
      </div>
    </footer>
  )
}

const NavLink: React.FC<{href: string; index: number}> = ({
  href,
  children,
  index,
  ...props
}) => {
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
