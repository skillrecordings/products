import Link from 'next/link'
import {twMerge} from 'tailwind-merge'
import NextLink, {type LinkProps} from 'next/link'
import {NextRouter, useRouter} from 'next/router'
import cx from 'classnames'

const Navigation: React.FC<{className?: string}> = ({className}) => {
  return (
    <>
      <nav
        aria-label="top"
        className={twMerge(
          'mx-auto flex items-center justify-between gap-2 px-5 sm:gap-0 pt-4',
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
        <div>
          <Link href="/tips" className="inline-flex flex-col">
            Tips
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navigation
