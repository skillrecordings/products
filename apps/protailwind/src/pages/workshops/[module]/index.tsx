import React from 'react'
import {SanityDocument} from '@sanity/client'
import {GetStaticPaths, GetStaticProps, GetServerSideProps} from 'next'
import {getAllWorkshops, getWorkshop} from '../../../lib/workshops'
import WorkshopTemplate from '../../../templates/workshop-template'
import {getActiveProducts} from 'path-to-purchase-react/products.server'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {getToken} from 'next-auth/jwt'
import {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'

export const USER_ID_QUERY_PARAM_KEY = 'learner'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  query,
  params,
}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  const workshop = await getWorkshop(params?.module as string)
  const {products} = await getActiveProducts()
  if (!workshop) {
    return {
      notFound: true,
    }
  }
  const token = await getToken({req})
  const commerceProps = await propsForCommerce({
    token,
    products,
    query,
  })
  return {
    props: {workshop, commerceProps: commerceProps.props},
  }
}

const WorkshopPage: React.FC<{
  workshop: SanityDocument
  commerceProps: CommerceProps
}> = ({workshop, commerceProps}) => {
  // TODO: Load subscriber, find user via Prisma/api using USER_ID_QUERY_PARAM_KEY
  return <WorkshopTemplate workshop={workshop} commerceProps={commerceProps} />
}

export default WorkshopPage
