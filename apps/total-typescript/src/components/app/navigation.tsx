import Link from 'next/link'
import {useRouter} from 'next/router'

const Navigation = () => {
  return (
    <nav
      aria-label="top"
      className="px-5 w-full flex items-center justify-center h-24 absolute top-0 left-0"
    >
      <div className="max-w-screen-xl w-full flex items-center justify-between">
        <NavLogo />
      </div>
    </nav>
  )
}
export default Navigation

export const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" aria-label="Total TypeScript Home" passHref>
      <a
        className="font-text text-lg"
        tabIndex={router.pathname === '/' ? -1 : 0}
      >
        Total<span className="font-bold">TypeScript</span>
      </a>
    </Link>
  )
}
