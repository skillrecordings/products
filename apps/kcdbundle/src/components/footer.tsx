import * as React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/dist/client/router'

const Footer = () => {
  const router = useRouter()

  return (
    <footer className="py-24 print:hidden flex w-full items-center justify-center">
      {!router.pathname.includes('terms') && (
        <Link href="/terms">
          <a className="text-sm">Terms & Conditions</a>
        </Link>
      )}
    </footer>
  )
}

export default Footer
