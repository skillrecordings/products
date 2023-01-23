import * as React from 'react'
import Link from 'next/link'

export type NavigationProps = {title?: string}

const Navigation: React.FC<React.PropsWithChildren<NavigationProps>> = ({
  title = 'Product',
}) => {
  return (
    <nav className="w-full flex items-center justify-between print:hidden">
      <Link
        href="/"
        data-test-id="navigation-title"
        className="dark:hover:text-rose-300 hover:text-rose-500 text-lg font-bold tracking-tight leading-tight"
      >
        {title}
      </Link>
    </nav>
  )
}

export default Navigation
