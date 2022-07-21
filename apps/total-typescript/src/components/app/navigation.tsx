import {useRouter} from 'next/router'
import Link from 'next/link'
import cx from 'classnames'
import config from 'config'

const Navigation = () => {
  return (
    <nav
      aria-label="top"
      className="absolute top-0 z-30 sm:h-16 h-14 xl:px-0 px-2 flex items-center w-full print:hidden"
    >
      <div className="flex items-center w-full h-full py-[2px] max-w-screen-xl mx-auto justify-between">
        <NavLogo />
      </div>
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
          'text-lg font-text font-semibold h-full group text-white flex-shrink-0 flex items-center group',
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
