import {trpc} from 'trpc/trpc.client'

export const ResourceCTA = ({resourceIdOrSlug}: {resourceIdOrSlug: string}) => {
  const {data: cta} = trpc.cta.forResource.useQuery({
    slugOrId: resourceIdOrSlug,
  })

  return (
    // TODO: Implement UI
    <div />
  )
}
