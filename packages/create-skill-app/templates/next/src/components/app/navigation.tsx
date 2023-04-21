import {trpc} from 'trpc/trpc.client'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'

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
]

const Navigation = () => {
  const ability = useAbilities()
  const canViewTeam = ability.can('view', 'Team')
  const canViewInvoice = ability.can('view', 'Invoice')
  const {pathname, asPath} = useRouter()
  const isRoot = pathname === '/'

  return (
    <nav
      aria-label="top"
      className="mx-auto flex w-full max-w-screen-xl items-center justify-between p-5"
    >
      <Link
        href="/"
        aria-current={isRoot}
        tabIndex={isRoot ? -1 : 0}
        passHref
        className="text-base font-bold"
      >
        {process.env.NEXT_PUBLIC_SITE_TITLE}
      </Link>
      <ul className="flex items-center gap-5">
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
      </ul>
    </nav>
  )
}

export default Navigation
