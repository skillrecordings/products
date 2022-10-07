import {useRouter} from 'next/router'
import Link from 'next/link'

const Navigation = () => {
  const {pathname} = useRouter()
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
          <a>
            <div
              aria-hidden="true"
              className="lg:p-2 p-1 font-mono uppercase font-bold text-center leading-none lg:h-16 lg:w-full w-12 h-12 items-center justify-center bg-white/90 grid grid-cols-2 relative"
            >
              <span>E</span>
              <span>P</span>
              <span>I</span>
              <span>C</span>
            </div>
            <div className="sr-only">Epic Web Dev</div>
          </a>
        </Link>
        <div className="lg:block hidden pl-14 whitespace-nowrap lg:-rotate-90 uppercase font-mono font-semibold text-sm">
          New Learning Experience by Kent C. Dodds
        </div>
      </div>
    </nav>
  )
}

export default Navigation
