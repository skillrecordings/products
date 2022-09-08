import {useRouter} from 'next/router'
import Link from 'next/link'
import cx from 'classnames'
import config from 'config'
import {PropsWithChildren} from 'react'

type Props = {
  className?: string
}

const Navigation: React.FC<PropsWithChildren<Props>> = ({className}) => {
  return (
    <nav
      aria-label="top"
      className={cx(
        'absolute top-0 z-30 sm:h-16 h-14 sm:px-5 px-3 flex items-center justify-center w-full print:hidden',
        className,
      )}
    >
      <NavLogo />
    </nav>
  )
}

export const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" passHref>
      <a
        aria-label={`${config.title} Home`}
        className={cx(
          'text-xl font-text font-semibold h-full group text-white flex-shrink-0 flex items-center group',
        )}
        tabIndex={router.pathname === '/' ? -1 : 0}
      >
        <span className="opacity-90 mr-0.5 font-light">Total</span>
        <span>TypeScript</span>
      </a>
    </Link>
  )
}

export default Navigation
