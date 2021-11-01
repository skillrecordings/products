import * as React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="py-24 print:hidden flex w-full items-center justify-center">
      <Link href="/terms">
        <a className="text-sm">Terms & Conditions</a>
      </Link>
    </footer>
  )
}

export default Footer
