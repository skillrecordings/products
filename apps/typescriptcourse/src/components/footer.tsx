import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import cx from 'classnames'
import Bio from './bio'
import Icon from '../../public/android-chrome-192x192.png'
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
    title: 'Navigate a TypeScript Codebase',
  },
]

const Footer = () => {
  const router = useRouter()
  const isRoot = router.pathname === '/new-index'
  return (
    <footer className="w-full flex flex-col bg-black/30 items-center justify-center pb-40 pt-16">
      <div className="flex md:flex-row flex-col max-w-screen-lg w-full md:justify-between justify-center md:items-start items-center lg:px-0 md:px-10 px-5">
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
        <div className="md:pt-0 pt-16">
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
        <span className="font-mono font-semibold pr-2 opacity-80 text-sm">
          0{index + 1}
        </span>
        <strong className="underline decoration-white/30 underline-offset-2">
          {children}
        </strong>
      </a>
    </Link>
  )
}

export default Footer
