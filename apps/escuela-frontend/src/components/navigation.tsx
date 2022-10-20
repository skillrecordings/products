import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import cx from 'classnames'

type Props = {
  className?: string
  containerClassName?: string
}

const Navigation: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  containerClassName = 'max-w-screen-lg flex justify-between w-full h-full items-center',
}) => {
  return (
    <nav
      aria-label="top"
      className={cx(
        'absolute top-0 z-30 flex h-14 w-full items-center justify-center bg-gray-200 px-3 print:hidden sm:h-16 sm:px-5',
        className,
      )}
    >
      <div className={containerClassName}>
        <NavLogo />
        <DesktopNav />
      </div>
    </nav>
  )
}

export default Navigation

const DesktopNav = () => {
  return (
    <div className="flex items-center space-x-5">
      <Link href="/articulos">
        <a>Artículos</a>
      </Link>
      <Link href="/aprende">
        <a>Cursos</a>
      </Link>
    </div>
  )
}

const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" aria-label="Escuela Frontend Home" passHref>
      <a tabIndex={router.pathname === '/' ? -1 : 0}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 416 416"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="208" cy="208" r="208" fill="black" />
          <path
            d="M268 110H223.585V169.554C223.585 173.564 221.948 177.173 218.681 180.382C215.414 183.59 211.738 185.194 207.653 185.194C199.076 185.194 191.061 186.698 183.606 189.706C176.153 192.713 169.719 196.874 164.308 202.188C158.896 207.501 154.658 213.818 151.595 221.137C148.532 228.456 147 236.326 147 244.748V304H191.418V244.748C191.418 240.537 193.154 236.927 196.626 233.92C199.688 230.511 203.365 228.806 207.653 228.806C216.435 228.806 224.502 227.302 231.854 224.295C239.206 221.287 245.537 217.176 250.847 211.963C256.156 206.749 260.34 200.533 263.404 193.315C266.468 186.097 268 178.176 268 169.554V110Z"
            fill="white"
          />
        </svg>
        <span className="sr-only">Escuela Frontend</span>
      </a>
    </Link>
  )
}
