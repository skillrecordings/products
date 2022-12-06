import * as React from 'react'
import {GetServerSideProps} from 'next'
import {HomeTemplate} from 'templates/home-template'
import {getToken} from 'next-auth/jwt'
import {getActiveProducts} from '../../../path-to-purchase-react/products.server'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import type {CouponForCode} from '@skillrecordings/commerce-server/dist/@types'
import {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const {level} = query

  const token = await getToken({req})
  const {products} = await getActiveProducts()
  const commerceProps = await propsForCommerce({token, products, query})

  return {
    props: {
      level,
      ...commerceProps,
    },
  }
}

const LevelCustomHomePage = (
  props: CommerceProps & {
    level: string
  },
) => {
  return <HomeTemplate {...props} />
}

export default LevelCustomHomePage
