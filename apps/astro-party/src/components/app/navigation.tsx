import React from 'react'
import Image from 'next/image'
import {motion, useAnimate} from 'framer-motion'
import {trpc} from 'trpc/trpc.client'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {twMerge} from 'tailwind-merge'

const useAbilities = () => {
  const {data: abilityRules} = trpc.abilities.getAbilities.useQuery()

  return createAppAbility(abilityRules || [])
}

const links = [
  {
    label: 'Articles',
    href: '/articles',
  },
  {
    label: 'Tips',
    href: '/tips',
  },
  {
    label: 'Free Tutorials',
    href: '/tutorials',
  },
]

type NavigationProps = {
  className?: string
}

const Navigation: React.FC<NavigationProps> = ({className}) => {
  const ability = useAbilities()
  const canViewTeam = ability.can('view', 'Team')
  const canViewInvoice = ability.can('view', 'Invoice')
  const {pathname, asPath} = useRouter()
  const isRoot = pathname === '/'
  const [logoRef, animate] = useAnimate()

  return (
    <nav
      aria-label="top"
      className={twMerge(
        'relative z-50 mx-auto flex w-full max-w-screen-xl items-center justify-center p-5',
        className,
      )}
    >
      <Logo />
      {/* <ul className="flex items-center gap-5">
        {links.map(({href, label}) => {
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={() => {
                  track(`clicked ${label} from navigation`)
                }}
                passHref
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul> */}
    </nav>
  )
}

export default Navigation

const Logo = () => {
  const {pathname, asPath} = useRouter()
  const isRoot = pathname === '/'
  const [logoRef, animate] = useAnimate()

  return (
    <Link
      ref={logoRef}
      href="/"
      aria-current={isRoot}
      tabIndex={isRoot ? -1 : 0}
      passHref
      className="flex h-[40px] w-[76px] scale-90 flex-col items-start justify-center overflow-hidden font-rounded text-2xl font-bold uppercase leading-[0.45] transition active:scale-95 sm:scale-100"
      onMouseOver={() => {
        animate(
          'span',
          {
            x: -428,
          },
          {
            ease: 'anticipate',
            duration: 1.5,
          },
        )
        animate(
          'strong',
          {
            scale: [1, 0.9, 1],
          },
          {
            delay: 1.05,
            duration: 0.3,
            ease: 'easeOut',
          },
        )
      }}
      onMouseOut={() => {
        animate('span', {
          x: 0,
        })
        animate('strong', {
          scale: 1,
        })
      }}
    >
      <span className="flex">
        astro{' '}
        <div aria-hidden="true" className="inline-flex">
          oooooooooooooooooooo{'\u00A0'}astro
        </div>
      </span>
      <br />
      <strong>party</strong>
    </Link>
  )
}
