import Link from 'next/link'
import {twMerge} from 'tailwind-merge'
import NextLink, {type LinkProps} from 'next/link'
import {NextRouter, useRouter} from 'next/router'
import cx from 'classnames'

const links = [
  {
    label: 'Free Tutorials',
    href: '/tutorials',
  },
  {
    label: 'Tips',
    href: '/tips',
  },
]

const Navigation: React.FC<{className?: string; wrapperClassName?: string}> = ({
  className,
  wrapperClassName,
}) => {
  const router = useRouter()

  return (
    <>
      <div
        className={twMerge(
          'bg-white flex items-center w-full shadow shadow-gray-600/5',
          wrapperClassName,
        )}
      >
        <nav
          aria-label="top"
          className={twMerge(
            'mx-auto flex items-center max-w-screen-lg w-full justify-between gap-2 px-5 sm:gap-0 py-4',
            className,
          )}
        >
          <div className="flex-1">
            <Link href="/" className="inline-flex flex-col font-serif">
              <>
                <div className="text-2xl font-semibold">Colt Steele</div>
                <div className="font-mono text-xs opacity-60 -translate-y-1">
                  Digital Garden
                </div>
              </>
            </Link>
          </div>
          <div className="flex items-center gap-10">
            {links.map(({label, href}) => {
              const isActive =
                router.asPath === href || router.pathname === href
              return (
                <Link
                  href={href}
                  className={cx(
                    'inline-flex font-mono text-xs uppercase font-semibold text-gray-600 hover:text-black decoration-gray-400 underline-offset-2',
                    {
                      underline: isActive,
                    },
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}

export default Navigation
