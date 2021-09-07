import * as React from 'react'
import DarkModeToggle from '../color-mode-toggle'
import Logo from 'components/logo'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="px-5 py-5">
      <div className="flex justify-between items-center pt-32 pb-32 max-w-screen-xl mx-auto w-full print:hidden">
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
        <DarkModeToggle />
      </div>
    </footer>
  )
}

export default Footer
