import React from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import cx from 'classnames'

const Navigation = () => {
  return (
    <nav aria-label="top" className="py-5 absolute left-0 top-0 w-full z-10">
      <div className="mx-auto px-5 max-w-screen-lg flex justify-between items-center">
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
      <NavSlots>
        <NavLink href="/articles">Articles</NavLink>
      </NavSlots>
    </div>
  )
}

const NavSlots: React.FC = ({children}) => {
  return <div className="flex items-center">{children}</div>
}

type NavLinkProps = React.PropsWithChildren<{
  href: string
}>

const NavLink: React.FC<NavLinkProps> = ({href, children, ...props}) => {
  const router = useRouter()
  const isActive = router.pathname === href

  return (
    <Link href={href} passHref>
      <a
        aria-current={isActive ? 'page' : undefined}
        className={cx('', {
          underline: isActive,
        })}
        {...props}
      >
        {children}
      </a>
    </Link>
  )
}

const NavLogo = () => {
  const router = useRouter()
  return (
    <Link href="/" aria-label="Pro Tailwind Home" passHref>
      <a tabIndex={router.pathname === '/' ? -1 : 0}>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="114"
          height="28"
          fill="none"
          viewBox="0 0 114 28"
        >
          <path
            fill="#F3C41C"
            fill-rule="evenodd"
            d="M37.144 0c-.094.768-.179 1.493-.26 2.18-.456 3.92-.764 6.556-1.813 8.353-1.55 2.017-3.973 2.632-7.927 3.077v.867c3.845.49 6.204 1.02 7.749 2.857 1.456 2.052 1.745 5.186 2.2 10.111l.05.555c.075-.614.143-1.2.21-1.76.66-5.652 1.012-8.656 3.726-10.435 1.641-.793 3.908-1.107 7.065-1.466v-.694c-4.133-.487-6.735-.868-8.408-2.348-1.528-1.82-1.85-4.702-2.37-9.346A428.57 428.57 0 0 0 37.143 0Z"
            clip-rule="evenodd"
          />
          <path
            fill="#fff"
            d="M6.15 9.44c1.56 0 2.12.58 2.12 1.84 0 1.26-.6 1.86-2.08 1.86h-1.9v-3.7h1.86Zm.36 6.04c2.96 0 4.6-1.86 4.6-4.2C11.11 8.46 9.59 7 6.41 7h-5v12h2.88v-3.52h2.22ZM15.044 19v-4.22c0-1.68.54-2.24 2.44-2.24h.56V9.42h-.28c-1.24 0-2.04.54-2.64 3.18h-.22V9.52h-2.58V19h2.72Zm8.732.28c3.02 0 4.86-1.9 4.86-5.02 0-3.16-1.9-5-4.86-5-3.02 0-4.9 1.84-4.9 5 0 3.12 1.82 5.02 4.9 5.02Zm-.02-7.74c1.5 0 2.16.98 2.16 2.7 0 1.72-.64 2.72-2.16 2.72-1.54 0-2.16-1-2.16-2.72 0-1.72.66-2.7 2.16-2.7Zm20.251-1.9h3.46V19h2.88V9.64h3.46V7h-9.8v2.64Zm13.359 7.48c-1.04 0-1.38-.48-1.38-1.08 0-.66.56-1.06 1.44-1.06h1.96v.38c0 1.02-.78 1.76-2.02 1.76Zm2.16 1.88h2.56v-6.02c0-2.38-1.18-3.7-4.06-3.7-2.62 0-3.94 1.22-4.26 2.94l2.56.58c.18-.92.7-1.36 1.6-1.36 1.04 0 1.46.56 1.46 1.54v.66h-2.48c-2.5 0-3.5 1.18-3.5 2.88 0 1.86 1.18 2.68 2.78 2.68 1.62 0 2.62-.96 3.1-2.46h.24V19Zm7.318-10.82V6.22h-2.84v1.96h2.84ZM66.785 19V9.52h-2.72V19h2.72ZM71.55 6.16h-2.72V19h2.72V6.16Zm10.147 3.36h-3.06l-.78 3.74c-.24 1.18-.46 2.4-.66 3.66h-.36c-.2-1.24-.46-2.38-.76-3.68l-.84-3.72h-2.8l2.64 9.48h3.46l.74-4.08c.18-1.06.38-2.22.52-3.34h.34c.14 1.14.32 2.26.52 3.34l.8 4.08h3.56l2.62-9.48h-2.68l-.72 3.72c-.26 1.3-.52 2.46-.74 3.68h-.34c-.2-1.28-.42-2.48-.68-3.66l-.78-3.74Zm9.64-1.34V6.22h-2.84v1.96h2.84ZM91.278 19V9.52h-2.72V19h2.72Zm4.725-5.28c0-1.18.74-2 1.9-2 1 0 1.44.66 1.44 1.62V19h2.72v-6.42c0-2.06-.92-3.32-2.74-3.32-1.48 0-2.64.96-3.2 2.8h-.18V9.52h-2.66V19h2.72v-5.28Zm12.025 3.16c-1.34 0-1.92-.84-1.92-2.54 0-1.78.6-2.62 1.9-2.62 1.2 0 1.94.88 1.94 2.26v.74c0 1.32-.78 2.16-1.92 2.16Zm1.92 2.12h2.72V6.16h-2.72v5.76h-.18c-.5-1.66-1.52-2.66-3.04-2.66-2.08 0-3.28 1.78-3.28 5.08 0 3.2 1.2 4.94 3.24 4.94 1.58 0 2.62-1.1 3.1-2.76h.16V19Z"
          />
        </svg>
        <span className="sr-only">Pro Tailwind</span>
      </a>
    </Link>
  )
}
