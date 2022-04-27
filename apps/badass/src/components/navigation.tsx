import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SkullLogo from '../../public/assets/skull@2x.png'

const Navigation = () => {
  return (
    <nav className="w-full left-0 top-0 px-2 pt-2">
      <Link href="/" passHref>
        <a className="inline-flex items-center">
          <div className="flex items-center justify-center sm:w-auto w-16">
            <Image
              src={SkullLogo}
              alt="Badass Skull Logo"
              width={80}
              height={80}
            />
          </div>
          <div className="font-heading text-2xl">
            Badass
            <span className="pl-0.5 text-base font-condensed text-badass-yellow-500">
              .dev
            </span>
          </div>
        </a>
      </Link>
    </nav>
  )
}

export default Navigation
