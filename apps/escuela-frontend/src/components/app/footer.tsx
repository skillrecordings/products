import * as React from 'react'
import DarkModeToggle from '../color-mode-toggle'
import Logo from 'components/logo'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="px-5 py-5">
      <div className="flex items-center justify-between w-full max-w-screen-xl pt-32 pb-32 mx-auto print:hidden">
        <Link href="/" passHref>
          <Logo />
        </Link>
        <DarkModeToggle />
      </div>
    </footer>
  )
}

export default Footer
