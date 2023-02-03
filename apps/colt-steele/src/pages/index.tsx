import Layout from 'components/layout'
import type {NextPage} from 'next'
import {trpc} from '../trpc/trpc.client'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import Image from 'next/image'
import {PrimaryNewsletterCta} from '../components/primary-newsletter-cta'

const useAbilities = () => {
  const {data: abilityRules} = trpc.abilities.getAbilities.useQuery()

  return createAppAbility(abilityRules || [])
}

const Home: NextPage = () => {
  const ability = useAbilities()
  const canViewTeam = ability.can('view', 'Team')
  const canViewInvoice = ability.can('view', 'Invoice')

  return (
    <Layout className="bg-[#e0dec4] grid h-screen place-items-center">
      <Image
        src="https://res.cloudinary.com/dwppkb069/image/upload/dpr_auto,q_auto,g_auto,f_auto/v1675452762/colt-steel-header-image_x0yxov.jpg"
        alt="Colt Steele"
        width={800}
        height={800}
      />
      <PrimaryNewsletterCta />
    </Layout>
  )
}

export default Home
