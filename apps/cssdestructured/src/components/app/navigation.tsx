import {Logo} from 'components/images'
import Link from 'next/link'

const Navigation = () => {
  return (
    <nav className="w-full flex items-center justify-center sm:p-8 p-5">
      <Link href="/" aria-label="Home" passHref>
        <a>
          <Logo />
        </a>
      </Link>
    </nav>
  )
}

export default Navigation
