import React from 'react'
import Image from 'next/image'
import {trpc} from '@/trpc/trpc.client'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {twMerge} from 'tailwind-merge'
import {cn} from '@skillrecordings/ui/utils/cn'
import {DocumentIcon} from '@heroicons/react/outline'

const useAbilities = () => {
  const {data: abilityRules} = trpc.abilities.getAbilities.useQuery()

  return createAppAbility(abilityRules || [])
}

const links = [
  {
    label: 'Articles',
    href: '/articles',
    icon: <DocumentIcon className="w-4 opacity-75" />,
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

  return (
    <nav
      aria-label="top"
      className={twMerge(
        'mx-auto flex w-full max-w-screen-md items-center justify-between p-5',
        className,
      )}
    >
      <Link
        href="/"
        aria-current={isRoot}
        tabIndex={isRoot ? -1 : 0}
        passHref
        className="flex items-center gap-1 text-lg font-semibold"
      >
        <Image
          src={require('../../../public/favicon.ico')}
          alt=""
          width={24}
          height={24}
        />{' '}
        Pro Next.js
      </Link>
      <ul className="flex items-center gap-5">
        {links.map(({href, label, icon}) => {
          const isCurrent = asPath === href

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'inline-flex items-center gap-1 text-sm opacity-75 transition hover:opacity-100',
                  {
                    underline: isCurrent,
                  },
                )}
                onClick={() => {
                  track(`clicked ${label} from navigation`)
                }}
                passHref
              >
                {icon} {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navigation
