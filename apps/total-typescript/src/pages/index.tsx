import {propsForCommerce} from '@skillrecordings/commerce-server'
import {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {getActiveProducts} from '@skillrecordings/skill-lesson/path-to-purchase/products.server'
import * as React from 'react'
import {HomeTemplate} from '../templates/home-template'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const token = await getToken({req})
  const {products = []} = await getActiveProducts()

  return await propsForCommerce({query, token, products})
}

export const HomePage: React.FC<React.PropsWithChildren<CommerceProps>> = (
  props,
) => {
  return <HomeTemplate {...props} />
}

export default HomePage
