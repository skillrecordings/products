import React from 'react'
import cx from 'classnames'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {signOut, useSession} from 'next-auth/react'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {BookIcon, KeyIcon} from '@/components/app/navigation'
import {
  ChevronDownIcon,
  FireIcon,
  MenuIcon,
  PlayIcon,
} from '@heroicons/react/solid'
import Image from 'next/image'

type FooterProps = {
  className?: string
}

const Footer: React.FC<FooterProps> = ({className}) => {
  return (
    <footer
      className={cx(
        'relative z-10 mt-16 flex items-center justify-center border-t border-gray-800/50 bg-[#090E19] px-8 pb-24 pt-24 md:mt-0 md:pb-40 md:pt-14',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-screen-lg items-center justify-center md:items-start md:justify-between">
        <nav
          className="flex flex-row flex-wrap gap-16 md:gap-24"
          aria-label="footer"
        >
          <div>
            <strong className="inline-block pb-5 font-mono text-sm uppercase tracking-wide">
              Learn
            </strong>
            <ul className="flex flex-col gap-2">
              <NavLink
                path="/books/total-typescript-essentials"
                label="Total TypeScript Book"
              />
              <NavLink path="/workshops" label="Premium Workshops" />
              <NavLink path="/tutorials" label="Free Tutorials" />
              <NavLink path="/tips" label="Tips" />
              <NavLink path="/articles" label="Articles" />
              <NavLink path="/concepts" label="Concepts" />
              <NavLink path="/search" label="Search" />
            </ul>
          </div>
          <div>
            <strong className="inline-block pb-5 font-mono text-sm uppercase tracking-wide">
              About
            </strong>
            <ul className="flex flex-col gap-2">
              <NavLink path="/products" label="All Products" />
              <NavLink path="/faq" label="FAQ" />
              <NavLink path="/credits" label="Credits" />
            </ul>
          </div>
          <div>
            <strong className="inline-block pb-5 font-mono text-sm uppercase tracking-wide">
              Tools
            </strong>
            <ul className="flex flex-col gap-2">
              <NavLink path="/typescript-learning-path" label="Learning Path" />
              <NavLink path="/vscode-extension" label="VSCode Extension" />
              <NavLink path="/ts-reset" label="TS Reset" />
              <NavLink
                path="https://mattpocock.com/discord"
                label="Discord Server"
              />
            </ul>
          </div>
          <div>
            <strong className="inline-block pb-5 font-mono text-sm uppercase tracking-wide">
              Contact
            </strong>
            <ul className="flex flex-col gap-2">
              <NavLink path="/contact" label="Contact Us" />
              <NavLink
                path="mailto:team@totaltypescript.com"
                label="Email Support"
              />
            </ul>
          </div>
        </nav>
        <Image
          src={require('../../../public/assets/seal@2x.png')}
          quality={100}
          alt=""
          aria-hidden="true"
          width={180}
          className="absolute -top-20 md:static md:-mt-12"
        />
      </div>
    </footer>
  )
}

const NavLink: React.FC<
  React.PropsWithChildren<{
    label: string | React.ReactElement
    icon?: React.ReactElement
    path?: string
    className?: string
    onClick?: () => void
  }>
> = ({onClick, label, icon, path, className}) => {
  const router = useRouter()
  const isActive = router.pathname === path
  if (onClick) {
    return (
      <li className="">
        <button
          onClick={onClick}
          aria-current={isActive ? 'page' : undefined}
          className={cx('text-gray-300 transition hover:text-white', className)}
        >
          {label}
        </button>
      </li>
    )
  }
  return path ? (
    <li className="">
      <Link
        href={path}
        passHref
        className={cx('text-gray-300 transition hover:text-white', className, {
          'text-white underline decoration-gray-600 underline-offset-4':
            isActive,
        })}
        onClick={() => {
          track(`clicked ${label} link in nav`)
        }}
      >
        {icon ? icon : null}
        {label}
      </Link>
    </li>
  ) : null
}

export default Footer
