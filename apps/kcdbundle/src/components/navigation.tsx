import * as React from 'react'
import Link from 'next/link'
import Logo from '../../public/logo.png'
import Image from 'next/image'

const Navigation = () => {
  return (
    <nav className="absolute z-10 sm:p-8 p-5 top-0 left-0 w-full flex items-center justify-center print:hidden text-white">
      <Link href="/">
        <a className="w-40">
          <Image src={Logo} alt="KCD Bundle" quality={100} />
        </a>
      </Link>
    </nav>
  )
}

export default Navigation
