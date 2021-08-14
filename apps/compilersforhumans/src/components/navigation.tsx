import * as React from 'react'
import config from '../../config.json'
import Link from 'next/link'
import {useViewer} from '@skillrecordings/viewer'
import {
  motion,
  useMotionValue,
  useTransform,
  useViewportScroll,
} from 'framer-motion'
import {isBrowser} from 'utils/is-browser'
import {useRouter} from 'next/router'
import Icon from './icon'

const Navigation = () => {
  const {isAuthenticated, logout} = useViewer()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(
    isBrowser() && router.pathname === '/' && window.scrollY === 0
      ? false
      : true,
  )
  const {scrollYProgress} = useViewportScroll()
  const threshold = 0.1
  const yRange = useTransform(scrollYProgress, [0, threshold], [0, 1])
  React.useEffect(() => setMounted(true), [])
  React.useEffect(() => yRange.onChange((v) => setScrolled(v >= 1)), [yRange])

  return mounted ? (
    <nav
      className={`z-30 border-b ${
        scrolled
          ? 'xl:border-transparent border-gray-100 xl:dark:border-transparent dark:border-gray-800 xl:dark:bg-transparent dark:bg-black xl:bg-transparent bg-gray-50'
          : 'border-transparent'
      } transition-all duration-500 fixed left-0 top-0 w-full flex items-center justify-between print:hidden`}
    >
      <Link href="/">
        <a className="flex-shrink-0 py-3 px-4 relative overflow-hidden flex items-center sm:text-lg font-bold leading-tight">
          <Icon className="w-9" />{' '}
          <motion.div
            className="flex items-center"
            initial={false}
            transition={{type: 'spring', mass: 0.4, damping: 25}}
            animate={{opacity: scrolled ? 1 : 0, y: scrolled ? 0 : -10}}
          >
            <span className="pl-2">{config.defaultTitle}</span>
          </motion.div>
        </a>
      </Link>

      {/* <div className="flex items-center ">
        {isAuthenticated ? (
          <button onClick={logout}>log out</button>
        ) : (
          <div className="py-2 px-4 sm:text-sm text-[0.7rem]">
            New course <br className="sm:hidden block" /> by John Otander &
            Laurie Barth
          </div>
        )}
      </div> */}
    </nav>
  ) : null
}

export default Navigation
