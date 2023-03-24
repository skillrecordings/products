import * as React from 'react'

const WorkshopTemplate: React.FC<any> = ({workshop}) => {
  console.log({workshop})
  // const router = useRouter()
  // const {data: commerceProps} = trpc.pricing.propsForCommerce.useQuery(
  //   router.query,
  // )
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return (
    // <ModuleProgressProvider moduleSlug={workshop.slug.current}>
    //   <WorkshopTemplate workshop={workshop} commerceProps={commerceProps} />
    // </ModuleProgressProvider>
    <div>
      <div>Workshop {workshop.title}</div>
    </div>
  )
}

export default WorkshopTemplate
