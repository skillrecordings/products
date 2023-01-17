import {useRouter} from 'next/router'
import Link from 'next/link'
import {track} from 'utils/analytics'

const Navigation = () => {
  const {pathname, asPath} = useRouter()
  const isRoot = pathname === '/'

  return (
    <nav aria-label="top" className="lg:w-16 w-full">
      <div className="lg:w-16 w-full lg:h-screen lg:fixed bg-brand text-black z-10 flex lg:flex-col flex-row justify-between">
        <Link
          href="/"
          aria-current={isRoot}
          tabIndex={isRoot ? -1 : 0}
          passHref
        >
          <div
            aria-hidden="true"
            className="lg:p-2 p-1 lg:hover:p-3 hover:p-2 transition-all font-mono uppercase font-bold text-sm text-center leading-none lg:h-16 lg:w-full w-12 h-12 items-center justify-center bg-white/90 grid grid-cols-2 relative"
          >
            <span>E</span>
            <span>P</span>
            <span>I</span>
            <span>C</span>
          </div>
          <div className="sr-only">Epic Web Dev</div>
        </Link>
        <div className="lg:block hidden pl-14 whitespace-nowrap lg:-rotate-90 uppercase font-mono font-semibold text-xs">
          New Learning Experience by Kent C. Dodds
        </div>
      </div>
      <div className="absolute lg:right-7 lg:top-5 right-4 top-3.5 lg:text-white text-black z-10">
        <Link
          href="/articles"
          passHref
          onClick={() => {
            track('clicked Articles from navigation', {
              page: asPath,
            })
          }}
          className="flex items-center lg:font-medium font-semibold before:content-[''''] before:absolute lg:text-base text-sm before:w-1 before:h-1 before:bg-brand before:-ml-2.5 hover:underline decoration-white/40"
        >
          Articles
        </Link>
      </div>
    </nav>
  )
}

export default Navigation
