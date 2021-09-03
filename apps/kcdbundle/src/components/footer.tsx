import * as React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="pt-24 print:hidden flex w-full items-center justify-center">
      <Link href="/terms">
        <a>Terms & Conditions</a>
      </Link>
    </footer>
  )
}

export default Footer
