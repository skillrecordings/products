import Layout from 'components/layout'
import type {NextPage} from 'next'
import {trpc} from '../trpc/trpc.client'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'

const useAbilities = () => {
  const {data: abilityRules} = trpc.abilities.getAbilities.useQuery()

  return createAppAbility(abilityRules || [])
}

const Home: NextPage = () => {
  const ability = useAbilities()
  const canViewTeam = ability.can('view', 'Team')
  const canViewInvoice = ability.can('view', 'Invoice')

  return (
    <Layout>
      <h1 className="text-4xl text-primary-500 font-bold flex items-center justify-center flex-grow">
        Hi! 👋
      </h1>
      <ul>
        <li>Can View Invoice: {canViewInvoice ? 'true' : 'false'}</li>
        <li>Can View Team: {canViewTeam ? 'true' : 'false'}</li>
      </ul>
    </Layout>
  )
}

export default Home
